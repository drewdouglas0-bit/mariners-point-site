import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "admin_session";
const SHIFT_SECONDS = 60 * 60 * 8;

type SessionPayload = { exp: number };

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD env var");
  }
  return password;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function toBase64Url(input: string) {
  return bytesToBase64Url(new TextEncoder().encode(input));
}

function fromBase64Url(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAdminPassword()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken() {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SHIFT_SECONDS,
  };

  const payloadPart = toBase64Url(JSON.stringify(payload));
  const sigPart = await sign(payloadPart);
  return `${payloadPart}.${sigPart}`;
}

export async function verifyAdminSessionToken(token?: string | null) {
  if (!token) return false;

  const [payloadPart, sigPart] = token.split(".");
  if (!payloadPart || !sigPart) return false;

  const expectedSig = await sign(payloadPart);
  if (expectedSig !== sigPart) return false;

  try {
    const payload = JSON.parse(fromBase64Url(payloadPart)) as SessionPayload;
    if (!payload.exp || typeof payload.exp !== "number") return false;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SHIFT_SECONDS,
  };
}

export async function requireAdminSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const raw = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`));

  const token = raw ? decodeURIComponent(raw.split("=")[1] ?? "") : null;
  return verifyAdminSessionToken(token);
}

export async function isAdminSessionInServerContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
