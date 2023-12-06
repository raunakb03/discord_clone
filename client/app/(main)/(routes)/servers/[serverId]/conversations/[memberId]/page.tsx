import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  let currentMember;
  try {
    const { data } = await axios.get(
      `${process.env.BASE_URL}/api/member/getMemberProfile/${profile._id}/${params.serverId}`
    );
    currentMember = data;
  } catch (error) {
    console.log(error);
  }
  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember._id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  let {
    memberTwoId,
    memberTwoProfile,
    memberOneId,
    memberOneProfile,
    ...conversationObj
  } = conversation;

  const memberOne = {
    ...conversationObj,
    member: { ...memberOneId },
    profile: { ...memberOneProfile },
  };
  const memberTwo = {
    ...conversationObj,
    member: { ...memberTwoId },
    profile: { ...memberTwoProfile },
  };

  const otherMember =
    memberOne.profile._id == profile._id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation._id} video={true} audio={true} />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation._id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation._id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation._id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation._id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
