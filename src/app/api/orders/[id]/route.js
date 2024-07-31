import { NextResponse } from 'next/server';
import prisma from '@/app/util/prisma';
// import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  take: 1 // Take only the first image
                }
              }
            }
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}





export async function PUT(req) {
  const { id, status } = await req.json();

  // Validate the status against the enum values
  const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
  if (!id || !status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
