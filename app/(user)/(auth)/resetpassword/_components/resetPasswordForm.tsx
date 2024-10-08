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
import { isUserExist } from "@/lib/actions/IsUserExist";
import { auth } from "@/lib/firebaseClient/config";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Geçersiz Email"),
});
const ResetPasswordForm = () => {
  const [pending, setPending] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setPending(true);
    // Kullanıcı var mı kontrolü from actions/IsUserExist.ts file
    const { success } = await isUserExist(values.email);
    if (success) {
      try {
        await sendPasswordResetEmail(auth, values.email);
        toast({
          title: "Şifre yenileme işlemi için bağlantı gönderildi",
          description:
            "Şifreni başarıyla yenilemek için mailini kontrol et, bağlantı üzerinden bu işlemi gerçekleştirebilirsin.",
        });
      } catch (error: any) {
        console.error("Şifre yenileme sırasında hata oluştu", error);

        toast({
          title: "Hata",
          description: `Bir hata oluştu. Lütfen tekrar deneyin. Hata -> ${error}`,
        });
        setPending(false);
      } finally {
        setPending(false);
      }
    } else {
      toast({
        title: "Hata",
        description: "Böyle bir kullanıcı mevcut değil lütfen tekrar deneyin.",
      });
      setPending(false);
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

            <Button className={cn("flex items-center gap-2")} type="submit">
              Bağlantı Gönder
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
      </div>
    </div>
  );
};

export default ResetPasswordForm;
