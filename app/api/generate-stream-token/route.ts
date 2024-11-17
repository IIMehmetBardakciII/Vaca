import { StreamClient } from "@stream-io/node-sdk";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;
export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId || !apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "Missing user ID or API keys." },
      { status: 400 }
    );
  }

  const streamClient = new StreamClient(apiKey, apiSecret);
  const token = streamClient.generateUserToken({ user_id: userId });
  return NextResponse.json({ token });
}
