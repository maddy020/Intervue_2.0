import { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import axios from "axios";
import { Meeting } from "@repo/types";

function MeetingLinkCell({
  value,
  username,
  token,
  setToken,
  replId,
}: {
  value: string;
  username: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  replId: string;
}) {
  useEffect(() => {
    async function solve() {
      try {
        const res1 = await axios.get(
          `https://api.intervue.200xdevs.works/getToken?replId=${value}&username=${username}`
        );

        setToken(res1.data.token);
      } catch (error) {
        console.log("Error while fetching token", error);
      }
    }
    solve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, username]);

  return (
    <Link
      href={`https://intervue-2-0-frontend-pi.vercel.app/coding?replId=${replId}&token=${token}`}
      className="font-medium underline cursor-pointer"
      target="_blank"
    >
      Join now
    </Link>
  );
}

const handleDeleteMeeting = async (
  meetingId: string,
  setAllMeet: React.Dispatch<React.SetStateAction<Meeting[]>>
) => {
  try {
    await axios.delete(
      `https://api.intervue.200xdevs.works/deleteMeet/${meetingId}`
    );
    const res = await axios.get("https://api.intervue.200xdevs.works/allMeet");
    setAllMeet(res.data.allmeet);
  } catch (error) {
    console.log("Error while deleting meeting", error);
    alert("Error while deleting meeting");
  }
};

export const columns = (
  value: string,
  username: string,
  token: string,
  setToken: React.Dispatch<React.SetStateAction<string>>,
  setAllMeet: React.Dispatch<React.SetStateAction<Meeting[]>>
): ColumnDef<Meeting>[] => [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "participants",
    header: "Interviewee Name",
    cell: ({ row }) => {
      const participants = row.original.participants;
      return participants.map((p) => p.user.name).join(", ");
    },
  },
  {
    accessorKey: "dateandTime",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.original.dateandTime);
      return date.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    },
    sortingFn: "datetime",
  },
  {
    header: "Meeting Link",
    cell: ({ row }) => (
      <MeetingLinkCell
        value={value}
        username={username}
        token={token}
        setToken={setToken}
        replId={row.original.roomId}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const meeting = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                console.log(`Reschedule meeting with ID: ${meeting.id}`);
              }}
              className="cursor-pointer"
            >
              Reschedule Meeting
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDeleteMeeting(meeting.id, setAllMeet)}
              className="cursor-pointer"
            >
              Cancel Meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
