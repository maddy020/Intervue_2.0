import React from "react";
import Userbutton from "@/appComponents/userButton";
import logo from "@/appComponents/icons/logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/`);
  };

  return (
    <div className="flex justify-between h-24 items-center px-8">
      <div onClick={handleClick}>
        <Image
          style={{
            border: "1px solid lightgrey",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "12%",
          }}
          src={logo}
          width={54}
          height={54}
          alt="logo"
        />
      </div>
      <div>
        <Userbutton />
      </div>
    </div>
  );
};

export default Header;
