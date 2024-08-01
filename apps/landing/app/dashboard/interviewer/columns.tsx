"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Meeting = {
  id: string;
  meeting_link: string;
  status: "Done" | "Not Done";
  interviewee_name: string;
  Date_and_time: string;
};

export const columns: ColumnDef<Meeting>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      const meetingLink = row.original.meeting_link;
      return (
        <div className="font-medium underline cursor-pointer">
          {meetingLink}
        </div>
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
