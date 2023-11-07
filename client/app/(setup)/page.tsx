// import { InitialModal } from "@/components/modals/initial-modal";
import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";

const SetupPage = async () => {
  const profile = await initialProfile();

  // if (profile.members.length > 0) {
  //   const serverId = profile.servers[0].serverId;
  //   const server = await Server.findById(serverId);
  //   if (server) {
  //     return redirect(`/servers/${server.id}`);
  //   }
  // }
  // return <InitialModal />;

  return <div>home page</div>;
};

export default SetupPage;
