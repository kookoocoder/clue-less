import { NextRequest, NextResponse } from "next/server";

// Hardcoded authorized users
const AUTHORIZED_USERS = [
  {
    id: "user_gwen",
    username: "gwen",
    password: "110606",
  },
  {
    id: "user_spiderman",
    username: "spiderman",
    password: "300606",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Trim whitespace from credentials
    const trimmedUsername = username?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user with matching credentials
    const user = AUTHORIZED_USERS.find(
      (u) => u.username === trimmedUsername && u.password === trimmedPassword
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Return user info (without password)
    return NextResponse.json({
      userId: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

