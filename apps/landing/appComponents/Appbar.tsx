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
import { BaseUser } from "@repo/types";
import { useRouter } from "next/navigation";

const Appbar = (currentUser: { currentUser: BaseUser | undefined }) => {
  const router = useRouter();

  const handleDashboard = (id: string | undefined) => {
    router.push(`/dashboard/interviewer/${id}`);
  };

  return (
    <div className="absolute w-full top-0 py-4 border-b md:border-none">
      <div className="px-4 container mx-auto">
        <div className="flex justify-between items-center md:border">
          <Logo />
          <Button>Product Demo</Button>
          <Button>Login</Button>
          <Button onClick={() => handleDashboard(currentUser.currentUser?.id)}>
            Dashboard
          </Button>
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
    </div>
  );
};

export default Appbar;
