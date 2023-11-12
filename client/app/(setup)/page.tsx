import { InitialModal } from "@/components/modals/initial-modal";
import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";

const SetupPage = async () => {
  const profile = await initialProfile();
  if (profile.servers.length > 0) {
    const serverId = profile.servers[0];
    return redirect(`/servers/${serverId}`);
  }

  return <InitialModal profileId={profile._id} />;
};

export default SetupPage;
