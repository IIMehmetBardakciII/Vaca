"use client";
import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { createChatChannelForVisualClass } from "@/lib/actions/createChatChannelForVisualClass";

const MeetingSetup = ({
  setIsSetupComplete,
  chatClient,
  userId,
  channelId, // Kanalın ID'si (ders ID'siyle eşleşebilir)
}: {
  setIsSetupComplete: (value: boolean) => void;
  chatClient: any;
  userId: string;
  channelId: string;
}) => {
  const [isMicCamToggledOn, setIsMicCampToggledOn] = useState(false);
  const call = useCall();

  if (!call) {
    throw new Error("useCall must be used withing StreamCall Component");
  }
  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  const handleJoinMeeting = async () => {
    try {
      // Kullanıcıyı çağrıya kat
      await call.join();

      // Kanalın mevcut olup olmadığını kontrol et
      const existingChannel = chatClient.channel("messaging", channelId);

      // Kanal varsa, kullanıcıyı ekle
      const channelState = await existingChannel.watch();

      if (channelState) {
        console.log("Kanal zaten mevcut, kullanıcı ekleniyor.");
        await existingChannel.addMembers([userId]); // Kullanıcıyı mevcut kanala ekle
      } else {
        // Kanal yoksa, yeni kanal oluştur
        console.log("Yeni kanal oluşturuluyor.");
        const createdChannelId = await createChatChannelForVisualClass(
          chatClient,
          channelId,
          userId
        );

        if (createdChannelId) {
          console.log("Kanal başarıyla oluşturuldu:", createdChannelId);
        } else {
          console.error("Kanal oluşturulamadı.");
        }
      }

      // Kurulum tamamlandı olarak işaretle
      setIsSetupComplete(true);
    } catch (error) {
      console.error("Toplantıya katılırken hata oluştu:", error);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-3 text-primary">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-1/6 items-center justify-center gap-3 text-secondary">
        <label className="flex items-center justify-center gap-2 font-medium text-primary">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCampToggledOn(e.target.checked)}
          />
          Kamera ve Mikrofuna Erişimi kapat
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={handleJoinMeeting}
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
