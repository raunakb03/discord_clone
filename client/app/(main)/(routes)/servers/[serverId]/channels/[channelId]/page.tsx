import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  // get the channel and the member
  let channel, member;
  try {
    const { data } = await axios.get(
      `${process.env.BASE_URL}/api/channel/getChannel/${params.channelId}`
    );
    channel = data;
  } catch (error) {
    console.log(error);
  }

  try {
    const { data } = await axios.get(
      `${process.env.BASE_URL}/api/member/getMemberProfile/${profile._id}/${params.serverId}`
    );
    member = data;
  } catch (error) {
    console.log(error);
  }

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type == "TEXT" && (
        <>
          {" "}
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel._id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{ serverId: channel.serverId, channelId: channel._id }}
            paramKey="channelId"
            paramValue={channel._id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{ serverId: channel.serverId, channelId: channel._id }}
          />
        </>
      )}
      {channel.type == "AUDIO" && (
        <MediaRoom chatId={channel._id} video={false} audio={true} />
      )}
      {channel.type == "VIDEO" && (
        <MediaRoom chatId={channel._id} video={true} audio={false} />
      )}
    </div>
  );
};

export default ChannelIdPage;
