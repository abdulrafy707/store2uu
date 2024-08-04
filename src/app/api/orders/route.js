// server/api/orders.js
import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
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
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}






// const prisma = new PrismaClient();


const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request) {
  try {
    console.log('Received request for placing order');

    const authToken = request.headers.get('Authorization')?.split(' ')[1];
    console.log('Auth token:', authToken);

    if (!authToken) {
      console.log('No auth token provided');
      return NextResponse.json({ message: 'Unauthorized', status: false }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(authToken, SECRET_KEY);
      console.log('Decoded token:', decoded);
    } catch (error) {
      console.log('Token verification failed:', error);
      return NextResponse.json({ message: 'Unauthorized', status: false }, { status: 401 });
    }

    const { shippingAddress, paymentMethod, paymentInfo, items, total, discount = 0, tax, netTotal, couponCode = null } = await request.json();
    
    if (!decoded.id || !items || items.length === 0 || !total) {
      console.log('Invalid order data');
      return NextResponse.json({ message: 'Invalid order data', status: false }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: decoded.id,
        total,
        discount,
        tax,
        netTotal,
        status: 'PENDING',
        recipientName: shippingAddress.recipientName,
        streetAddress: shippingAddress.streetAddress,
        apartmentSuite: shippingAddress.apartmentSuite,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
        phoneNumber: shippingAddress.phoneNumber,
        email: shippingAddress.email,
        paymentMethod,
        paymentInfo: paymentMethod === 'Credit Card' ? JSON.stringify(paymentInfo) : null,
        couponCode,
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

    console.log('Order placed successfully:', newOrder);
    return NextResponse.json({ message: 'Order placed successfully', data: newOrder, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ message: 'Failed to place order', error: error.message, status: false }, { status: 500 });
  }
}






export async function PUT(request) {
  try {
    const { id, total, status, orderItems, shippingAddress, paymentMethod, paymentInfo } = await request.json();

    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status,
        // recipientName: shippingAddress.recipientName,
        // streetAddress: shippingAddress.streetAddress,
        // apartmentSuite: shippingAddress.apartmentSuite,
        // city: shippingAddress.city,
        // state: shippingAddress.state,
        // zip: shippingAddress.zip,
        // country: shippingAddress.country,
        // phoneNumber: shippingAddress.phoneNumber,
        // email: shippingAddress.email,
        paymentMethod,
        paymentInfo: paymentMethod === 'Credit Card' ? JSON.stringify(paymentInfo) : null,
        updatedAt: new Date(),
        // orderItems: {
        //   deleteMany: {}, // Remove all current order items
        //   create: orderItems.map(item => ({
        //     productId: parseInt(item.productId),
        //     quantity: parseInt(item.quantity),
        //     price: parseFloat(item.price),
        //   })),
        // },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
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