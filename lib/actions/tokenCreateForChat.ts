"use server";

import { StreamChat } from "stream-chat";

const serverClientForChat = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET_KEY
);
export async function createTokenForChat(userId: string): Promise<string> {
  return serverClientForChat.createToken(userId) as string;
}
