import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";

const Userbutton = () => {
  return (
    <>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: "45px",
                height: "45px",
              },
              userButtonOuterBox: {
                width: "50px",
                height: "50px",
              },
            },
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
};

export default Userbutton;
