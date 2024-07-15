"use client";

import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <SignUp />
    </div>
  );
};

export default page;
