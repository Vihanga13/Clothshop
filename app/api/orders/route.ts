import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/orders - List all orders (for Admin or history)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    const where: any = {};
    if (status) where.status = status;
    if (email) where.customerEmail = email;

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Place a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      items,
      subtotal,
      discount = 0,
      shipping = 0,
      tax = 0,
      total,
      promoCode,
      paymentMethod = 'card',
      paymentStatus = 'paid',
    } = body;

    if (!customerName || !customerEmail || !addressLine1 || !city || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required shipping and contact details, and at least one item.' },
        { status: 400 }
      );
    }

    // Generate unique human-friendly order number e.g. ORD-M8KJ9L
    const orderNumber = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Perform database transaction: Create order + decrement stock
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create order and associated order items
      const created = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone: customerPhone || '',
          addressLine1,
          addressLine2: addressLine2 || null,
          city,
          state: state || '',
          postalCode: postalCode || '',
          country: country || 'Sri Lanka',
          subtotal: Number(subtotal),
          discount: Number(discount),
          shipping: Number(shipping),
          tax: Number(tax),
          total: Number(total),
          promoCode: promoCode || null,
          paymentMethod,
          paymentStatus,
          status: 'confirmed',
          items: {
            create: items.map((item: any) => ({
              productId: item.productId || null,
              name: item.name,
              price: Number(item.price),
              image: item.image || '',
              color: item.color || '',
              size: item.size || '',
              quantity: Number(item.quantity || 1),
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Decrement stock for purchased products
      for (const item of items) {
        if (item.productId) {
          await tx.product.updateMany({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: Number(item.quantity || 1),
              },
            },
          });
        }
      }

      return created;
    });

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
