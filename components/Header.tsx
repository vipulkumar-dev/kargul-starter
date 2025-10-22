"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Logo from "@/components/Logo";
import Image from "next/image";

const headerNavLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/casestudies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ isCreator = false }: { isCreator?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollPosition = useRef(0);
  const ticking = useRef(false);
  const isMenuOpenRef = useRef(false);

  const toggleMobileMenu = () => {
    if (isMenuOpen) {
      headerRef.current?.classList.add("active");
    } else {
      headerRef.current?.classList.remove("active");
    }
    setIsMenuOpen(!isMenuOpen);
    isMenuOpenRef.current = !isMenuOpen;
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    isMenuOpenRef.current = false;
  };

  React.useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const isDesktop = window.innerWidth >= 1024;
    const delta = isDesktop ? 70 : 100;

    function handleScroll() {
      if (!header) return;

      const currentScrollPosition = window.scrollY;

      if (
        Math.abs(currentScrollPosition - lastScrollPosition.current) > delta
      ) {
        if (currentScrollPosition > lastScrollPosition.current) {
          // Scrolling down
          header.classList.add("menu-hidden");
          // Close mobile menu when scrolling down
          if (isMenuOpenRef.current) {
            setIsMenuOpen(false);
            isMenuOpenRef.current = false;
          }
        } else {
          // Scrolling up
          header.classList.remove("menu-hidden");
        }
        lastScrollPosition.current = currentScrollPosition;
      }
      ticking.current = false;
    }

    function onScroll() {
      if (!header) return;

      if (!isMenuOpenRef.current) {
        if (!ticking.current) {
          window.requestAnimationFrame(handleScroll);
          ticking.current = true;
        }
      }

      // Update scrolled state
      if (window.scrollY > 0) {
        if (!isMenuOpenRef.current) {
          header.classList.add("active");
        }
      } else {
        header.classList.remove("active");
      }
    }

    // Check initial scroll position on mount
    if (window.scrollY > 0) {
      header.classList.add("active");
    }
    lastScrollPosition.current = window.scrollY;

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full">
      <header
        ref={headerRef}
        className={`absolute top-0 z-50 flex h-18 w-full items-center justify-center border-2 border-transparent transition-all duration-500 ease-[cubic-bezier(0.64_-0.01,_0,_1)] will-change-transform sm:h-22`}
      >
        <div className="px-global w-full">
          <div className="max-w-global relative z-0 mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <Link
                  href="/"
                  className="flex items-center gap-1.5"
                  aria-label="SideShift home"
                  onClick={closeMobileMenu}
                >
                  <Logo />
                </Link>

                <nav
                  className="hidden items-center gap-5 md:flex"
                  aria-label="Primary"
                >
                  {headerNavLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="font-geist text-base leading-[140%] text-[rgba(32,32,32,0.75)] transition-colors hover:text-[#202020]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden items-center gap-4 md:flex">
                  <Link
                    href="https://sideshift.app/signup"
                    className="font-geist bg-[linear-gradient(0deg,#202020_0%,#515151_100%)] bg-clip-text text-base leading-[140%] font-bold [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href={
                      isCreator
                        ? "https://sideshift.app/signup"
                        : "https://sideshift.app/signup"
                    }
                  >
                    <Button
                      key={isCreator ? "join-now" : "join-now"}
                      variant="primary"
                      size="sm"
                    >
                      <span>{isCreator ? "Join Now" : "Join Now"}</span>
                    </Button>
                  </Link>
                </div>
                <div className="flex gap-2 md:hidden">
                  <button
                    onClick={toggleMobileMenu}
                    className="shrink-0 rounded-lg transition-colors hover:bg-gray-100"
                    aria-label="Toggle mobile menu "
                  >
                    {isMenuOpen ? (
                      // <X className="h-6 w-6 text-gray-700" />
                      <Image
                        src="/icons/x.png"
                        width={26}
                        height={26}
                        alt=""
                        className="w-[26px] max-w-none"
                      ></Image>
                    ) : (
                      <Image
                        src="/icons/equal.png"
                        width={32}
                        height={32}
                        className="w-[32px] max-w-none"
                        alt=""
                      ></Image>
                    )}
                  </button>
                  <Link href="https://sideshift.app/signup">
                    <Button size={"sm"} variant={"secondary"} className="">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header_bg absolute top-0 left-0 -z-10 h-full w-full bg-[linear-gradient(180deg,#E0F5FF_0%,#F0FAFF_44.95%,#FFFFFF_100%)] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.64_-0.01,_0,_1)]"></div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 1, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: "-100%" }}
            transition={{
              duration: 0.9,
              ease: [0.8, 0, 0.2, 1],
            }}
            className="fixed top-0 right-0 bottom-0 left-0 z-40 border-b border-gray-200 bg-white shadow-lg will-change-transform"
          >
            <div className="px-global h-full py-6 pt-16">
              <div className="max-w-global mx-auto flex h-full flex-col justify-between">
                <nav className="flex flex-col">
                  {headerNavLinks.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`font-geist py-[18px] text-base leading-[140%] font-bold tracking-[-0.157px] text-[#202020] ${
                        index < headerNavLinks.length - 1
                          ? "border-b border-[rgba(0,0,0,0.10)]"
                          : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex flex-col gap-2.5">
                  <Link
                    href={
                      isCreator
                        ? "https://sideshift.app/signup"
                        : "/casestudies"
                    }
                  >
                    <Button variant="secondary" size="lg" className="w-full">
                      {isCreator ? "Explore Gigs" : "Case Studies"}
                    </Button>
                  </Link>
                  <Link href="https://sideshift.app/signup">
                    <Button variant="primary" size="lg" className="w-full">
                      {isCreator ? "Join as a Creator" : "Join as a Brand"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
