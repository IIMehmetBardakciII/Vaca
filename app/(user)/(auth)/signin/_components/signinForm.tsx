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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signInSchema>) {
    console.log(values);
  }
  return (
    <div className="w-full flex items-center justify-center ">
      <div className="min-w-[400px] min-h-[600px] h-full border rounded">
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="block">
              Submit
            </Button>
            <Link href="/signup" className="group">
              Hesabın yok mu?{" "}
              <span className="group-hover:underline">Kayıt Ol</span>
            </Link>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignInForm;
