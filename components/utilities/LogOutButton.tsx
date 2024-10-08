"use client";
import { auth } from "@/lib/firebaseClient/config";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const LogOutButton = () => {
  const router = useRouter();
  async function handleLogOut() {
    const cookies = new Cookies();
    try {
      await signOut(auth);
      console.log("Başarıyla Çıkış yapıldı");
      toast({
        title: "Çıkış işlemi başarılı",
        description:
          "Tekrardan Görüşmek Üzere bir sorunla karşılaştıysan lütfen bize bildir.",
      });
      cookies.remove("user");
      router.push("/signin");
      window.location.reload();
    } catch (error) {
      console.error("Something went wrong while sign out processing", error);
    }
  }
  return (
    <div>
      <Button className="sm:block hidden" onClick={handleLogOut}>
        Çıkış Yap
      </Button>
    </div>
  );
};

export default LogOutButton;
