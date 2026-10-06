import { PrismaClient } from '@prisma/client';
import { PRODUCTS } from '../data/products';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with products...');

  for (const product of PRODUCTS) {
    const { reviews, ...productData } = product;

    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: productData.name,
        slug: productData.slug,
        tagline: productData.tagline,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: productData.category,
        tags: JSON.stringify(productData.tags),
        badge: productData.badge,
        badgeColor: productData.badgeColor,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        images: JSON.stringify(productData.images),
        colors: JSON.stringify(productData.colors),
        sizes: JSON.stringify(productData.sizes),
        description: productData.description,
        features: JSON.stringify(productData.features),
        fabric: productData.fabric,
        fit: productData.fit,
        care: productData.care ? JSON.stringify(productData.care) : null,
        stock: productData.stock,
        isBestSeller: Boolean(productData.isBestSeller),
        isFeatured: Boolean(productData.isFeatured),
      },
      create: {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        tagline: productData.tagline,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: productData.category,
        tags: JSON.stringify(productData.tags),
        badge: productData.badge,
        badgeColor: productData.badgeColor,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        images: JSON.stringify(productData.images),
        colors: JSON.stringify(productData.colors),
        sizes: JSON.stringify(productData.sizes),
        description: productData.description,
        features: JSON.stringify(productData.features),
        fabric: productData.fabric,
        fit: productData.fit,
        care: productData.care ? JSON.stringify(productData.care) : null,
        stock: productData.stock,
        isBestSeller: Boolean(productData.isBestSeller),
        isFeatured: Boolean(productData.isFeatured),
      },
    });

    if (reviews && reviews.length > 0) {
      for (const review of reviews) {
        await prisma.review.upsert({
          where: { id: review.id },
          update: {
            author: review.author,
            rating: review.rating,
            date: review.date,
            title: review.title,
            comment: review.comment,
            verified: review.verified,
          },
          create: {
            id: review.id,
            productId: product.id,
            author: review.author,
            rating: review.rating,
            date: review.date,
            title: review.title,
            comment: review.comment,
            verified: review.verified,
          },
        });
      }
    }
  }

  console.log(`Successfully seeded ${PRODUCTS.length} products with reviews!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
