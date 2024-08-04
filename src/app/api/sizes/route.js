import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';


export async function GET() {
  try {
    const sizes = await prisma.size.findMany();
    return NextResponse.json(sizes);
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return NextResponse.json(
      { message: 'Failed to fetch sizes', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    const newSize = await prisma.size.create({
      data: { name },
    });
    return NextResponse.json(newSize, { status: 201 });
  } catch (error) {
    console.error('Error creating size:', error);
    return NextResponse.json(
      { message: 'Failed to create size', error: error.message },
      { status: 500 }
    );
  }
}
