import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';
// import prisma from '@/app/util/prisma';
// import prisma from '@/util/prisma';

export async function POST(request) {
  console.log('POST request received for coupon validation');
  try {
    const { code } = await request.json();
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code' }, { status: 200 });
    }

    if (new Date(coupon.expiration) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Coupon has expired' }, { status: 200 });
    }

    return NextResponse.json({ valid: true, discount: coupon.discount }, { status: 200 });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, message: 'Failed to validate coupon', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'GET method not allowed' },
    { status: 405 }
  );
}
