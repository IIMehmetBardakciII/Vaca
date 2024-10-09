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
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

const signUpSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakterden oluşmalı"),
  email: z.string().email("Geçersiz Email"),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakterden oluşmalı")
    .regex(
      passwordRegex,
      "Şifre En az 1 Küçük harf, 1 Büyük harf ve minimum 6 karakter olmalı."
    ),
});

const SignUpForm = () => {
  const [pending, setPending] = useState<boolean>(false);
  const [existError, setExistError] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  // 1. Define your form.
  //* Formu tanımlama ve useForm hooku ile typeSafe işlemi yapma
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  //* Submit işlemi Api route yeri
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setPending(true);
    try {
      const emailLowerCase = values.email.toLowerCase();
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ ...values, email: emailLowerCase }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.error ===
          "The email address is already in use by another account."
        ) {
          setExistError(true);
          setTimeout(() => {
            setExistError(false);
          }, 3000);
        }
        throw new Error("failed to sign up from response");
      }

      //*   Aksi Halde response başarılı dönerse yapılacak işlemler routing işlemi useRouter kullanarak redirect yolu ile /sanal akademi bul kanalına yollayabiliriz.
      const result = await response.json();

      console.log("Signup Succesfully", result);
      toast({
        title: "Kayıt İşlemi Başarılı",
        description: "Vaca'yı kullanmaya başlayabilirsin.",
      });
      router.push("/");
      window.location.reload();
    } catch (error: any) {
      console.error("something went wrong while sign up processing", error);
      setPending(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-w-[400px] min-h-[400px] h-full border rounded">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className={cn("flex items-center gap-2")} type="submit">
            Submit{" "}
            <span
              className={cn("hidden", pending && "animate-spin inline-block")}
            >
              <LoaderCircle size={16} />
            </span>
          </Button>
          <Link href="/signin" className="group">
            Hesabın var mı?{" "}
            <span className="group-hover:underline">Giriş yap</span>
          </Link>
        </form>
      </Form>
      {existError && (
        <span className="text-red-400 text-sm">
          Bu mail hali hazırda kullanılmaktadır lütfen farklı bir mail ile kayıt
          olmayı deneyin.
        </span>
      )}
    </div>
  );
};

export default SignUpForm;
