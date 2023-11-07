import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import axios from "axios";

export const initialProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return redirectToSignIn();
    }

    const { data: profile } = await axios.get(
      `${process.env.BASE_URL}/api/profile/${user.id}`
    );

    if (profile) return profile;

    const body = {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    };

    const { data: newProfile } = await axios.post(
      `${process.env.BASE_URL}/api/profile/createProfile`,
      body
    );

    return newProfile;
  } catch (error) {
    console.log(error);
  }
};
