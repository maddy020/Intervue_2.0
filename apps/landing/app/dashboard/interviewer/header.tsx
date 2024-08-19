import React from "react";
import Userbutton from "@/appComponents/userButton";
import Image from "next/image";
import Logo from "@/assets/Logo1.png";

const Header = () => {
  return (
    <div className="flex justify-between h-24 items-center">
      <div>
        <Image
          src={Logo}
          width={80}
          height={80}
          alt="Picture of the interviewer"
        />
      </div>
      <div>
        <Userbutton />
      </div>
    </div>
  );
};

export default Header;
