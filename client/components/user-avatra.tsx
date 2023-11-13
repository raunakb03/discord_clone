import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  classname?: string;
}

export const UserAvatar = ({ src, classname }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-10 w-10", classname)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};
