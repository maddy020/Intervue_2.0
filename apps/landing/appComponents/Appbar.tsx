import React from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import loginIcon from "./icons/clerk.jpg";
import Image from "next/image";
import "./styles/module.css";
import Link from "next/link";
import dashboard from "./icons/dashboardImage.svg";
import logo from "./icons/logo.svg";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Appbar = () => {
  const router = useRouter();

  const handleDashboard = () => {
    router.push(`/dashboard/interviewer`);
  };

  return (
    <div className="appbar py-4 border-b">
      <div className="px-4 appbar-first">
        <div className="flex justify-between items-center appbar-second">
          <Image
            style={{
              border: "1px solid lightgrey",
              padding: "4px",
              borderRadius: "12%",
            }}
            src={logo}
            width={40}
            height={40}
            alt="logo"
          />
          <div className="navDiv">
            <nav className="flex items-center">
              <Link
                className="text-black/70 hover:text-black transition"
                href="#"
              >
                Products
              </Link>
              <Link
                className="text-black/70 hover:text-black transition"
                href="#"
              >
                API & Docs
              </Link>
              <Link
                className="text-black/70 hover:text-black transition"
                href="#"
              >
                FAQ
              </Link>
              <Link
                className="text-black/70 hover:text-black transition"
                href="#"
              >
                Company
              </Link>
              <Button className="loginButton" onClick={handleDashboard}>
                Dashboard
                <Image src={dashboard} width={22} height={22} alt="dashboard" />
              </Button>
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
                <Button
                  className="loginButton"
                  onClick={() => {
                    router.push("/sign-in");
                  }}
                >
                  Login
                  <Image
                    src={loginIcon}
                    width={26}
                    height={26}
                    alt="login Icon"
                  />
                </Button>
              </SignedOut>
            </nav>
          </div>
          <div className="hamburger">
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
              <Button
                className="loginButton"
                onClick={() => {
                  router.push("/sign-in");
                }}
              >
                Login
                <Image
                  src={loginIcon}
                  width={26}
                  height={26}
                  alt="login Icon"
                />
              </Button>
            </SignedOut>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="md:hidden">
                  <Menu />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleDashboard}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Product Demo
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
