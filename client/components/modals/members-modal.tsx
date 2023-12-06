"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatra";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

const roleIconMap: any = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const MembersModal = () => {
  const router = useRouter();
  const { isOpen, type, onClose, data, onOpen } = useModal();
  const { server } = data;
  const isModalOpen = isOpen && type === "members";
  const [profiles, setProfiles] = useState<any>([]);
  const [loadingId, setLoadingId] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      if (server) {
        const res = await Promise.all(
          server?.members?.map(async (member: any) => {
            try {
              const { data } = await axios.get(
                `${process.env.BASE_URL}/api/profile/user/${member.profileId}`
              );
              const memberRole = member.role;
              const memberId = member._id;
              return { ...data, role: memberRole, memberId: memberId };
            } catch (error) {
              console.log(error);
            }
          }) || []
        );
        setProfiles(res);
      }
    };

    fetchProfiles();
  }, [server]);

  const onDelete = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const { data } = await axios.delete(
        `${process.env.BASE_URL}/api/member/deleteMember/${memberId}`
      );
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRolechange = async (
    memberId: string,
    role: "GUEST" | "MODERATOR"
  ) => {
    try {
      setLoadingId(memberId);
      const { data } = await axios.put(
        `${process.env.BASE_URL}/api/member/changeRole/${memberId}`,
        { role }
      );
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {profiles?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {profiles?.map((profile: any) => (
            <div key={profile._id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-sm font-semibold flex items-center gap-x-1">
                  {profile.name}
                  {roleIconMap[profile.role]}
                </div>
                <p className="text-xs text-zinc-500">{profile.email}</p>
              </div>
              {server?.profileId != profile._id && loadingId != profile._id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() =>
                                onRolechange(profile.memberId, "GUEST")
                              }
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Guest
                              {profile.role === "GUEST" && (
                                <Check className="h-4 w-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onRolechange(profile.memberId, "MODERATOR")
                              }
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Moderator
                              {profile.role === "MODERATOR" && (
                                <Check className="h-4 w-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(profile.memberId)}
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId == profile.memberId && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
