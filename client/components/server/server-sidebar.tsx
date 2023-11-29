import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import axios from "axios";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  TEXT: <Hash className="mr-2 h-4 w-4" />,
  AUDIO: <Mic className="mr-2 h-4 w-4" />,
  VIDEO: <Video className="mr-2 w-4 h-4" />,
};

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  try {
    const { data: server } = await axios.get(
      `${process.env.BASE_URL}/api/server/getServer/${serverId}?populate=channels-members`
    );
    if (!server) {
      return redirect("/");
    }
    const channels = server.channels;
    const members = server.members;
    const textChannels = channels.filter(
      (channel: any) => channel.type == "TEXT"
    );
    const audioChannels = channels.filter(
      (channel: any) => channel.type == "AUDIO"
    );
    const videoChannels = channels.filter(
      (channel: any) => channel.type == "VIDEO"
    );
    const otherMembers = members.filter(
      (member: any) => member.profileId != profile._id
    );
    const role = members.find(
      (member: any) => member.profileId == profile._id
    )?.role;
    const propServer = {
      _id: server._id.toString(),
      name: server.name,
      imageUrl: server.imageUrl,
      inviteCode: server.inviteCode,
      profileId: server.profileId.toString(),
      currUser: profile._id.toString(),
    };

    let memberIdToProfile = {};
    if (otherMembers.length > 0) {
      await Promise.all(
        otherMembers.map(async (member: any) => {
          try {
            const { data } = await axios.get(
              `${process.env.BASE_URL}/api/profile/user/${member.profileId}`
            );
            memberIdToProfile[data._id] = data;
          } catch (error) {
            console.log(error);
          }
        })
      );
    }

    return (
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
        <ServerHeader
          role={role}
          server={propServer}
          textChannels={textChannels}
          audioChannels={audioChannels}
          videoChannels={videoChannels}
          otherMembers={otherMembers}
          members={server.members}
        />
        <ScrollArea>
          <div className="mt-2">
            <ServerSearch
              data={[
                {
                  label: "Text Channels",
                  type: "channel",
                  data: textChannels?.map((channel: any) => ({
                    id: channel._id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Voice Channels",
                  type: "channel",
                  data: audioChannels?.map((channel: any) => ({
                    id: channel._id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Video Channels",
                  type: "channel",
                  data: videoChannels?.map((channel: any) => ({
                    id: channel._id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Members",
                  type: "member",
                  data: otherMembers?.map((member: any) => ({
                    id: member._id,
                    name: memberIdToProfile[member.profileId].name,
                    // name: memberIdToProfile?[member.profileId]?.name,
                    icon: roleIconMap[member.role],
                  })),
                },
              ]}
            />
          </div>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!textChannels?.length && (
            <div className="mb-2 px-2">
              <ServerSection
                sectionType="channels"
                channelType="TEXT"
                role={role}
                label="Text Channels"
                server={propServer}
                members={members}
              />
              {textChannels.map((channel: any) => (
                <ServerChannel
                  key={channel._id}
                  channel={channel}
                  role={role}
                  server={propServer}
                />
              ))}
            </div>
          )}
          {!!audioChannels?.length && (
            <div className="mb-2 px-2">
              <ServerSection
                sectionType="channels"
                channelType="AUDIO"
                role={role}
                label="Voice Channels"
                server={propServer}
                members={members}
              />
              {audioChannels.map((channel: any) => (
                <ServerChannel
                  key={channel._id}
                  channel={channel}
                  role={role}
                  server={propServer}
                />
              ))}
            </div>
          )}
          {!!videoChannels?.length && (
            <div className="mb-2 px-2">
              <ServerSection
                sectionType="channels"
                channelType="VIDEO"
                role={role}
                label="Video Channels"
                server={propServer}
                members={members}
              />
              {videoChannels.map((channel: any) => (
                <ServerChannel
                  key={channel._id}
                  channel={channel}
                  role={role}
                  server={propServer}
                />
              ))}
            </div>
          )}
          {!!otherMembers?.length && (
            <div className="mb-2 px-2">
              <ServerSection
                sectionType="members"
                role={role}
                label="Members"
                server={propServer}
              />
              {otherMembers.map((member: any) => (
                <ServerMember />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  } catch (error) {
    console.log(error);
  }
};
