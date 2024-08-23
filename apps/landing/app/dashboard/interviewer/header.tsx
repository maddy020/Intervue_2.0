import React from "react";
import Userbutton from "@/appComponents/userButton";
import Logo from "@/appComponents/icons/Logo";

const Header = () => {
  return (
    <div className="flex justify-between h-24 items-center px-8">
      <div>
        <Logo />
      </div>
      <div>
        <Userbutton />
      </div>
    </div>
  );
};

export default Header;
