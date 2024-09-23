"use client";

import Appbar from "../appComponents/Appbar";
import Hero from "@/appComponents/Hero";
import HeroImage from "@/appComponents/HeroImage";
import LogoTicker from "@/appComponents/LogoTicker";
import Feature from "@/appComponents/Features";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Footer } from "@/appComponents/Footer";
import CtaFooter from "@/appComponents/CtaFooter";
import "../appComponents/styles/module.css";
import Testimonials from "@/appComponents/Testimonials";
import DocsShowcase from "@/appComponents/Docshowcase";
export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <>
      <Appbar currentUser={currentUser} />
      <Hero />
      <HeroImage />
      <LogoTicker />
      <Feature />
      <DocsShowcase />
      <Testimonials />
      <CtaFooter />
      <Footer />
    </>
  );
}
