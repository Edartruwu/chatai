"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  Cross1Icon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";

function Navbar(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const items = [
    { label: "Linko?", href: "#linko" },
    { label: "Pricing", href: "#pricing" },
    { label: "Prueba a Linko", href: "#demo" },
  ];

  useEffect(() => {
    function checkIfMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <>
      <nav
        className={`
        fixed top-0 left-0 right-0 flex flex-col md:flex-row items-center justify-between 
        w-full max-w-[90vw] mx-auto border-4 border-black p-2 md:p-4 px-4 md:px-12 my-4 
        bg-primary bg-opacity-90 backdrop-blur-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-50
        transition-all duration-300 ease-in-out
        ${isMenuOpen ? "h-screen md:h-auto rounded-[22px] md:rounded-[50px]" : "rounded-[50px]"}
      `}
      >
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link href="/" className="flex items-center ">
            <Image
              fill
              src="/LinkoLogo.png"
              alt="Logo"
              className="text-black max-h-[50px] max-w-[150px] object-cover p-[1px] mt-3"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <Cross1Icon className="w-6 h-6" />
            ) : (
              <HamburgerMenuIcon className="w-6 h-6" />
            )}
          </Button>
        </div>

        <div
          className={`
          ${isMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-6 
          text-lg font-mono mt-8 md:mt-0 w-full md:w-auto items-center
          ${isMenuOpen ? "h-full justify-center" : ""}
        `}
        >
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="py-2 px-4 text-black hover:bg-secondary hover:text-secondary-foreground rounded-full transition-colors duration-200"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="md:hidden mt-4 w-full max-w-xs"
            onClick={() => {
              setIsMenuOpen(false);
            }}
          >
            <Button className="w-full group" variant="outline">
              Usa linko
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:-rotate-45 transition-transform duration-200" />
            </Button>
          </Link>
        </div>

        <Link href="/user" className="hidden md:block">
          <Button
            className="group rounded-[50px] bg-secondary"
            variant="outline"
            size={"lg"}
          >
            <p className="text-lg font-medium">Usa Linko</p>
            <ArrowRightIcon className="w-6 h-6 ml-2 group-hover:-rotate-45 transition-transform duration-200" />
          </Button>
        </Link>
      </nav>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
}

export { Navbar };
