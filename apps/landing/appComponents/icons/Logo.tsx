import React from "react";
import Link from "next/link";
const Logo = () => {
  return (
    <div className="border rounded-sm p-2">
      <Link href="/">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236914/logo_h2ozng.svg"
          className="h-8 w-8 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 60C38.1371 60 60 38.1371 60 0C60 38.1371 81.8629 60 120 60C81.8629 60 60 81.8629 60 120C60 81.8629 38.1371 60 0 60Z"
            fill="#000000"
          />
        </svg>
      </Link>
    </div>
  );
};

export default Logo;
