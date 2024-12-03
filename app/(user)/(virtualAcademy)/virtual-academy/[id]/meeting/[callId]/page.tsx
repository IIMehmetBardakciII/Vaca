"use client";

import MeetingRoom from "@/components/organism/MeetingRoom";
import MeetingSetup from "@/components/organism/MeetingSetup";
import { createChatChannelForVisualClass } from "@/lib/actions/createChatChannelForVisualClass";
import { useGetCallById } from "@/lib/hooks/useGetCallById";
import useUser from "@/lib/hooks/useUser";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { Loader, MessageCircleMore } from "lucide-react";
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
import { cn } from "@/lib/utils";
init({ data });

const Meeting = ({ params }: { params: { id: string; callId: string } }) => {
  const { status, userData } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(params.callId);
  const { client: chatClient } = useChatContext();
  const [channelId, setChannelId] = useState<any>();
  const [openChat, SetopenChat] = useState<boolean>(false);

  useEffect(() => {
    if (!chatClient || !userData?.uid || !params.callId) return;

    async function createChannel() {
      //TODO:Create chat for visual Class
      const channelIdForVisualClass = await createChatChannelForVisualClass(
        chatClient,
        params.callId,
        userData?.uid as string
      );
      if (channelIdForVisualClass) {
        setChannelId(channelIdForVisualClass);
      }
    }

    createChannel();
  }, [chatClient, userData?.uid, params.callId]);
  if (!userData || !userData.uid) {
    return <Loader className="animate-spin" />;
  }
  if (!status || isCallLoading || !channelId)
    return <Loader className="animate-spin" />;

  return (
    <main className="h-[calc(100%-60px)] w-full flex overflow-hidden">
      <div className="flex-grow">
        <StreamCall call={call}>
          <StreamTheme>
            {!isSetupComplete ? (
              <MeetingSetup
                channelId={params.callId}
                chatClient={chatClient}
                userId={userData?.uid}
                setIsSetupComplete={setIsSetupComplete}
              />
            ) : (
              <MeetingRoom callId={params.callId} academyId={params.id} />
            )}
          </StreamTheme>
        </StreamCall>
      </div>
      <div className="w-fit">
        <MessageCircleMore
          className={cn(
            "cursor-pointer  size-8 absolute z-10 bottom-5 right-5",
            openChat
              ? " stroke-green-400 hover:stroke-primary"
              : " stroke-primary hover:stroke-green-400"
          )}
          onClick={() => SetopenChat((currentState) => !currentState)}
        />
        <div
          className={cn(
            "w-[300px] h-[calc(100%-100px)] hidden",
            openChat && "visible"
          )}
        >
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
      </div>
    </main>
  );
};

export default Meeting;
