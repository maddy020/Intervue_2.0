"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComboboxDemo from "../appComponents/dropdown";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Value } from "@repo/types";
import { BaseUser } from "@repo/types";
import { useUser } from "@clerk/nextjs";

const Schedule_Dialog = ({
  value,
  language,
  setLanguage,
}: {
  value: string;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedParticipants, setSelectedParticipants] = useState<BaseUser[]>(
    []
  );
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState(new Date().toISOString());
  const [participants, setParticipants] = useState<BaseUser[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<BaseUser[]>(
    []
  );
  const router = useRouter();

  const handleParticipantSelect = (participant: BaseUser) => {
    if (
      selectedParticipants.length < 3 &&
      !selectedParticipants.find((p) => p.email === participant.email)
    ) {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };

  const handleParticipantRemove = (email: string) => {
    setSelectedParticipants(
      selectedParticipants.filter((item) => item.email !== email)
    );
  };

  const loggedUser = participants.find(
    (participant) =>
      participant.email == user.user?.primaryEmailAddress?.emailAddress
  );

  const handleSubmit = async () => {
    await axios.post("http://localhost:8000/schedulemeet", {
      replId: value,
      interviewer: {
        id: loggedUser?.id,
        email: loggedUser?.email,
        name: loggedUser?.name,
      },
      scheduleTime: time,
      participants: [...selectedParticipants, loggedUser],
    });
    const res2 = await axios.post("http://localhost:8000/project", {
      replId: value,
      language: language,
    });
  };

  const handleScheduling = async () => {
    try {
      const res = await axios.get("http://localhost:8000/allUsers");
      setParticipants(res.data.allUsers);
    } catch (err) {
      console.log("Error in setting all users", err);
    }
  };
  console.log("time", time);

  return (
    <Dialog>
      <div className="flex justify-end">
        <DialogTrigger asChild>
          <Button variant="outline" onClick={handleScheduling}>
            Schedule Interview
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="replid">ReplId</Label>
            <Input
              id="replid"
              defaultValue={value}
              className="col-span-3"
              disabled
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date">Date</Label>
            <DateTimePicker
              onChange={(value) => {
                setTime(value?.toISOString() as string);
              }}
              value={new Date(time)}
              disableClock={true}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language">Language</Label>
            <ComboboxDemo language={language} setLanguage={setLanguage} />
          </div>
          <div className="relative">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="search">Participants</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFilteredParticipants(
                    participants.filter((participant) => {
                      return (
                        participant.name
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase()) ||
                        participant.email
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                      );
                    })
                  );
                }}
                className="col-span-3"
                placeholder="Search..."
              />
            </div>
            {searchQuery && (
              <div className="absolute w-full mt-2">
                {filteredParticipants.map(
                  (participant) =>
                    loggedUser?.email !== participant.email && (
                      <div
                        key={participant.email}
                        className="flex items-center justify-between"
                      >
                        <Button
                          className="w-full flex justify-start"
                          variant="ghost"
                          onClick={() => {
                            handleParticipantSelect(participant);
                            setSearchQuery("");
                          }}
                          disabled={selectedParticipants.includes(participant)}
                        >
                          {participant.name}
                        </Button>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
          <div className="grid gap-2 col-span-4">
            {selectedParticipants.map((participant) => (
              <div
                key={participant.email}
                className="flex items-center space-x-2"
              >
                <span>{participant.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleParticipantRemove(participant.email)}
                >
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Schedule_Dialog;
