import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Meeting } from "@repo/types";
import { useRouter } from "next/navigation";

function MeetingLinkCell({
  replId,
  dateandTime,
  username,
  focus,
  id,
}: {
  replId: string;
  dateandTime: string;
  username: string;
  focus: "conduct" | "attend" | null;
  id: string | string[];
}) {
  const handleMeetingJoin = async (
    replId: string,
    dateandTime: string,
    username: string
  ) => {
    const currentTime = new Date();
    const scheduledMeetingTime = new Date(dateandTime);
    if (currentTime < scheduledMeetingTime) {
      alert("You cannot join the meeting before the scheduled date and time.");
      return;
    }

    if (focus === "conduct") {
      window.location.href = `${process.env.NEXT_PUBLIC_CODING_URL}/coding?id=${id}&replId=${replId}&username=${username}&role=${process.env.NEXT_PUBLIC_INTERVIEWER}`;
    } else if (focus === "attend") {
      window.location.href = `${process.env.NEXT_PUBLIC_CODING_URL}/coding?id=${id}&replId=${replId}&username=${username}&role=${process.env.NEXT_PUBLIC_INTERVIEWEE}`;
    }
  };

  return (
    <Button
      onClick={() => handleMeetingJoin(replId, dateandTime, username)}
      variant={"link"}
    >
      Join now
    </Button>
  );
}

const handleDeleteMeeting = async (
  meetingId: string,
  setAllMeet: React.Dispatch<React.SetStateAction<Meeting[]>>,
  id: string | string[]
) => {
  try {
    console.log("Deleting meeting with id", meetingId);
    await axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/deleteMeet/${meetingId}`
    );
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/interviewsToConduct/${id}`
    );
    setAllMeet(res.data.allmeet);
  } catch (error) {
    console.log("Error while deleting meeting", error);
    alert("Error while deleting meeting");
  }
};

export const columns = (
  username: string,
  setAllMeet: React.Dispatch<React.SetStateAction<Meeting[]>>,
  id: string | string[],
  focus: "conduct" | "attend" | null
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
        username={username}
        replId={row.original.roomId}
        dateandTime={row.original.dateandTime}
        focus={focus}
        id={id}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const meeting = row.original;

      return focus === "conduct" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleDeleteMeeting(meeting.id, setAllMeet, id)}
              className="cursor-pointer"
            >
              Cancel Meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null;
    },
  },
];
