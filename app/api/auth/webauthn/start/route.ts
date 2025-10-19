import { NextRequest } from "next/server";
import {
  generateRegistrationOpts,
  generateAuthenticationOpts,
} from "@/lib/auth/webauthn-server";

// In-memory challenge store (use Redis in production)
const challenges = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, handle } = body;

    console.log("[WebAuthn] Start request:", { type, handle });

    if (type === "registration") {
      if (!handle) {
        return Response.json({ error: "Handle required" }, { status: 400 });
      }

      const userId = `user_${Date.now()}`;
      const options = await generateRegistrationOpts(userId, handle);

      // Store challenge temporarily
      challenges.set(handle, options.challenge);

      console.log("[WebAuthn] Registration options generated:", {
        rpId: options.rp?.id,
        userName: options.user?.name,
        challengeLength: options.challenge?.length,
      });

      return Response.json(options);
    }

    if (type === "authentication") {
      const options = await generateAuthenticationOpts();

      // Store challenge temporarily
      const authKey = "auth_" + Date.now();
      challenges.set(authKey, options.challenge);

      console.log("[WebAuthn] Authentication options generated");

      return Response.json(options);
    }

    return Response.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("[WebAuthn] Start error:", error);
    return Response.json(
      { error: "Internal error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}


