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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
  }
  return (
    <div className="min-w-[400px] min-h-[600px] h-full border rounded">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
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
                  <Input placeholder="email" {...field} />
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
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className={cn("block", {
              "opacity-40 pointer-events-none":
                form.getValues().username === "",
            })}
            type="submit"
          >
            Submit
          </Button>
          <Link href="/signin" className="group">
            Hesabın var mı?{" "}
            <span className="group-hover:underline">Giriş yap</span>
          </Link>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
