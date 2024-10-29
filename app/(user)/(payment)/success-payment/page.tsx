"use client";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SuccessPayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const academyName = searchParams.get("academyName");
  const academyAbout = searchParams.get("academyAbout");
  const numberOfStudents = searchParams.get("numberOfStudents");
  const imageFileUrl = searchParams.get("imageFileUrl"); // Image file URL parametre olarak al

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      console.log("Use effect");
      if (!academyName || !academyAbout || !numberOfStudents || !imageFileUrl) {
        console.error("Eksik parametreler");
        router.push("/"); // Yönlendir veya hata mesajı göster
        return;
      }
      const continuePostForCreate = async () => {
        // Varsayılan form davranışını engelle
        console.log("Success Payment Sayfasında Post işlemi Kontrolü");

        setLoading(true); // Yükleme durumunu ayarla

        try {
          const response = await fetch("/api/create-academy", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              academyName,
              academyAbout,
              numberOfStudents,
              imageFileUrl,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            router.push(`/virtual-academy/${result.virtualAcademyId}`);
          } else {
            const errorData = await response.json();
            setError(
              errorData.message || "Akademi oluşturulurken bir sorun oluştu."
            );
          }
        } catch (error) {
          console.error("Akademi oluşturulurken hata:", error);
          setError("Beklenmedik bir hata oluştu.");
        } finally {
          setLoading(false); // Yükleme durumunu sıfırla
        }
      };

      continuePostForCreate();
    }
  }, [academyAbout, academyName, imageFileUrl, numberOfStudents, router]);

  return (
    <div className="flex flex-col items-center gap-2 mt-5">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Ödeme İşlemi Başarılı Akademiniz Hazırlanıyor
      </h1>
      <p>Akademi Adı: {academyName}</p>
      <p>Akademi Hakkında: {academyAbout}</p>
      <p>Öğrenci Sayısı: {numberOfStudents}</p>
      <p>imageUrl: {imageFileUrl}</p>
      {loading && <LoaderCircle className="animate-spin" size={64} />}
      {/* Display error message */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SuccessPayment;
