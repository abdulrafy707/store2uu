import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const data = await request.formData();
    const { name, email, password, phoneno, city, role, base64 } = Object.fromEntries(data.entries());
    let imageUrl = '';

    if (base64) {
      const response = await fetch('https://appstore.store2u.ca/uploadImage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });
      const result = await response.json();
      if (response.ok) {
        imageUrl = result.image_url;
      } else {
        throw new Error(result.error || 'Failed to upload image');
      }
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newCustomer = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        phoneno: phoneno,
        city: city,
        role: role,
        imageUrl: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      {
        message: 'Failed to create customer',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const users = await prisma.user.findMany();
    console.log('Fetched users:', users);  // Add logging here
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch users',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
