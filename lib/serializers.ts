import { Product, ClothingCategory, Review } from '@/types';

// Safely parse JSON with fallback
function safeParse<T>(jsonStr: string | null | undefined, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}

// Convert a DB product record into the frontend Product interface
export function serializeProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    tagline: dbProduct.tagline,
    price: dbProduct.price,
    originalPrice: dbProduct.originalPrice ?? undefined,
    category: dbProduct.category as ClothingCategory,
    tags: safeParse<string[]>(dbProduct.tags, []),
    badge: dbProduct.badge ?? undefined,
    badgeColor: dbProduct.badgeColor ?? undefined,
    rating: dbProduct.rating ?? 5.0,
    reviewCount: dbProduct.reviewCount ?? 0,
    images: safeParse<string[]>(dbProduct.images, []),
    colors: safeParse<{ name: string; hex: string }[]>(dbProduct.colors, []),
    sizes: safeParse<string[]>(dbProduct.sizes, []),
    description: dbProduct.description,
    features: safeParse<string[]>(dbProduct.features, []),
    fabric: dbProduct.fabric ?? undefined,
    fit: dbProduct.fit ?? undefined,
    care: dbProduct.care ? safeParse<string[]>(dbProduct.care, []) : undefined,
    stock: dbProduct.stock,
    isBestSeller: Boolean(dbProduct.isBestSeller),
    isFeatured: Boolean(dbProduct.isFeatured),
    reviews: (dbProduct.reviews ?? []).map((r: any): Review => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      date: r.date,
      title: r.title,
      comment: r.comment,
      verified: Boolean(r.verified),
    })),
  };
}
