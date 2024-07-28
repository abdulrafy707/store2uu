import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';



export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const data = await request.json();
    const { name, categoryId, imageUrl } = data;

    const updatedSubcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name,
        categoryId: parseInt(categoryId, 10),
        imageUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Subcategory updated successfully',
      data: updatedSubcategory,
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json(
      {
        message: 'Failed to update subcategory',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id, 10);

    const deletedSubcategory = await prisma.subcategory.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 200,
      message: 'Subcategory deleted successfully',
      data: deletedSubcategory,
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete subcategory',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
