"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import acme from "./icons/logo-acme_chpmz7.png";
import celestial from "./icons/logo-celestial_dv5uka.png";
import echo from "./icons/logo-echo_i5hnpv.png";
import pulse from "./icons/logo-pulse_woeaxa.png";
import quantum from "./icons/logo-quantum_hvfwas.png";

const LogoTicker = () => {
  return (
    <div className="Logo-ticker-container">
      <div className="inner-container">
        <div className="content content-md">
          <div className="logo-container">
            <motion.div
              className="logo-ticker"
              animate={{ translateX: "-50%" }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
            >
              <Image
                src={acme}
                alt="Acme Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
              <Image
                src={celestial}
                alt="Celestial Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
              <Image
                src={echo}
                alt="Echo Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
              <Image
                src={pulse}
                alt="Pulse Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
              <Image
                src={quantum}
                alt="Quantum Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
              <Image
                src={acme}
                alt="Acme Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
              <Image
                src={celestial}
                alt="Celestial Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
              <Image
                src={echo}
                alt="Echo Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
              <Image
                src={pulse}
                alt="Pulse Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
              <Image
                src={quantum}
                alt="Quantum Logo"
                className="logo-ticker-img"
                width={200}
                height={200}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
