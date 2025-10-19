import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
  type GenerateAuthenticationOptionsOpts,
  type VerifyRegistrationResponseOpts,
  type VerifyAuthenticationResponseOpts,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from "@simplewebauthn/server";

const RP_NAME = "CipherTalk";
// For localhost development, RP_ID must be "localhost" (not "localhost:3000")
const RP_ID = "localhost";
const ORIGIN = "http://localhost:3000";

/**
 * Generate registration options for WebAuthn
 */
export async function generateRegistrationOpts(
  userId: string,
  userName: string
): Promise<ReturnType<typeof generateRegistrationOptions>> {
  const opts: GenerateRegistrationOptionsOpts = {
    rpName: RP_NAME,
    rpID: RP_ID,
    userName,
    userID: new TextEncoder().encode(userId),
    timeout: 60000,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  };

  return generateRegistrationOptions(opts);
}

/**
 * Verify registration response from client
 */
export async function verifyRegistration(
  response: RegistrationResponseJSON,
  expectedChallenge: string
): Promise<{ verified: boolean; credentialId?: string; publicKey?: Uint8Array }> {
  try {
    const opts: VerifyRegistrationResponseOpts = {
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    };

    const verification = await verifyRegistrationResponse(opts);

    if (verification.verified && verification.registrationInfo) {
      return {
        verified: true,
        credentialId: Buffer.from(verification.registrationInfo.credential.id).toString("base64"),
        publicKey: verification.registrationInfo.credential.publicKey,
      };
    }

    return { verified: false };
  } catch (error) {
    console.error("Registration verification error:", error);
    return { verified: false };
  }
}

/**
 * Generate authentication options for WebAuthn
 */
export async function generateAuthenticationOpts(
  allowedCredentials?: Array<{ id: string }>
): Promise<ReturnType<typeof generateAuthenticationOptions>> {
  const opts: GenerateAuthenticationOptionsOpts = {
    rpID: RP_ID,
    timeout: 60000,
    userVerification: "preferred",
    allowCredentials: allowedCredentials?.map((cred) => ({
      id: Buffer.from(cred.id, "base64"),
      type: "public-key",
    })),
  };

  return generateAuthenticationOptions(opts);
}

/**
 * Verify authentication response from client
 */
export async function verifyAuthentication(
  response: AuthenticationResponseJSON,
  expectedChallenge: string,
  credentialPublicKey: Uint8Array,
  credentialId: string
): Promise<{ verified: boolean }> {
  try {
    const opts: VerifyAuthenticationResponseOpts = {
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: Buffer.from(credentialId, "base64"),
        credentialPublicKey,
        counter: 0,
      },
    };

    const verification = await verifyAuthenticationResponse(opts);
    return { verified: verification.verified };
  } catch (error) {
    console.error("Authentication verification error:", error);
    return { verified: false };
  }
}

