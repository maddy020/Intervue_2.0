"use client";

import { SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <SignIn />
    </div>
  );
};

export default page;
