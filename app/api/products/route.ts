import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { serializeProduct } from '@/lib/serializers';

// GET /api/products - List products with optional search, category, rating, sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minRating = searchParams.get('minRating');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy');

    const where: any = {};

    if (category && category !== 'All') {
      where.category = { equals: category };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { tagline: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const dbProducts = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        reviews: true,
      },
    });

    const products = dbProducts.map(serializeProduct);

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      tagline,
      price,
      originalPrice,
      category,
      tags = [],
      badge,
      badgeColor,
      images = [],
      colors = [],
      sizes = [],
      description,
      features = [],
      fabric,
      fit,
      care = [],
      stock = 50,
      isFeatured = false,
      isBestSeller = false,
    } = body;

    if (!name || !price || !category || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, price, category, description' },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const id = `prod-${Date.now().toString(36)}`;

    const newProduct = await prisma.product.create({
      data: {
        id,
        name,
        slug: generatedSlug,
        tagline: tagline || name,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        category,
        tags: JSON.stringify(tags),
        badge: badge || null,
        badgeColor: badgeColor || null,
        rating: 5.0,
        reviewCount: 0,
        images: JSON.stringify(images),
        colors: JSON.stringify(colors),
        sizes: JSON.stringify(sizes),
        description,
        features: JSON.stringify(features),
        fabric: fabric || null,
        fit: fit || null,
        care: care ? JSON.stringify(care) : null,
        stock: Number(stock),
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
      },
      include: {
        reviews: true,
      },
    });

    return NextResponse.json(
      { success: true, product: serializeProduct(newProduct) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
