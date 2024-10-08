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
import { useToast } from "@/hooks/use-toast";
import { getJwtSecretKey } from "@/lib/actions/TokenProcess";
import { getUserData } from "@/lib/actions/UserData";
import { auth } from "@/lib/firebaseClient/config";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { SignJWT } from "jose";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "universal-cookie";
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

const signInSchema = z.object({
  email: z.string().email("Geçersiz Email"),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakterden oluşmalı")
    .regex(
      passwordRegex,
      "Şifre En az 1 Küçük harf, 1 Büyük harf ve minimum 6 karakter olmalı."
    ),
});
const SignInForm = () => {
  const [pending, setPending] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setPending(true);
    console.log(values.email);
    console.log(values.password);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log(userCredential.user.uid);
      const userData = await getUserData(userCredential.user.email!);
      setPending(false);
      const token = await new SignJWT({
        email: userData.email,
        username: userData.username,
        profilePicture: userData.profilePicture,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1 days")
        .sign(getJwtSecretKey());

      const cookies = new Cookies();
      cookies.set("user", token, { path: "/", sameSite: "lax", secure: true });
      toast({
        title: "Giriş İşlemi Başarılı",
        description: "Vaca'ya Tekrardan Hoşgeldin.",
      });
      router.push("/");
      window.location.reload();
    } catch (error: any) {
      console.error("Giriş ilemi sırasında hata oluştu", error.message);
      setPending(false);
      // Hata mesajına göre kontrol
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        setVerificationError("Email veya şifre hatalı.");
      } else {
        setVerificationError("Giriş işleminde bir hata oluştu");
      }
    }
  }
  return (
    <div className="w-full flex items-center justify-center ">
      <div className="min-w-[400px] min-h-[400px] h-full border rounded">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 p-8"
          >
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
                  <div className="flex justify-between">
                    <FormLabel>Password</FormLabel>
                    <FormLabel
                      asChild
                      className="cursor-pointer hover:underline"
                    >
                      <Link href="/resetpassword">Şifreni mi Unuttun ?</Link>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
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

            <Link href="/signup" className="group">
              Hesabın yok mu?{" "}
              <span className="group-hover:underline">Kayıt Ol</span>
            </Link>
          </form>
        </Form>
        <span className="text-red-400 text-sm">{verificationError}</span>
      </div>
    </div>
  );
};

export default SignInForm;
