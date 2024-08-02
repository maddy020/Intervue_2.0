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
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState<Value>(new Date());
  const router = useRouter();

  const participants = [
    "rishavrtwt@gmail.com",
    "maddy020@gmail.com",
    "rohanhr@gmail.com",
    "kunalhello@gmail.com",
    "rishavrtwt@gmail.com",
    "maddy020@gmail.com",
    "rohanhr@gmail.com",
    "kunalhello@gmail.com",
  ];

  const handleParticipantSelect = (email: string) => {
    if (
      selectedParticipants.length < 3 &&
      !selectedParticipants.includes(email)
    ) {
      setSelectedParticipants([...selectedParticipants, email]);
    }
  };

  const handleParticipantRemove = (email: string) => {
    setSelectedParticipants(
      selectedParticipants.filter((item) => item !== email)
    );
  };

  const handleSubmit = async () => {
    alert(`Interview Scheduled at ${time}`);
    const res = await axios.post("http://localhost:8000/schedulemeet", {
      replId: value,
      scheduleTime: time,
      participants: selectedParticipants,
    });
  };

  const filteredParticipants = participants.filter((participant) =>
    participant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog>
      <div className="flex justify-end">
        <DialogTrigger asChild>
          <Button variant="outline">Schedule Interview</Button>
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
                setTime(value?.toISOString());
                console.log(value?.toISOString());
              }}
              value={time}
            />
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time">Time</Label>
            <TimePicker
              id="time"
              onChange={(value) => setTime(value || "")}
              value={time}
              clockIcon={null}
              disableClock={true}
            />
          </div> */}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="col-span-3"
                placeholder="Search..."
              />
            </div>
            {searchQuery && (
              <div className="absolute w-full mt-2">
                {filteredParticipants.map((participant) => (
                  <div
                    key={participant}
                    className="flex items-center justify-between"
                  >
                    <Button
                      className="w-full flex justify-start"
                      variant="ghost"
                      onClick={() => handleParticipantSelect(participant)}
                      disabled={selectedParticipants.includes(participant)}
                    >
                      {participant}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-2 col-span-4">
            {selectedParticipants.map((participant) => (
              <div key={participant} className="flex items-center space-x-2">
                <span>{participant}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleParticipantRemove(participant)}
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
