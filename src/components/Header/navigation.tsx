"use client";

import { useEffect, useState } from "react";
import usePersistStore from "@/hooks/usePersistStore";
import {
  ArtistType,
  HomePageStore,
  Session,
  useHomePageStore,
} from "@/lib/features";
import { useTranslations } from "next-intl";
import { useHash } from "@/useHash";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import TheInkedLogo from "../theInkedLogo";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import styles from "../pages/dashboard.module.css";

type Props = {
  session: Session;
};

export default function Navigation({ session }: Props) {
  const store = usePersistStore(
    useHomePageStore,
    (state: HomePageStore) => state
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Navigation");
  const { hash } = useHash();

  const artists = store?.artists.data || [];

  useEffect(() => {
    const onScroll = (e: any): void => {
      setIsScrolled(e.target.documentElement.scrollTop);
      setIsScrolled(e.target.documentElement.scrollTop > isScrolled);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [isScrolled]);

  const artistKind = (artist: ArtistType): string => {
    let kind = "";

    switch (artist.gender) {
      case "female":
        if (artist.kind === "tattoo") {
          kind = `${t("artists.tattoo")}in`;
          break;
        }

        if (artist.kind === "nails") {
          kind = `${t("artists.nails")}in`;
          break;
        }
        break;
      default:
        if (artist.kind === "tattoo") {
          kind = `${t("artists.tattoo")}`;
          break;
        }

        if (artist.kind === "nails") {
          kind = `${t("artists.nails")}`;
          break;
        }
    }

    return kind;
  };

  const singInOut = (): void => {
    if (!session) {
      signIn();
    } else {
      signOut();
    }
  };

  if (!session) {
    return (
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className={`${
          !isScrolled ? "h-[6rem]" : "h-[8rem]"
        } bg-neutral-900/55 transition-spacing duration-500 ease-in-out fixed top-0 left-0 right-0`}
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
            "data-[active=false]:hover:after:content-['']",
            "data-[active=false]:hover:after:absolute",
            "data-[active=false]:hover:after:content-['']",
            "data-[active=false]:hover:after:bottom-[-6px]",
            "data-[active=false]:hover:after:left-0",
            "data-[active=false]:hover:after:right-0",
            "data-[active=false]:hover:after:h-[4px]",
            `data-[active=false]:hover:after:bg-[#FF0F3D]`,
          ],
        }}
      >
        <NavbarContent
          className="hidden sm:flex gap-x-6 text-white"
          justify="end"
        >
          <NavbarItem isActive={hash?.length === 0 || hash?.startsWith("/")}>
            <Link
              href="/"
              aria-current={hash?.length === 0 || hash?.startsWith("/")}
            >
              {t("home")}
            </Link>
          </NavbarItem>
          <NavbarItem isActive={hash?.startsWith("#about")}>
            <Link
              color="foreground"
              href="#about"
              className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]"
            >
              {t("about")}
            </Link>
          </NavbarItem>

          {artists && (
            <Dropdown className="bg-black">
              <NavbarItem className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]">
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 text-base bg-transparent data-[hover=true]:bg-transparent text-white"
                    radius="sm"
                    variant="light"
                  >
                    {t("artists.navItem")}
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="The Inked Clown Künstleren"
                className="w-[340px]"
                itemClasses={{
                  base: "gap-4 bg-black text-white hover:bg-[#FF0F3D]/75",
                }}
              >
                {artists.map((artist) => {
                  return (
                    <DropdownItem
                      key={artist._id}
                      textValue={artist.name}
                      description={artistKind(artist)}
                      className="hover:bg-[#FF0F3D]/75"
                      // startContent={icons.scale}
                    >
                      <Link href={`/artist/${artist.slug}`}>{artist.name}</Link>
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarContent>

        <NavbarBrand className="sm:justify-center grow-0 basis-[150px]">
          <Link href="/">
            <TheInkedLogo />
          </Link>
        </NavbarBrand>

        <NavbarContent
          justify="start"
          className="hidden sm:flex text-white gap-x-6"
        >
          <NavbarItem isActive={hash?.startsWith("#gallery")}>
            <Link
              color="foreground"
              href="#gallery"
              className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]"
            >
              {t("gallery")}
            </Link>
          </NavbarItem>
          <NavbarItem isActive={hash?.startsWith("#testimonials")}>
            <Link
              color="foreground"
              href="#contact"
              className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]"
            >
              {t("testimonials")}
            </Link>
          </NavbarItem>
          <NavbarItem isActive={hash?.startsWith("#contact")}>
            <Link
              color="foreground"
              href="#contact"
              className="hover:underline underline-offset-8 decoration-4 decoration-[#FF0F3D]"
            >
              {t("contact")}
            </Link>
          </NavbarItem>
          {/* <NavbarItem>
            <LocaleSwitcher />
          </NavbarItem> */}
        </NavbarContent>

        <NavbarContent justify="end" className="sm:hidden">
          <NavbarItem className="flex gap-x-8">
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden text-white"
            />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    );
  } else {
    return (
      <Navbar className={`${styles.bgGradient} h-32 [&_header]:max-w-full`}>
        <NavbarBrand>
          <TheInkedLogo />
        </NavbarBrand>

        <NavbarContent as="div" justify="end">
          <Button
            onClick={singInOut}
            size="sm"
            variant="light"
            className="text-xs font-light text-white data-[hover=true]:bg-[#ff0f3d] p-0"
          >
            Abmelden
          </Button>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="danger"
            name={session.name}
            size="sm"
            src={session.avatar}
          />
        </NavbarContent>
      </Navbar>
    );
  }
}
