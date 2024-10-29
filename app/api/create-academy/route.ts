import { initAdmin } from "@/lib/firebaseAdmin/config";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { getCookies } from "@/lib/actions/Cookies";
import { updateUserDocForVirtualAcademy } from "@/lib/actions/UpdateUserData";
export async function POST(req: NextRequest) {
  console.log("Create Academey Api Sayfasında Post işlemi Kontrolü");

  const data = await req.json();
  const academyName = data.academyName;
  const academyAbout = data.academyAbout;
  const numberOfStudents = data.numberOfStudents;
  const imageFileUrl = data.imageFileUrl;

  try {
    initAdmin();
    const adminDb = admin.firestore();
    const academyRef = adminDb.collection("virtualAcademies");
    const virtualAcademyData = {
      academyAbout,
      academyName,
      imageFileUrl: imageFileUrl || null,
      numberOfStudents,
      announcement: "",
      announcementDeadLine: null,
      createdAt: admin.firestore.Timestamp.now(),
    };
    const virtualAcademyDoc = await academyRef.add(virtualAcademyData);
    const virtualAcademyId = virtualAcademyDoc.id;
    const { verifiedToken } = await getCookies();
    if (verifiedToken) {
      const { success } = await updateUserDocForVirtualAcademy(
        verifiedToken.email as string,
        virtualAcademyId
      );
      if (success) {
        return NextResponse.json({ virtualAcademyId });
      } else {
        return NextResponse.json(
          {
            error:
              "Kullanıcı verisi Güncellenemedi bu hata api/create-academy yerinden geliyor.",
          },
          { status: 400 }
        );
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
