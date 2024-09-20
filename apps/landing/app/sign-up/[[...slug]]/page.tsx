"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";

const Page = () => {
  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <SignUp />
    </div>
  );
};

export default Page;
