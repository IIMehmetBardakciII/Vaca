"use client";

import { useEffect, useState } from "react";
import {
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChatContext,
} from "stream-chat-react";

import { EmojiPicker } from "stream-chat-react/emojis";
import { init, SearchIndex } from "emoji-mart";
import data from "@emoji-mart/data";
import { MessageCircleMore, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
init({ data });

interface GlobalChatProps {
  virtualAcademyData: {
    id: string;
    academyName: string | undefined;
    members: any[]; // Adjust the type of members if necessary
    imageFileUrl: string | undefined;
  };
}

const GlobalChat = ({ virtualAcademyData }: GlobalChatProps) => {
  const [channelId, setChannelId] = useState<any>(null);
  const { client: chatClient } = useChatContext();
  const [openChat, setOpenChat] = useState<boolean>(false);

  // Chat dışında bir yere tıklanıldığında chat'i kapat
  // const chatRef = useRef<HTMLDivElement>(null); // Chat penceresi referansı
  // useClickOutside(chatRef, () => setOpenChat(false));

  useEffect(() => {
    const initializationChannel = async () => {
      if (!chatClient || !virtualAcademyData.id) return;

      // Kullanıcıları admin yapma
      const membersWithValidIds = virtualAcademyData.members.map((member) => {
        const validUserId = member.userId.replace(/\./g, "_");
        return validUserId;
      });

      // Kanal oluşturma işlemi
      const channel = chatClient.channel("messaging", virtualAcademyData.id, {
        image: virtualAcademyData.imageFileUrl,
        name: virtualAcademyData.academyName || "Akademi Global Chat",
        members: membersWithValidIds, // Kanal üyeleri
      });

      // Kanalın oluşturulmasını bekle
      await channel.create();
      setChannelId(channel.id);
    };

    initializationChannel();
  }, [chatClient, virtualAcademyData]);

  if (!channelId) return <div>Loading...</div>; // Kanal yüklenene kadar gösterilecek

  return (
    <>
      <div className="fixed right-4 bottom-4 ">
        <Button
          asChild
          className="bg-green-500 cursor-pointer"
          onClick={() => setOpenChat((currenState) => !currenState)}
        >
          <div>
            <MessageCircleMore size={16} />
            <span>Chat</span>
          </div>
        </Button>
      </div>

      <div
        // ref={chatRef}
        className={cn(
          openChat ? "block" : "hidden",
          "border rounded-md   fixed right-4 z-40 top-[90px] h-[630px]"
        )}
      >
        <div
          className="w-8 h-8 cursor-pointer absolute z-50 right-5 top-2  flex items-center justify-center "
          onClick={() => setOpenChat((currentState) => !currentState)}
        >
          <Minus className="cursor-pointer" />
        </div>
        <Channel
          EmojiPicker={EmojiPicker}
          emojiSearchIndex={SearchIndex}
          channel={chatClient.channel("messaging", channelId)}
        >
          <Window>
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </div>
    </>
  );
};

export default GlobalChat;
