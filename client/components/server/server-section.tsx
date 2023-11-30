"use client";

import { Plus, Settings } from "lucide-react";
import { ActionToolTip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: "ADMIN" | "MODERATOR" | "GUEST";
  sectionType: "channels" | "members";
  channelType?: "TEXT" | "AUDIO" | "VIDEO";
  server?: any;
  members?: any;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
  members,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== "GUEST" && sectionType === "channels" && (
        <ActionToolTip label="Create Channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() =>
              onOpen("createChannel", {
                server: server,
                channelType: channelType,
              })
            }
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionToolTip>
      )}
      {role === "ADMIN" && sectionType === "members" && (
        <ActionToolTip label="Manage Members" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() =>
              onOpen("members", { server: { ...server, members } })
            }
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionToolTip>
      )}
    </div>
  );
};
