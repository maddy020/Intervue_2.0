"use client";

import { useState } from "react";
import { Meeting, columns } from "./columns";
import { DataTable } from "./data-table";
import Schedule_Dialog from "@/appComponents/schedule_dialog";
import { useUser } from "@clerk/nextjs";
// import { Suspense } from "react";

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
  const data: Meeting[] = [
    {
      id: "awesomecoderawesome",
      meeting_link: "https://mydomain.com",
      status: "Not Done",
      interviewee_name: "Rahul, Rohan, Karan Aujla",
      Date_and_time: "2024-08-01T10:00:00Z",
    },
  ];
  // const [data, setData] = useState<Meeting[]>([{
  //   status: "",
  //   roomId: "",
  //   interviewee_name: "",
  //   dateandTime: "",
  //   meeting_link: "https://mydomain.com"
  // }]);

  // useEffect(() => {
  //   const getUserMeet = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:8000/allMeet");
  //       console.log(res.data);
  //       setData({
  //         status: res.data.
  //       });
  //     } catch (error) {
  //       console.log("Error while fetching data", error);
  //     }
  //   };
  //   getUserMeet();
  // }, []);

  return (
    // <Suspense>
    <div className="container mx-auto py-10">
      <h1 className="text-center text-2xl mb-8 underline">
        Interviewer Dashboard
      </h1>
      <Schedule_Dialog
        value={value}
        language={language}
        setLanguage={setLanguage}
      />
      <DataTable
        columns={columns(value, user.user?.fullName as string, token, setToken)}
        data={data}
      />
    </div>
    // </Suspense>
  );
}
