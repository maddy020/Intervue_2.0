import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

// export type Meeting = {
//   status: string;
//   roomId: string;
//   interviewee_name: string;
//   dateandTime: string;
//   meeting_link: string;
// };
export type Meeting = {
  id: string;
  meeting_link: string;
  status: "Done" | "Not Done";
  interviewee_name: string;
  Date_and_time: string;
};

export const columns = (
  value: string,
  username: string,
  token: string,
  setToken: React.Dispatch<React.SetStateAction<string>>
): ColumnDef<Meeting>[] => [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "interviewee_name",
    header: "Interviewee Name",
  },
  {
    accessorKey: "Date_and_time",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.original.Date_and_time);
      return date.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "meeting_link",
    header: "Meeting Link",
    cell: ({ row }) => {
      async function solve() {
        try {
          const res1 = await axios.get(
            `http://localhost:8000/getToken?replId=${value}&username=${username}`
          );

          setToken(res1.data.token);
        } catch (error) {
          console.log("Error while fetching token", error);
        }
      }
      solve();
      return (
        <Link
          href={`http://localhost:5173/coding?replId=${value}&token=${token}`}
          className="font-medium underline cursor-pointer"
          target="_blank"
        >
          Join now
        </Link>
      );
    },
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
              onClick={() => {
                console.log(`Cancel meeting with ID: ${meeting.id}`);
              }}
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
