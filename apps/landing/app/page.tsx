"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Appbar from "../appComponents/Appbar";
import axios from "axios";
import { BaseUser } from "@repo/types";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [currentUser, setCurrentUser] = useState<BaseUser | undefined>();

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

  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    const fetchCurrentUser = async () => {
      try {
        if (isSignedIn) {
          const res = await axios.get(
            `http://localhost:8000/currentUser/${email}`
          );
          console.log(res.data.currentUser);
          setCurrentUser(res.data.currentUser);
        }
      } catch (error) {
        console.log("Error while fetching current user", error);
      }
    };
    fetchCurrentUser();
  }, [isSignedIn, user]);

  return (
    <div>
      <Appbar currentUser={currentUser} />
      <h1 className="mt-12">Hello</h1>
    </div>
  );
}
