"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAllJoinRequest } from "@/lib/actions/joinRequestForVirtualAcademy";
import { approvedJoinRequest, rejectedJoinRequest } from "@/lib/actions/Member";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type JoinRequest = {
  requestId: string;
  userId: string;
  status: string;
  requestDate: string; // Yalnızca string
};

const RequestForJoin = ({ params }: { params: { id: string } }) => {
  const [requestInfo, setRequestInfo] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const academyId = params.id;
  const handleAccept = async (userId: string) => {
    const response = await approvedJoinRequest(userId, academyId);
    if (response) {
      toast({
        title: "Üye Eklendi",
      });
      window.location.reload();
    } else {
      toast({
        title: "Üye eklenirken hata oluştu.",
      });
    }
  };
  const handleReject = async (userId: string) => {
    const response = await rejectedJoinRequest(userId, academyId);
    if (response) {
      toast({
        title: "Üye İsteği İptal edildi",
      });
      window.location.reload();
    } else {
      toast({
        title: "Üye İsteği silinirken hata oluştu.",
      });
    }
  };

  useEffect(() => {
    const handleRequest = async () => {
      try {
        const joinRequests = await getAllJoinRequest(params.id);
        if (joinRequests) {
          setRequestInfo(
            joinRequests.map((request) => ({
              ...request,
              requestDate:
                request.requestDate instanceof Date
                  ? request.requestDate.toISOString()
                  : request.requestDate,
            }))
          );
        } else {
          setRequestInfo([]); // Null ise boş dizi
        }
      } catch (err) {
        console.error("Error fetching join requests:", err);
        setError("Veri alınırken bir hata oluştu.");
      } finally {
        setLoading(false); // İstek tamamlandığında yüklemeyi durdur
      }
    };

    handleRequest();
  }, [params.id]); // params.id'yi bağımlılıklar arasına ekliyoruz

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    ); // Yükleniyor durumu
  }

  if (error) {
    return <div>{error}</div>; // Hata durumu
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Katılma İstekleri
      </h1>
      {requestInfo.length > 0 ? (
        requestInfo.map((request) => (
          <div
            key={request.requestId}
            className="flex px-6 py-4 rounded-md items-center gap-4 border text-primary "
          >
            <small className="text-sm font-medium leading-none justify-start ">
              Kullanıcı Mail: {request.userId}
            </small>

            <small className="text-sm font-medium leading-none justify-start ">
              Kullanıcı Durumu: {request.status}
            </small>
            <small className="text-sm font-medium leading-none justify-start ">
              İsteğin Gönderilme Tarihi:{" "}
              {new Date(request.requestDate).toLocaleString()}
            </small>
            <Button
              className="bg-lime-600 hover:bg-lime-400"
              onClick={() => handleAccept(request.userId)}
            >
              Kabul Et
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-400"
              onClick={() => handleReject(request.userId)}
            >
              Reddet
            </Button>
          </div>
        ))
      ) : (
        <p>Henüz bir katılma isteği yok.</p>
      )}
    </div>
  );
};

export default RequestForJoin;
