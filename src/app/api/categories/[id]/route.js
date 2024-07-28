import { NextResponse } from 'next/server';

import prisma from '../../../util/prisma';
// Get category by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found', status: false },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: 'Failed to fetch category', status: false, error: error.message },
      { status: 500 }
    );
  }
}

// Update an existing category
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, imageUrl } = await request.json();
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        message: 'Failed to update category',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Delete a category
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete category',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
