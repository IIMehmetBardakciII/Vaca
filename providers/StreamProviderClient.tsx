"use client";

import useUser from "@/lib/hooks/useUser";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { status, userData } = useUser();

  useEffect(() => {
    if (!status || !userData) return;
    if (!apiKey) throw new Error("Stream API key is missing");
    const initializeClient = async () => {
      try {
        const response = await fetch("/api/generate-stream-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData.uid as string }), // Kullanıcı kimliğini buraya ekleyin
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const { token } = await response.json();
        const client = new StreamVideoClient({
          apiKey,
          user: {
            id: userData.uid, // Kullanıcı ID’sini buraya ekleyin
            name: userData.username,
            image: userData.profilePicture,
          },
          token,
        });

        setVideoClient(client);
      } catch (error) {
        console.error("Failed to initialize client:", error);
      }
    };

    initializeClient();
  }, [userData, status]);

  if (!videoClient) return <Loader className="animate-spin" />;
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
