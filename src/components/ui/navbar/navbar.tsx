"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, X } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const MobileDrawer = ({
  productItems,
  resourceItems,
}: {
  productItems: { name: string; href: string }[];
  resourceItems: { name: string; href: string }[];
}) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger className="p-4">
        <Menu className="text-zinc-100 h-6 w-6" />
      </DrawerTrigger>
      <DrawerContent className="bg-zinc-950/40 font-ginto backdrop-blur-lg">
        <div className="p-2">
          <DrawerHeader>
            <DrawerTitle className="text-zinc-400 text-md ml-[-8px] font-medium mb-[-40px]">
              Product
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex mt-4 flex-col">
            {productItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-2 py-0.5 rounded-md font-medium text-2xl text-zinc-100 hover:text-zinc-400"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div>
            <DrawerHeader>
              <DrawerTitle className="text-zinc-400 text-md ml-[-8px] font-medium mb-[-40px]">
                Resources
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex mt-4 flex-col">
              {resourceItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-2 py-0.5 rounded-md font-medium text-2xl text-zinc-100 hover:text-zinc-400"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose className="px-4 py-2 place-items-center text-zinc-400 hover:text-white cursor-pointer rounded-md">
            <X className="h-12 w-12" />
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default function Navbar({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const handleDiscordLogin = () => {
    signIn("discord", { callbackUrl: "/dashboard" });
  };

  const handleDiscordLogout = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };

  const productItems = [
    ...(session
      ? [
          {
            name: "Dashboard",
            href: "/dashboard",
          },
        ]
      : []),
    { name: "Features", href: "/features" },
    { name: "Changelog", href: "/changelog" },
    { name: "Documentation", href: "/documentation" },
  ];

  const resourceItems = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="w-full bg-sidebar border-b border-border-subtle font-ginto font-medium fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center md:px-32">
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className="hover:bg-sidebar focus:bg-sidebar"
                  >
                    <Link
                      href="/"
                      className="flex flex-row items-center gap-2 px-4 py-4"
                    >
                      <Image
                        src="/Arclify.svg"
                        width="26"
                        height="26"
                        alt="logo"
                        className="inline-block"
                      />
                      <span className="text-xl text-text-primary font-gintoNord whitespace-nowrap">
                        Arclify
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-2">
                {[...productItems, ...resourceItems].map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink
                      asChild
                      className="focus:bg-sidebar focus:text-text-secondary"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-transparent-button-hover-sidebar rounded-md"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  {session ? (
                    <button
                      onClick={handleDiscordLogout}
                      className="flex invisible md:visible text-sm items-center gap-2 px-4 py-1 cursor-pointer bg-button text-text-primary hover:text-text-primary hover:bg-button-hover rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleDiscordLogin}
                      className="flex invisible md:visible text-sm items-center gap-2 px-4 py-1 cursor-pointer text-zinc-100 bg-[#5865F2] hover:bg-[#454FBF] rounded-md transition-colors"
                    >
                      <FaDiscord className="h-4 w-4" />
                      <span>Sign In</span>
                    </button>
                  )}
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="md:hidden">
              <MobileDrawer
                productItems={productItems}
                resourceItems={resourceItems}
              />
            </div>
          </div>
        </div>
      </header>
      <main className="pt-15">{children}</main>
    </>
  );
}
