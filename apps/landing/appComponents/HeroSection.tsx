import React from "react";
import Image from "next/image";
const HeroSection = () => {
  return (
    <section className=" mt-28 md:mt-40 ">
      <div className="mx-auto px-4">
        {/* <Image
          src="https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236916/solana_eoqyva.svg"
          alt=""
          className="relative left-[10%] lg:left-[30%]"
          width={50}
          height={50}
        />
        <Image
          src="https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236912/eth_la99pn.svg"
          alt=""
          className="absolute md:right-[20%] right-[10%] lg:right-[28%] rotate-12 md:top-[26%] top-[34%] lg:top-[34%]"
          width={50}
          height={50}
        /> */}
        <h1>Secure your spot</h1>
      </div>
    </section>
  );
};

export default HeroSection;
