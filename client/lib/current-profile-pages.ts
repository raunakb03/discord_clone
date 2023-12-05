import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";

export const currentProfilePages = async (
  req: NextApiRequest,
  populate: string[] | null
) => {
  const user = getAuth(req).userId;
  if (!user) {
    return null;
  }
  let populateString = "";
  if (populate) populateString = populate.join("-");
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
