import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: "Nao autenticado" },
        { status: 401 }
      ),
      session: null,
    };
  }

  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return {
      error: NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}
