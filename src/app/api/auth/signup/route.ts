import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signupLimiter, rateLimitResponse } from "@/lib/rate-limit";

// POST /api/auth/signup
// Creates a new user account

export async function POST(request: Request) {
  const { success } = signupLimiter(request);
  if (!success) {
    return rateLimitResponse();
  }

  try {
    const body = await request.json();
    const { email, password, username } = body;

    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    // Validate username format (lowercase, alphanumeric, hyphens only)
    const usernameRegex = /^[a-z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    // Check username length
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Hash the password (bcrypt automatically adds salt)
    // Cost factor of 10 = good balance of security vs speed
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await db.user.create({
      data: {
        email,
        username: username.toLowerCase(),
        password: hashedPassword,
        displayName: username, // Default display name to username
      },
    });

    // Send ntfy notification
    if (process.env.NTFY_TOPIC) {
      fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
        method: "POST",
        headers: {
          "Title": "New Lnky signup",
          "Priority": "default",
          "Tags": "tada",
        },
        body: `${user.username} (${user.email})`,
      }).catch(() => {
        // Ignore notification errors
      });
    }

    // Return success (without password!)
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}