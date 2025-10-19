import {
  startRegistration,
  startAuthentication,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";

export interface RegistrationResult {
  success: boolean;
  deviceId?: string;
  userId?: string;
  error?: string;
}

export interface AuthenticationResult {
  success: boolean;
  deviceId?: string;
  userId?: string;
  error?: string;
}

/**
 * Register a new passkey for the user
 */
export async function registerPasskey(handle: string): Promise<RegistrationResult> {
  try {
    // Request registration options from server
    const optionsResponse = await fetch("/api/auth/webauthn/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, type: "registration" }),
    });

    if (!optionsResponse.ok) {
      throw new Error("Failed to start registration");
    }

    const options: PublicKeyCredentialCreationOptionsJSON = await optionsResponse.json();

    // Start WebAuthn registration
    const credential = await startRegistration(options);

    // Send credential to server
    const verifyResponse = await fetch("/api/auth/webauthn/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle,
        credential,
        type: "registration",
      }),
    });

    if (!verifyResponse.ok) {
      throw new Error("Registration verification failed");
    }

    const result = await verifyResponse.json();
    return {
      success: result.ok,
      deviceId: result.deviceId,
      userId: result.userId,
    };
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific WebAuthn errors
    let errorMessage = "Registration failed";
    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        errorMessage = "Operation cancelled or not allowed. Please try again and allow the passkey creation.";
      } else if (error.name === "InvalidStateError") {
        errorMessage = "A passkey already exists for this device.";
      } else if (error.name === "AbortError") {
        errorMessage = "Operation timed out. Please try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Authenticate with existing passkey
 */
export async function authenticatePasskey(): Promise<AuthenticationResult> {
  try {
    // Request authentication options from server
    const optionsResponse = await fetch("/api/auth/webauthn/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "authentication" }),
    });

    if (!optionsResponse.ok) {
      throw new Error("Failed to start authentication");
    }

    const options: PublicKeyCredentialRequestOptionsJSON = await optionsResponse.json();

    // Start WebAuthn authentication
    const credential = await startAuthentication(options);

    // Send credential to server
    const verifyResponse = await fetch("/api/auth/webauthn/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credential,
        type: "authentication",
      }),
    });

    if (!verifyResponse.ok) {
      throw new Error("Authentication verification failed");
    }

    const result = await verifyResponse.json();
    return {
      success: result.ok,
      deviceId: result.deviceId,
      userId: result.userId,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}

/**
 * Check if WebAuthn is supported in this browser
 */
export function isWebAuthnSupported(): boolean {
  return (
    window?.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === "function"
  );
}

