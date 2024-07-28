import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Fetch the product with its images and subcategory
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        images: true,
        subcategory: true,
      },
    });

    // Fetch related products based on the same subcategory
    const relatedProducts = await prisma.product.findMany({
      where: {
        subcategoryId: product.subcategoryId,
        id: { not: id },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const { name, description, price, stock, subcategoryId, colors, sizes, images } = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        subcategoryId: subcategoryId ? parseInt(subcategoryId) : null,
        colors: colors ? JSON.parse(colors) : null,
        sizes: sizes ? JSON.parse(sizes) : null,
        updatedAt: new Date(),
      },
    });

    // Update images
    if (images && images.length > 0) {
      // Delete existing images
      await prisma.image.deleteMany({
        where: { productId: id },
      });

      // Add new images
      await prisma.image.createMany({
        data: images.map(url => ({
          url,
          productId: id,
        })),
      });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      {
        message: 'Failed to update product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Delete related images first
    await prisma.image.deleteMany({
      where: { productId: id },
    });

    // Now delete the product
    const deletedProduct = await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
