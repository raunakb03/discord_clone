import { currentProfile } from "@/lib/current-profile";
import axios from "axios";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Conversation Id missing", { status: 400 });
    }

    let messages: any = [];
    const { data } = await axios.post(`${process.env.BASE_URL}/api/message/directMessages`, {
      conversationId,
      cursor,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log("[GET_DIRECT_MESSAGES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
