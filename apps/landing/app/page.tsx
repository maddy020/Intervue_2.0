"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Appbar from "../appComponents/Appbar";
import HeroSection from "../appComponents/HeroSection";
import axios from "axios";
export default function Home() {
  const { isSignedIn, user } = useUser();
  useEffect(() => {
    if (isSignedIn) {
      axios
        .post("http://intervue.initservice.rishavrtwt.tech/addUser", {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        })
        .then(() => console.log("User added to the database"))
        .catch((err) => console.log(err));
    }
  }, [isSignedIn, user]);
  return (
    <main className="flex min-h-screen">
      <Appbar />
      <HeroSection />
    </main>
  );
}
