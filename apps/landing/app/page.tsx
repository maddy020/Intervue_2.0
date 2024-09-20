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
import { Footer } from "@/appComponents/Footer";
import CtaFooter from "@/appComponents/CtaFooter";
import "../appComponents/styles/module.css";
import Testimonials from "@/appComponents/Testimonials";
import DocsShowcase from "@/appComponents/Docshowcase";
export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;

    const fetchCurrentUser = async () => {
      try {
        if (isSignedIn) {
          const addUserToDatabase = async () => {
            console.log("user from clerk", user);
            axios
              .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/addUser`, {
                email: user.primaryEmailAddress?.emailAddress,
                name: user.fullName,
                id: user.id,
              })
              .then(() => {
                //@ts-ignore
                setCurrentUser(user);
                console.log("User added to the database");
              })
              .catch((err) => console.log(err));
          };
          addUserToDatabase();
        }
      } catch (error) {
        console.log("Error while fetching current user", error);
      }
    };
    fetchCurrentUser();
  }, [isSignedIn, user]);

  return !isLoaded ? (
    <div>Loading...</div>
  ) : (
    <>
      <Appbar currentUser={currentUser} />
      <Hero />
      <HeroImage />
      <LogoTicker />
      <Feature />
      <DocsShowcase />
      <Testimonials />
      <CtaFooter />
      <Footer />
    </>
  );
}
