import { NextResponse } from "next/server";
import prisma from '../../util/prisma';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "Password not matched!",
          success: false,
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      process.env.JWT_KEY,
      { expiresIn: '1d' }
    );

    console.log("User logged in:", user.id); // Log user ID in the terminal

    const response = NextResponse.json({
      message: "Login successfully",
      success: true,
      user, // Send the user data back to the client
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/"
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
