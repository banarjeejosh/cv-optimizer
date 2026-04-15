import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, getExpectedAuthToken } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | CV Optimizer",
  description: "Password gate for the CV Optimizer app",
};

export default async function LoginPage() {
  const expectedToken = await getExpectedAuthToken();
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (expectedToken && currentToken === expectedToken) {
    redirect("/");
  }

  return <LoginForm />;
}
