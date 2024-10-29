"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Textarea } from "@/components/ui/textarea";
import ProfilePictureForAcademy from "./ProfilePictureForAcademy";
import getStripe from "@/lib/Stripe/getStripe";

const signUpSchema = z.object({
  academyName: z.string().min(3, "Kullanıcı adı en az 3 karakterden oluşmalı"),
  academyAbout: z
    .string()
    .min(20, "Minimum 20 karakter girmelisiniz.")
    .max(200, "Maksimum 200 karakter girilebilir."),
  numberOfStudents: z.number().max(10000, "10000 Öğrenci maximum sınır"),
});

const CreateAcademyForm = () => {
  const [pending, setPending] = useState<boolean>(false);
  const [amountForDb, setAmountForDb] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  // 1. Define your form.
  //* Formu tanımlama ve useForm hooku ile typeSafe işlemi yapma
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      academyName: "",
      academyAbout: "",
      numberOfStudents: 0,
    },
  });

  //* Submit işlemi Api route yeri
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setPending(true);
    try {
      const amount = values.numberOfStudents * 5;
      const formData = new FormData();
      formData.append("amount", amount.toString());
      formData.append("academyName", values.academyName);
      formData.append("academyAbout", values.academyAbout);
      formData.append("numberOfStudents", values.numberOfStudents.toString());
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.sessionId) {
        const stripe = await getStripe();
        await stripe?.redirectToCheckout({ sessionId: result.sessionId });
      }
    } catch (error) {
      console.error("Payment Error from /createAcademy", error);
      setPending(false);
    }
  }

  return (
    <div className="min-w-[400px] min-h-[400px] h-full border rounded flex p-2 flex-col">
      <ProfilePictureForAcademy setImageFile={setImageFile} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-2">
          <FormField
            control={form.control}
            name="academyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Akademi Adı</FormLabel>
                <FormControl>
                  <Input placeholder="Örneğin: Bartın Akademi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="academyAbout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Akademini Tanıt</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfStudents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Öğrenci Sayısı Belirle</FormLabel>
                <FormControl>
                  <Input
                    className="w-1/4"
                    {...field}
                    onChange={(e) => {
                      const newValue = Number(e.target.value); // Input değerini sayıya çeviriyoruz
                      field.onChange(newValue); // Form alanını güncelliyoruz
                      setAmountForDb(newValue * 5); // Yeni değeri 5 ile çarpıp state'e atıyoruz
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className={cn("flex items-center gap-2")} type="submit">
            Akademini Oluştur <span>{amountForDb} ₺</span>
            <span
              className={cn("hidden", pending && "animate-spin inline-block")}
            >
              <LoaderCircle size={16} />
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateAcademyForm;
