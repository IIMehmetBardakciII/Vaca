"use client";

import { createTokenForChat } from "@/lib/actions/tokenCreateForChat";
import useUser from "@/lib/hooks/useUser";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useRef, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react"; // Eğer UI bileşenlerini kullanacaksanız

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamChatProvider = ({ children }: { children: ReactNode }) => {
  const { status, userData } = useUser();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const chatClientRef = useRef<StreamChat | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!status || !userData) return;
    if (!apiKey) throw new Error("Stream API key is missing");
    const initializeChatClient = async () => {
      if (!userData || !userData.uid) return;

      // Eğer mevcut bir istemci varsa, yeniden bağlanmayı önle
      if (chatClientRef.current) {
        setChatClient(chatClientRef.current);
        return;
      }

      try {
        const token = await createTokenForChat(userData.uid);
        const client = new StreamChat(apiKey);

        await client.connectUser(
          {
            id: userData.uid,
            name: userData.username || "Guest",
            image: userData.profilePicture || "",
          },
          token
        );

        chatClientRef.current = client;
        setChatClient(client);
      } catch (error) {
        console.error("Chat client initialization failed:", error);
      }
    };

    initializeChatClient();

    // Cleanup: Bağlantıyı kapat ve istemciyi sıfırla
    return () => {
      if (chatClientRef.current) {
        chatClientRef.current.disconnectUser();
        chatClientRef.current = null;
        setChatClient(null);
      }
    };
  }, [userData]);

  // Kullanıcı veya istemci verisi yüklenmediğinde spinner göster
  if (!status || !userData || !chatClient) {
    return <Loader className="animate-spin" />;
  }

  return (
    <Chat
      theme={cn(
        resolvedTheme === "dark"
          ? "str-chat__theme-dark"
          : "str-chat__theme-light"
      )}
      client={chatClient}
    >
      {children}
    </Chat>
  );
};

export default StreamChatProvider;
