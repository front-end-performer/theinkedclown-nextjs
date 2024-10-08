"use client";

import {
  Navbar,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useState } from "react";
import { useHash } from "@/useHash";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logos/inkedclown-logo-header.png";
import LocaleSwitcher from "@/components/LocaleSwitcher/LocaleSwitcher";

export default function Navigation() {
  const t = useTranslations("Navigation");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [_, setIsScrolled] = useState(false);
  const { hash } = useHash();

  const onScrollHandler = (position: number) => {
    if (position <= 10) {
      setIsScrolled(false);
      return;
    }

    setIsScrolled(true);
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
      className="bg-slate-900/55 transition-spacing duration-500 ease-in-out fixed top-0 left-0 right-0 h-[6rem]"
      onScrollPositionChange={onScrollHandler}
      classNames={{
        item: [
          "flex",
          "relative",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:bottom-[-6px]",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[4px]",
          `data-[active=true]:after:bg-[#FF0F3D]`,
        ],
      }}
    >
      <NavbarContent className="hidden md:flex text-white gap-8" justify="end">
        <NavbarItem isActive={hash?.length === 0 || hash?.startsWith("#home")}>
          <Link
            href="/#home"
            className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]"
          >
            {t("home")}
          </Link>
        </NavbarItem>
        <NavbarItem isActive={hash?.startsWith("#about")}>
          <Link
            href="#about"
            className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]"
          >
            {t("about")}
          </Link>
        </NavbarItem>

        <NavbarItem isActive={hash?.startsWith("#artists")}>
          <Link
            href="/#artists"
            className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]"
          >
            {t("artists.navItem")}
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarBrand>
          <Link color="foreground" href="/#home" className="px-4">
            <Image
              className="max-w-[4rem]"
              priority
              src={Logo}
              alt="The Inked Clown"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden md:flex text-white gap-8"
        justify="start"
      >
        <NavbarItem>
          <Link
            color="foreground"
            href="/#gallery"
            className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]"
          >
            {t("gallery")}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="/#footer"
            className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]"
          >
            {t("contact")}
          </Link>
        </NavbarItem>

        <LocaleSwitcher />
      </NavbarContent>

      <NavbarContent justify="end" className="md:hidden">
        <LocaleSwitcher />

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-white"
        />
      </NavbarContent>
    </Navbar>
  );
}
