import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile(["channels"]);
  if (!profile) {
    return redirectToSignIn();
  }
  
  let server;
  try {
    const { data } = await axios.get(
      `${process.env.BASE_URL}/api/server/getServer/${params.serverId}?populate=channels`
    );
    server = data;
  } catch (error) {
    console.log(error);
  }

  const generalChannel = server?.channels?.filter(
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
