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

const Appbar = () => {
  return (
    <>
      <header className="py-4 fixed top-0 left-0 right-0 border-b md:border-none  z-10 w-full">
        <div className="px-4 container mx-auto">
          <div className="flex justify-between items-center md:border">
            <Logo />
            <Button>Product Demo</Button>
            <Button>Login</Button>
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="md:hidden">
                    <Menu />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Appbar;
