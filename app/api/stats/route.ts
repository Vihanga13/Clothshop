import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/stats - Aggregated metrics for Admin dashboard
export async function GET() {
  try {
    const [totalProducts, lowStockCount, orders] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 10 } } }),
      prisma.order.findMany({
        select: {
          total: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
    const processingCount = orders.filter((o) => o.status === 'processing').length;
    const shippedCount = orders.filter((o) => o.status === 'shipped').length;

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts,
        lowStockCount,
        confirmedCount,
        processingCount,
        shippedCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
