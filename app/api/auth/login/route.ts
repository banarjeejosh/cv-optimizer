import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createAuthToken } from "@/lib/auth";

interface LoginBody {
  password?: unknown;
}

export async function POST(request: Request) {
  const configuredPassword = process.env.APP_LOGIN_PASSWORD;

  if (!configuredPassword) {
    return NextResponse.json(
      { error: "Login password is not configured." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as LoginBody | null;

  if (typeof body?.password !== "string") {
    return NextResponse.json(
      { error: "Password is required." },
      { status: 400 },
    );
  }

  if (body.password !== configuredPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const sessionToken = await createAuthToken(configuredPassword);
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
