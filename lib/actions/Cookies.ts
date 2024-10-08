"use server";
import { cookies } from "next/headers";
import { verifyJwtToken } from "./TokenProcess";

export async function getCookies() {
  const cookiesUse = cookies();
  const { value: token } = cookiesUse.get("user") ?? { value: null };
  if (token) {
    try {
      const verifiedToken = await verifyJwtToken(token);
      return { verifiedToken, success: true };
    } catch (error) {
      console.error("Token doğrulama hatası", error);
      return { verifiedToken: null, success: false };
    }
  } else {
    console.warn("Token bulunamadı veya geçersiz");
    return { verifiedToken: null, success: false };
  }
}
