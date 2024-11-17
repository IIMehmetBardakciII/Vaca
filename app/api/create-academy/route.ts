import { initAdmin } from "@/lib/firebaseAdmin/config";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { getCookies } from "@/lib/actions/Cookies";
import { updateUserDocForVirtualAcademy } from "@/lib/actions/UpdateUserData";

export async function POST(req: NextRequest) {
  console.log("Create Academy API - POST request initiated");

  try {
    // Giriş yapmış kullanıcının doğrulanması
    initAdmin();
    const { verifiedToken } = await getCookies();
    if (!verifiedToken || !verifiedToken.email) {
      return NextResponse.json(
        { error: "Authentication failed. User is not verified." },
        { status: 401 }
      );
    }

    // Gelen veri kontrolü
    const data = await req.json();
    const { academyName, academyAbout, numberOfStudents, imageFileUrl } = data;

    if (!academyName || !academyAbout || !numberOfStudents) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: academyName, academyAbout, numberOfStudents.",
        },
        { status: 400 }
      );
    }

    const adminDb = admin.firestore();
    const academyRef = adminDb.collection("virtualAcademies");

    // Yeni akademi belgesi oluşturulması
    const virtualAcademyData = {
      academyAbout,
      academyName,
      imageFileUrl: imageFileUrl || null,
      numberOfStudents,
      announcement: "",
      announcementDeadLine: null,
      createdAt: admin.firestore.Timestamp.now(),
      members: [
        {
          userId: verifiedToken.email as string,
          role: "Rektor",
        },
      ],
      joinRequests: [],
      virtualClass: [],
    };

    const virtualAcademyDoc = await academyRef.add(virtualAcademyData);
    const virtualAcademyId = virtualAcademyDoc.id;

    // Kullanıcı belgesinde akademi ID'si güncellenmesi
    const { success } = await updateUserDocForVirtualAcademy(
      verifiedToken.email as string,
      virtualAcademyId
    );

    if (success) {
      return NextResponse.json({ virtualAcademyId });
    } else {
      console.error("Failed to update user data in users collection.");
      return NextResponse.json(
        {
          error: "User data update failed in /api/create-academy.",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in create academy:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
