"use client";

import Appbar from "../appComponents/Appbar";
import Hero from "@/appComponents/Hero";
import HeroImage from "@/appComponents/HeroImage";
import LogoTicker from "@/appComponents/LogoTicker";
import Feature from "@/appComponents/Features";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { BaseUser } from "@repo/types";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [currentUser, setCurrentUser] = useState<BaseUser | undefined>();

  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    const fetchCurrentUser = async () => {
      try {
        if (isSignedIn) {
          const res = await axios.get(
            `http://localhost:8000/currentUser/${email}`
          );
          setCurrentUser(res.data.currentUser);
        }
      } catch (error) {
        console.log("Error while fetching current user", error);
      }
    };
    fetchCurrentUser();
  }, [isSignedIn, user]);

  return (
    <>
      <Appbar currentUser={currentUser} />
      <Hero />
      <HeroImage />
      <LogoTicker />
      <Feature />
    </>
  );
}
