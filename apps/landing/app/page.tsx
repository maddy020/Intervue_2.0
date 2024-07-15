"use client";
import { DialogDemo } from "../appComponents/dialogBox";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-10 ">
      <nav>
        <DialogDemo />
      </nav>
    </main>
  );
}
