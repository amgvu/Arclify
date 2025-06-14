import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Settings,
  Binoculars,
  Users,
  LogOut,
  HelpCircle,
  UserRoundPen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import DSMenu from "@/components/ui/Menu/Menu";
import { Server } from "@/types/types";

import { useState } from "react";

interface NavigationSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  servers: Server[];
  selectedServer: Server | null;
  handleServerSelection: (server: Server) => void;
}

const userItems = [
  {
    title: "Nicknames",
    icon: UserRoundPen,
    value: "nicknames",
  },
  {
    title: "Roles",
    icon: Users,
    value: "roles",
    disabled: true,
  },
];

const serverItems = [
  {
    title: "Monitoring",
    icon: Binoculars,
    value: "monitoring",
    disabled: true,
  },
];

const settingsItems = [
  {
    title: "Settings",
    icon: Settings,
    value: "settings",
    disabled: true,
  },
  {
    title: "Help",
    icon: HelpCircle,
    value: "help",
    disabled: true,
  },
];

export function NavigationSidebar({
  activeSection = "server",
  onSectionChange,
  servers,
  selectedServer,
  handleServerSelection,
}: NavigationSidebarProps) {
  const { data: session } = useSession();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleDiscordLogout = () => {
    signOut({ callbackUrl: "/", redirect: true });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Sidebar
      className={`
         bg-[#09090b] border-border
        transition-all duration-300 mt-6 shadow-xl ease-in-out
        ${isMinimized ? "w-[70px]" : ""}
      `}
    >
      <SidebarHeader
        className={`
    py-3 bg-sidebar border-b border- border-border
    flex items-center ${isMinimized ? "justify-center" : "justify-between"} px-4
  `}
      >
        <div className="flex items-center gap-3 flex-1">
          <button
            className="cursor-pointer flex items-center"
            onClick={toggleMinimize}
          >
            <Image
              src={selectedServer ? selectedServer.iconURL : "/Arclify.svg"}
              width="36"
              height="36"
              alt="logo"
              className="inline-block w-9 h-9 rounded-lg ring-zinc-800"
            />
          </button>
          {!isMinimized && (
            <h1 className="text-zinc-200 font-medium text-sm truncate max-w-[120px]">
              {selectedServer ? selectedServer.name : "Select a server"}
            </h1>
          )}
        </div>

        {!isMinimized && (
          <div className="flex-shrink-0">
            <DSMenu items={servers} setSelectedItem={handleServerSelection} />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="flex flex-col">
        <SidebarGroup>
          {!isMinimized && (
            <SidebarGroupLabel className="text-zinc-400 text-xs font-medium mb-0.5 tracking-wide">
              Users
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() =>
                      !item.disabled && onSectionChange?.(item.value)
                    }
                    isActive={activeSection === item.value}
                    className={`
                      text-base font-medium transition-colors duration-200
                      ${isMinimized ? "justify-center" : ""}
                      ${
                        activeSection === item.value
                          ? "text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800"
                          : item.disabled
                          ? "text-zinc-600 cursor-not-allowed"
                          : "text-zinc-200 hover:text-zinc-100 hover:bg-zinc-900/50"
                      }
                    `}
                  >
                    <item.icon className="text-zinc-500" />
                    {!isMinimized && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!isMinimized && (
            <SidebarGroupLabel className="text-zinc-400 text-xs font-medium mb-0.5 tracking-wide">
              Server
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {serverItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() =>
                      !item.disabled && onSectionChange?.(item.value)
                    }
                    isActive={activeSection === item.value}
                    className={`
                      text-base font-medium transition-colors duration-200
                      ${isMinimized ? "justify-center" : ""}
                      ${
                        activeSection === item.value
                          ? "text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800"
                          : item.disabled
                          ? "text-zinc-600 cursor-not-allowed"
                          : "text-zinc-200 hover:text-zinc-100 hover:bg-zinc-900/50"
                      }
                    `}
                  >
                    <item.icon className="text-zinc-500" />
                    {!isMinimized && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto">
          <SidebarGroup>
            {!isMinimized && (
              <SidebarGroupLabel className="text-zinc-400 text-xs font-medium mb-0.5 tracking-wide">
                More
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      onClick={() =>
                        !item.disabled && onSectionChange?.(item.value)
                      }
                      isActive={activeSection === item.value}
                      className={`
                      text-base font-medium transition-colors duration-200
                      ${isMinimized ? "justify-center" : ""}
                      ${
                        activeSection === item.value
                          ? "text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800"
                          : item.disabled
                          ? "text-zinc-600 cursor-not-allowed"
                          : "text-zinc-200 hover:text-zinc-100 hover:bg-zinc-900/50"
                      }
                    `}
                    >
                      <item.icon className="text-zinc-500" />
                      {!isMinimized && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      {session?.user && (
        <SidebarFooter className="border-t mb-6 border-border p-0">
          <div className="py-3 px-4 bg-sidebar">
            {!isMinimized && (
              <p className="text-zinc-400 text-xs font-medium mb-3 tracking-wider">
                Signed in as:
              </p>
            )}
            <div
              className={`flex items-center gap-3 ${
                isMinimized ? "justify-center" : ""
              }`}
            >
              <Image
                src={session.user.image || "/default-avatar.png"}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full ring-2 ring-zinc-800"
              />
              {!isMinimized ? (
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-200 font-medium text-sm truncate">
                    {session.user.name}
                  </p>
                </div>
              ) : (
                <></>
              )}

              {!isMinimized && (
                <button
                  onClick={handleDiscordLogout}
                  className="flex text-zinc-400 hover:text-white cursor-pointer hover:bg-zinc-900 rounded-md p-2 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
