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
import { ComboboxDemo } from "../appComponents/dropdown";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Value } from "@repo/types";
import { BaseUser } from "@repo/types";
import { useUser } from "@clerk/nextjs";
function getRandomId() {
  const SLUG_WORKS = [
    "cool",
    "coder",
    "awesome",
    "cringe",
    "worker",
    "intelligent",
    "rider",
    "load",
    "network",
    "open",
    "source",
  ];
  let slug = "";
  for (let i = 0; i < 3; i++) {
    slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
  }
  return slug;
}

const Schedule_Dialog = () => {
  const [value, setValue] = useState(getRandomId());
  const [language, setLanguage] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<BaseUser[]>(
    []
  );
  const user = useUser();
  console.log(user);
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
  console.log(loggedUser);
  const handleSubmit = async () => {
    const loggedUser = participants.find(
      (participant) =>
        participant.email == user.user?.primaryEmailAddress?.emailAddress
    );
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
  };

  const handleScheduling = async () => {
    try {
      const res = await axios.get("http://localhost:8000/allUsers");
      setParticipants(res.data.allUsers);
    } catch (err) {
      console.log("Error in setting all users", err);
    }
  };

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
                console.log(value?.toISOString());
              }}
              value={time}
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
                {filteredParticipants.map((participant) => (
                  <div
                    key={participant.email}
                    className="flex items-center justify-between"
                  >
                    <Button
                      className="w-full flex justify-start"
                      variant="ghost"
                      onClick={() => handleParticipantSelect(participant)}
                      disabled={selectedParticipants.includes(participant)}
                    >
                      {participant.name}
                    </Button>
                  </div>
                ))}
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
