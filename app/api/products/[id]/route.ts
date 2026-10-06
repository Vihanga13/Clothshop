import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { serializeProduct } from '@/lib/serializers';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/products/[id] - Get product by ID or slug
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    const dbProduct = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        reviews: true,
      },
    });

    if (!dbProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: serializeProduct(dbProduct),
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product details or inventory (Admin)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.tagline !== undefined) updateData.tagline = body.tagline;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined)
      updateData.originalPrice = body.originalPrice ? Number(body.originalPrice) : null;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = JSON.stringify(body.tags);
    if (body.badge !== undefined) updateData.badge = body.badge;
    if (body.badgeColor !== undefined) updateData.badgeColor = body.badgeColor;
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.description !== undefined) updateData.description = body.description;
    if (body.features !== undefined) updateData.features = JSON.stringify(body.features);
    if (body.fabric !== undefined) updateData.fabric = body.fabric;
    if (body.fit !== undefined) updateData.fit = body.fit;
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.isBestSeller !== undefined) updateData.isBestSeller = Boolean(body.isBestSeller);
    if (body.images !== undefined) updateData.images = JSON.stringify(body.images);
    if (body.colors !== undefined) updateData.colors = JSON.stringify(body.colors);
    if (body.sizes !== undefined) updateData.sizes = JSON.stringify(body.sizes);

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        reviews: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: serializeProduct(updated),
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Remove product (Admin)
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
