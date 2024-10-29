"use client";
import Link from "next/link";

const CancelPayment = () => {
  return (
    <div>
      <h1>Ödeme İptal Edildi</h1>
      <p>Ödeme işleminiz iptal edildi. Lütfen tekrar deneyin.</p>
      <Link href="/">Ana Sayfaya Dön</Link>
    </div>
  );
};

export default CancelPayment;
