"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Appbar from "../appComponents/Appbar";
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
    <div>
      <Appbar />
      <h1 className="mt-12">Hello</h1>
    </div>
  );
}
