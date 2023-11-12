import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  if (!params.inviteCode) {
    return redirect("/");
  }

  try {
    const { data } = await axios.get(
      `${process.env.BASE_URL}/api/server/invite-code/${params.inviteCode}/${profile._id}`
    );
    return (
      <div>
        <Link href="/">Go back</Link>
      </div>
    );
  } catch (error) {
    console.log(error);
  }
};

export default InviteCodePage;
