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

import Logo from "../appComponents/icons/Logo";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import loginIcon from "./icons/clerk.jpg";
import Image from "next/image";
import "./styles/module.css";
import Link from "next/link";
import dashboard from "./icons/dashboardImage.svg";

const Appbar = () => {
  const router = useRouter();

  const handleDashboard = () => {
    router.push(`/dashboard/interviewer`);
  };

  return (
    <div className="appbar py-4 border-b">
      <div className="px-4 appbar-first">
        <div className="flex justify-between items-center appbar-second">
          <Logo />
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
            </nav>
          </div>
          <div className="hamburger">
            <Button
              className="loginButton"
              onClick={() => {
                router.push("/sign-in");
              }}
            >
              Login
              <Image src={loginIcon} width={26} height={26} alt="login Icon" />
            </Button>
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
