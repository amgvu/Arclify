import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CirclePlus, Loader2 } from "lucide-react";
import { toolsItems } from "@/lib/data/tools-items";
import { Member, Arc, ArcNickname, Server, Category } from "@/types/types";
import GroupsPanel from "./groups/GroupsPanel";
import Image from "next/image";
import AIPanel from "./ai/AIPanel";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenubarProps {
  selectedServer: Server | null;
  servers: Server[];
  handleServerSelection: (server: Server) => void;
  selectedArc: Arc | null;
  setSelectedArc: (arc: Arc | null) => void;
  newArcName: string;
  setNewArcName: (name: string) => void;
  members: Member[];
  category: string;
  categoryItems: Category[];
  setCategory: (category: string | ((current: string) => string)) => void;
  theme: string;
  setTheme: (theme: string) => void;
  loading: boolean;
  handleGenerate: () => void;
  randomCategory: () => void;
  selectedUserIds?: string[];
  handleCreateGroup: (
    groupName: string,
    selectedMembers: Member[]
  ) => Promise<void>;
  arcs: Arc[];
  arcNicknamesMap: Record<number, ArcNickname[]>;
  removingArcIds: number[];
  arcMemberCounts: Record<number, number>;
  isLoading: boolean;
  handleCreateClick: () => Promise<void>;
  handleDeleteArc: (arcId: number) => Promise<void>;
}

export default function Menubar({
  selectedServer,
  servers,
  handleServerSelection,
  selectedArc,
  setSelectedArc,
  newArcName,
  setNewArcName,
  members,
  category,
  categoryItems,
  setCategory,
  theme,
  setTheme,
  loading,
  handleGenerate,
  randomCategory,
  selectedUserIds = [],
  handleCreateGroup,
  arcs,
  arcNicknamesMap,
  removingArcIds,
  arcMemberCounts,
  isLoading,
  handleCreateClick,
  handleDeleteArc,
}: MenubarProps) {
  const [activeTool, setActiveTool] = useState<string>("Groups");

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
  };

  const renderToolPanel = () => {
    switch (activeTool) {
      case "Groups":
        return (
          <GroupsPanel
            selectedServer={selectedServer}
            selectedArc={selectedArc}
            newArcName={newArcName}
            arcs={arcs}
            arcNicknamesMap={arcNicknamesMap}
            removingArcIds={removingArcIds}
            arcMemberCounts={arcMemberCounts}
            isLoading={isLoading}
            setNewArcName={setNewArcName}
            setSelectedArc={setSelectedArc}
            members={members}
            handleCreateClick={handleCreateClick}
            handleDeleteArc={handleDeleteArc}
            handleCreateGroup={(groupName: string, selectedMembers: Member[]) =>
              handleCreateGroup(groupName, selectedMembers)
            }
          />
        );
      case "Themes":
        return (
          <AIPanel
            selectedServer={selectedServer}
            members={members}
            selectedUserIds={selectedUserIds}
            category={category}
            setCategory={setCategory}
            theme={theme}
            setTheme={setTheme}
            loading={loading}
            handleGenerate={handleGenerate}
            randomCategory={randomCategory}
            categoryItems={categoryItems}
          />
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="flex">
      {activeTool && (
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed mt-6 z-4"
        >
          {renderToolPanel()}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <Sidebar className="bg-sidebar mt-6 border-border w-[82px]">
          <SidebarHeader
            className={`
              bg-sidebar z-50 border-border
              flex items-center justify-center px-2.5
            `}
          >
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2 border-b border-border pb-3 flex flex-col items-center">
                  {toolsItems.map((tool) => {
                    const IconComponent = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <Tooltip key={tool.id}>
                        <TooltipContent>
                          <p className="font-ggSans font-bold">{tool.id}</p>
                        </TooltipContent>
                        <TooltipTrigger asChild>
                          <SidebarMenuItem key={tool.id}>
                            <SidebarMenuButton
                              onClick={() => handleToolClick(tool.id)}
                              className={`text-sm z-8 sm:text-sm md:text-base lg:text-[15px] xl:text-[16px] 2xl:text-[17px] w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                                isActive
                                  ? "bg-button-hover text-text-primary"
                                  : "text-text-secondary hover:bg-transparent-button-hover-context-bar"
                              }`}
                            >
                              <IconComponent
                                size={20}
                                className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6"
                              />
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </TooltipTrigger>
                      </Tooltip>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarHeader>

          <SidebarContent className="overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2 flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    {servers.length === 0 ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center h-12 w-12"
                      >
                        <Loader2 className="animate-spin w-5 h-5 text-text-secondary" />
                      </motion.div>
                    ) : (
                      <>
                        {servers.map((server) => (
                          <motion.div
                            key={server.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 0.2,
                            }}
                            layout
                          >
                            <Tooltip>
                              <TooltipContent>
                                <p className="font-ggSans font-bold">
                                  {server.name}
                                </p>
                              </TooltipContent>
                              <TooltipTrigger asChild>
                                <SidebarMenuItem>
                                  <SidebarMenuButton
                                    onClick={() =>
                                      handleServerSelection(server)
                                    }
                                    className={`w-14 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
                                      selectedServer?.id === server.id
                                        ? "bg-button-hover rounded-2xl"
                                        : "hover:bg-transparent-button-hover-context-bar hover:rounded-2xl"
                                    }`}
                                  >
                                    <Image
                                      src={server.iconURL}
                                      alt={server.name}
                                      width={40}
                                      height={40}
                                      className="w-10 h-10 rounded-lg"
                                    />
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </TooltipTrigger>
                            </Tooltip>
                          </motion.div>
                        ))}

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.2,
                          }}
                          layout
                        >
                          <Tooltip>
                            <TooltipContent>
                              <p className="font-ggSans font-bold">
                                Add a server
                              </p>
                            </TooltipContent>
                            <TooltipTrigger asChild>
                              <SidebarMenuItem>
                                <SidebarMenuButton
                                  onClick={() =>
                                    window.open(
                                      "https://app.youform.com/forms/uwk5hpox"
                                    )
                                  }
                                  className="w-12 h-12 flex items-center justify-center rounded-lg text-text-secondary hover:bg-transparent-button-hover-context-bar hover:rounded-2xl transition-all duration-200"
                                >
                                  <CirclePlus size={32} />
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </TooltipTrigger>
                          </Tooltip>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-3 border-border"></SidebarFooter>
        </Sidebar>
      </motion.div>
    </div>
  );
}
