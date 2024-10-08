import { getJwtSecretKey } from "@/lib/actions/TokenProcess";
import { initAdmin } from "@/lib/firebaseAdmin/config";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // admin Sdk başlatılıcak
  initAdmin();
  // Firebase admin require yolu ile klasik nodejs yapısı olarka çağırılacka
  const admin = require("firebase-admin");
  // Admin AUth başlatılıcak
  const adminAuth = admin.auth();
  // firestore users collectionu için çağrılacak
  const adminDb = admin.firestore();
  //* -----------------
  // collectionRef değişkeni collectiona referans vericek
  const collectionRef = adminDb.collection("users");
  // Requestten gelen veriler çekilecek ve işlenicek
  try {
    const { username, email, password } = await req.json();
    if (
      typeof username === "string" &&
      typeof email === "string" &&
      typeof password === "string"
    ) {
      //* Usercredential oluşturma aşaması
      try {
        const userCredential = await adminAuth.createUser({
          email,
          password,
          displayName: username,
        });
        const user = userCredential;
        //? User firebaseAuthtta oluştuysa işleme devam et
        if (user) {
          //* firestoreda tutucağımız verileri oluşturma yeri döküman yapısı
          const userData = {
            uid: user.uid,
            email,
            username,
            profilePicture: "",
            signUpDate: new Date(),
            virtualAcademies: [],
          };
          // * Dökümanı oluşturma
          await collectionRef.doc(user.uid).set(userData);
          //* users adında token oluşturma.(Jose kullanılacak)
          const token = await new SignJWT({
            email: userData.email,
            uid: userData.uid,
            profilePicture: userData.profilePicture,
            username: userData.username,
          })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1 days")
            .sign(getJwtSecretKey());

          //* Dönecek Responseu oluşturma
          const response = NextResponse.json({
            success: true,
          });
          //* Dönecek response cookies e oluşturduğumuz tokenı set etmek.
          response.cookies.set({
            name: "user",
            value: token,
            path: "/",
          });
          //* Response'u gönderme(Döndürme)
          return response;
        }
      } catch (error: any) {
        console.error("UserCredential Error from adminAuth createUser", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    } else {
      console.error("Invalid Userdata Type");
      return NextResponse.json(
        { error: "Geçersiz e-posta, şifre veya kullanıcı adı" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Form data is not found from request");
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
