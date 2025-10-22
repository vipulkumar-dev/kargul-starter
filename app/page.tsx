"use client";
import { useState } from "react";
import Hero from "@/components/home/Hero";
import Brands from "@/components/home/Brands";
import Bento from "@/components/home/Bento";
import Workflow from "@/components/home/Workflow";
import Testimonials from "@/components/home/Testimonials";
import Platform from "@/components/home/Platform";
import Cta from "@/components/home/Cta";
import FAQ from "@/components/home/FAQ";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [isCreator, setIsCreator] = useState(false);
  return (
    <>
      <Header isCreator={isCreator} />
      <main>
        <Hero isCreator={isCreator} setIsCreator={setIsCreator} />
        <Brands isCreator={isCreator} />
        <Bento isCreator={isCreator} />
        <Workflow isCreator={isCreator} />
        <Platform isCreator={isCreator} />
        <Testimonials isCreator={isCreator} />
        <Cta isCreator={isCreator} />
        <FAQ isCreator={isCreator} />
      </main>
      <Footer />
      <div className="absolute top-0 left-0 -z-20 h-[969px] w-full bg-[linear-gradient(180deg,#E0F5FF_0%,#F0FAFF_44.95%,#FFFFFF_100%)]"></div>
      <div className="absolute top-[50%] left-0 -z-20 h-[2467px] w-full -translate-y-1/2 bg-[linear-gradient(180.09deg,#FFFFFF_0.52%,#F0FAFF_54.52%,#F0FAFF_82.73%,#FFFFFF_99.92%)]"></div>
    </>
  );
}
