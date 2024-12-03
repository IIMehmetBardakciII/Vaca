import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;
export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId || !apiKey || !apiSecret) {
      return NextResponse.json(
        { message: "Missing user ID or API keys." },
        { status: 400 }
      );
    }

    const serverClientForChat = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      process.env.STREAM_SECRET_KEY
    );
    const token = serverClientForChat.createToken(userId);
    return NextResponse.json(token);
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { message: "An error occurred while generating token." },
      { status: 500 }
    );
  }
}
