import { NextRequest, NextResponse } from "next/server";

import { uploadImageToFirebase } from "@/lib/actions/uploadImage";
import { initStripeInstance } from "@/lib/Stripe/initStripeInstance";

export async function POST(req: NextRequest) {
  const stripe = initStripeInstance();
  console.log("Create Checkout Api Sayfasında Post işlemi Kontrolü");

  const formData = await req.formData();
  const academyName = formData.get("academyName") as string;
  const academyAbout = formData.get("academyAbout") as string;
  const amount = Number(formData.get("amount"));
  const numberOfStudents = Number(formData.get("numberOfStudents"));
  const imageFile = formData.get("imageFile") as File;
  const imageUrlFromBucket = await uploadImageToFirebase(imageFile);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "try",
            product_data: {
              name: "Akademi Depolama Ücreti",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        process.env.NEXT_PUBLIC_DOMAIN
      }/success-payment?academyName=${encodeURIComponent(
        academyName
      )}&academyAbout=${encodeURIComponent(
        academyAbout
      )}&numberOfStudents=${numberOfStudents}&imageFileUrl=${encodeURIComponent(
        imageUrlFromBucket
      )}&studentCount=${numberOfStudents}`, // Öğrenci sayısını ekledik
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel-payment`, // İptal durumunda yönlendirme.
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    // Eğer bir hata olursa, hata mesajını döndürüyoruz.
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
