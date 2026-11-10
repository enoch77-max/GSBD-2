import { db } from "@/db";
import { categories, products, reviews, orders, orderItems } from "@/db/schema";
import { seedCategories, seedProducts, seedReviews } from "@/db/seed-data";
import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql, ne } from "drizzle-orm";

let seeded = false;
let seeding: Promise<void> | null = null;

export async function ensureSeeded() {
  if (seeded) return;
  if (!seeding) {
    seeding = (async () => {
      await db.transaction(async (tx) => {
        await tx.execute(sql`SELECT pg_advisory_xact_lock(42424242)`);
        await seedIfEmpty(tx);
      });
    })().catch((e) => {
      seeding = null;
      throw e;
    });
  }
  await seeding;
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function seedIfEmpty(db: Tx) {
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
  if (row && row.count > 0) {
    seeded = true;
    return;
  }
  const insertedCats = await db
    .insert(categories)
    .values(seedCategories)
    .onConflictDoNothing()
    .returning();
  const catMap = new Map<string, number>();
  for (const c of insertedCats) catMap.set(c.slug, c.id);
  if (catMap.size === 0) {
    const all = await db.select().from(categories);
    for (const c of all) catMap.set(c.slug, c.id);
  }

  const inserted = await db
    .insert(products)
    .values(
      seedProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        categoryId: catMap.get(p.category)!,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        stock: p.stock,
        images: p.images,
        specs: p.specs,
        highlights: p.highlights,
        tags: p.tags,
        soldCount: p.soldCount,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
      })),
    )
    .returning({ id: products.id, slug: products.slug });
  const prodMap = new Map(inserted.map((p) => [p.slug, p.id]));

  await db.insert(reviews).values(
    seedReviews.map((r) => ({
      productId: prodMap.get(r.product)!,
      author: r.author,
      location: r.location,
      rating: r.rating,
      title: r.title,
      body: r.body,
      helpful: r.helpful,
      verified: true,
      createdAt: new Date(Date.now() - r.daysAgo * 86400000),
    })),
  );
  await recomputeRatings(undefined, db);
  seeded = true;
}

export async function recomputeRatings(productId?: number, client: Tx | typeof db = db) {
  await client.execute(sql`
    UPDATE products p SET
      rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews r WHERE r.product_id = p.id), 0),
      review_count = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id)
    ${productId ? sql`WHERE p.id = ${productId}` : sql``}
  `);
}

export async function getCategories() {
  await ensureSeeded();
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  await ensureSeeded();
  const [c] = await db.select().from(categories).where(eq(categories.slug, slug));
  return c ?? null;
}

export async function getFeaturedProducts() {
  await ensureSeeded();
  return db.select().from(products).where(eq(products.featured, true)).orderBy(desc(products.soldCount), asc(products.id)).limit(8);
}

export async function getBestSellers(limit = 8) {
  await ensureSeeded();
  return db.select().from(products).orderBy(desc(products.soldCount), asc(products.id)).limit(limit);
}

export async function getNewArrivals(limit = 4) {
  await ensureSeeded();
  return db.select().from(products).orderBy(desc(products.isNew), desc(products.createdAt), desc(products.id)).limit(limit);
}

export type ProductQuery = {
  category?: string;
  q?: string;
  sort?: string;
  min?: number;
  max?: number;
  brand?: string[];
  inStock?: boolean;
  rating?: number;
};

export async function queryProducts(opts: ProductQuery) {
  await ensureSeeded();
  const conds = [];
  if (opts.category) {
    const cat = await getCategoryBySlug(opts.category);
    if (cat) conds.push(eq(products.categoryId, cat.id));
  }
  if (opts.q) {
    const term = `%${opts.q}%`;
    conds.push(
      or(ilike(products.name, term), ilike(products.brand, term), ilike(products.shortDescription, term), sql`${products.tags}::text ILIKE ${term}`),
    );
  }
  if (opts.min != null) conds.push(gte(products.price, opts.min));
  if (opts.max != null) conds.push(lte(products.price, opts.max));
  if (opts.brand && opts.brand.length) conds.push(inArray(products.brand, opts.brand));
  if (opts.inStock) conds.push(gte(products.stock, 1));
  if (opts.rating) conds.push(gte(products.rating, opts.rating));

  let order;
  switch (opts.sort) {
    case "price-asc":
      order = asc(products.price);
      break;
    case "price-desc":
      order = desc(products.price);
      break;
    case "rating":
      order = desc(products.rating);
      break;
    case "newest":
      order = desc(products.createdAt);
      break;
    default:
      order = desc(products.soldCount);
  }
  return db
    .select()
    .from(products)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(order, asc(products.id));
}

export async function getBrands() {
  await ensureSeeded();
  const rows = await db.select({ brand: products.brand, count: sql<number>`count(*)::int` }).from(products).groupBy(products.brand).orderBy(asc(products.brand));
  return rows;
}

export async function getProductBySlug(slug: string) {
  await ensureSeeded();
  const [p] = await db.select().from(products).where(eq(products.slug, slug));
  return p ?? null;
}

export async function getProductReviews(productId: number) {
  return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.helpful), desc(reviews.createdAt));
}

export async function getRelatedProducts(categoryId: number, excludeId: number, limit = 4) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, categoryId), ne(products.id, excludeId)))
    .orderBy(desc(products.soldCount))
    .limit(limit);
}

export async function getProductsByIds(ids: number[]) {
  if (!ids.length) return [];
  return db.select().from(products).where(inArray(products.id, ids));
}

export async function getOrderByNumber(orderNumber: string) {
  const [o] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
  if (!o) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
  return { ...o, items };
}

export async function getCategoryMap() {
  const cats = await getCategories();
  return new Map(cats.map((c) => [c.id, c]));
}
