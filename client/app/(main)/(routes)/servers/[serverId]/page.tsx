import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile(["channels"]);
  const generalChannel = profile?.channels?.filter(
    (channel: any) => channel.name == "general"
  );

  if (!generalChannel || generalChannel[0].name != "general") {
    return null;
  }

  return redirect(
    `/servers/${params?.serverId}/channels/${generalChannel[0]._id}`
  );
};

export default ServerIdPage;
