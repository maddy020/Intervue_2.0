import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import user from "./icons/3d-casual-life-boy-with-laptop-sitting-on-floor.png";
import meet from "./icons/casual-life-3d-boy-studying-remotely-with-tutor.png";
import { useRouter } from "next/navigation";
import loginIcon from "./icons/clerk.jpg";

const Hero = () => {
  const router = useRouter();
  return (
    <section className="items-center md:mt-40 HeroContainer">
      <div className="container mx-auto px-4 relative">
        <Image
          src={user}
          alt=""
          className=" bg-white border p-2 userIcon"
          width={65}
          height={65}
        />
        <Image
          src={meet}
          alt=""
          className="absolute border p-2 meetIcon"
          width={90}
          height={90}
        />
        <div className="max-w-[600px] lg:max-w-[900px] mx-auto StreamlineDiv">
          <h1 className="Streamline">
            Streamline Your Hiring, Maximize Your Success
          </h1>

          <p className="text-center Hiring">
            Make hiring quick and easy with our platform, helping you build a
            winning team and achieve greater success{" "}
            <br className="hidden md:block" /> Powered by Clerk Auth for
            seamless, secure access.
          </p>
        </div>
        <div className="flex items-center justify-center HiringButton">
          <Button
            className="pl-2 py-6 SignupButton"
            onClick={() => {
              router.push("/sign-up");
            }}
          >
            <Image src={loginIcon} width={26} height={26} alt="login Icon" />
            Sign up with Clerk
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
