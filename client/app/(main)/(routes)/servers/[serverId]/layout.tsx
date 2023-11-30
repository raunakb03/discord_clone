import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/server/server-sidebar";
import axios from "axios";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) => {
  const profile = await currentProfile(["members"]);
  console.log(params.serverId);
  if (!profile) {
    return redirectToSignIn();
  }
  const profileMembers = profile.members;
  try {
    const { data: server } = await axios.get(
      `${process.env.BASE_URL}/api/server/getServer/${params.serverId}`
    );
    // check if this member is a member of the current server
    let isMember = false;
    for (let member in profileMembers) {
      if (server.members.includes(profileMembers[member]._id)) {
        isMember = true;
        break;
      }
    }
    if (!isMember) {
      return redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
