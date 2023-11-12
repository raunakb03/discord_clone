import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import axios from "axios";

interface ServerSidebarProps {
  serverId: string;
}

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
    };
    return (
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
        <ServerHeader
          role={role}
          server={propServer}
          textChannels={textChannels}
          audioChannels={audioChannels}
          videoChannels={videoChannels}
          members={otherMembers}
        />
      </div>
    );
  } catch (error) {
    console.log(error);
  }
};
