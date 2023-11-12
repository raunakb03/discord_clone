import { auth } from "@clerk/nextjs";
import axios from "axios";

export const currentProfile = async (populate: string[] | null) => {
  const user = await auth().userId;
  if (!user) {
    return null;
  }
  let populateString = "";
  if (populate) populateString= populate.join("-");
  try {
    const { data: profile } = await axios.get(
      `${process.env.BASE_URL}/api/profile/${user}?populate=${populateString}`
    );
    if (profile) return profile;
    else return null;
  } catch (error) {
    console.log(error);
  }
};
