"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Schedule_Dialog from "@/appComponents/schedule_dialog";
import { useUser } from "@clerk/nextjs";
import { Meeting } from "@repo/types";
import axios from "axios";

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

export default function DemoPage() {
  // const data = await getData();
  const [language, setLanguage] = useState("");
  const [value, setValue] = useState(getRandomId());
  const [token, setToken] = useState("");
  const user = useUser();
  const [allMeet, setAllMeet] = useState<Meeting[]>([]);

  useEffect(() => {
    const getUserMeet = async () => {
      try {
        const res = await axios.get(
          "https://api.intervue.200xdevs.works/init-service/allMeet"
        );
        console.log(res.data.allmeet);
        setAllMeet(res.data.allmeet);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    getUserMeet();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-center text-2xl mb-8 underline">
        Interviewer Dashboard
      </h1>
      <Schedule_Dialog
        value={value}
        language={language}
        setLanguage={setLanguage}
        setValue={setValue}
        getRandomId={getRandomId}
        setAllMeet={setAllMeet}
        allMeet={allMeet}
      />
      <DataTable
        columns={columns(
          value,
          user.user?.fullName as string,
          token,
          setToken,
          setAllMeet
        )}
        data={allMeet.map((meet) => {
          return meet;
        })}
      />
    </div>
  );
}
