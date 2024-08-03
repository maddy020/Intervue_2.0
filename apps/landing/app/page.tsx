"use client";
import { DialogDemo } from "../appComponents/dialogBox";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
export default function Home() {
  const { isSignedIn, user } = useUser();
  useEffect(() => {
    if (isSignedIn) {
      axios
        .post("http://localhost:8000/addUser", {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        })
        .then(() => console.log("User added to the database"))
        .catch((err) => console.log(err));
    }
  }, [isSignedIn, user]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-10">
      <nav>{/* <DialogDemo /> */}</nav>
      <h1>Go to /dashboard/interviewer</h1>
    </main>
  );
}
