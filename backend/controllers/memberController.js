import Member from "../models/MemberSchema.js";

// change memeber role
export const changeMemberRole = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;
    const member = await Member.findById(memberId);
    if (!member) {
      throw new Error("Member not found");
    }
    const updatedMember = await Member.findByIdAndUpdate(memberId, { role: role }, { new: true });
    return res.status(200).json(updatedMember);
  } catch (error) {
    console.log("ERROR FROM GET USER BY USERID CONTROLLER", error);
  }
}