// /api/orders.js
import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const authToken = request.cookies.get("authToken")?.value;
    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized', status: false }, { status: 401 });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_KEY);
    const { billingAddress, shippingAddress, paymentMethod, paymentInfo, items, total } = await request.json();

    console.log("Decoded user:", decoded);
    console.log("Incoming order data:", { billingAddress, shippingAddress, paymentMethod, paymentInfo, items, total });

    // Ensure the necessary data is available
    if (!decoded.id || !items || items.length === 0 || !total) {
      return NextResponse.json({ message: 'Invalid order data', status: false }, { status: 400 });
    }

    // Create the order and order items
    const newOrder = await prisma.order.create({
      data: {
        userId: decoded.id,
        total,  // Make sure to include the total here
        status: 'PENDING',
        billingAddress: JSON.stringify(billingAddress),
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod,
        paymentInfo: paymentMethod === 'Credit Card' ? JSON.stringify(paymentInfo) : null,
        orderItems: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity || 1,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log('Order created:', newOrder);
    return NextResponse.json({ message: 'Order placed successfully', data: newOrder, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ message: 'Failed to place order', error: error.message, status: false }, { status: 500 });
  }
}





export async function GET(req) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, userId, total, status, orderItems } = req.body;

    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(id),
      },
      data: {
        userId: parseInt(userId),
        total: parseFloat(total),
        status,
        updatedAt: new Date(),
        orderItems: {
          deleteMany: {}, // Remove all current order items
          create: orderItems.map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          })),
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = req.query;
    const deletedOrder = await prisma.order.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(deletedOrder);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
