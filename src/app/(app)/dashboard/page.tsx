"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  useServerSelection,
  useMembers,
  useMemberManagement,
  useThemeGenerator,
  useArcManagement,
  useAuth,
} from "@/lib/hooks";
import { DashboardLayout, ServerContent, Sidebar } from "@/components";
import { LoaderCircle } from "lucide-react";

export default function Dashboard() {
  const { session, status } = useAuth();
  const {
    servers,
    serversError,
    selectedServer,
    selectedServerName,
    handleServerSelection,
  } = useServerSelection();

  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const { members: fetchedMembers, error: membersError } =
    useMembers(selectedServer);

  const {
    members,
    isUpdating,
    isApplyingAll,
    handleNicknameChange,
    handleUpdateNickname,
    applyAllNicknames,
    setMembers,
  } = useMemberManagement(selectedServer, fetchedMembers);

  const {
    category,
    setCategory,
    theme,
    setTheme,
    loading,
    handleGenerateCharacters,
  } = useThemeGenerator(members, setMembers);

  const {
    selectedArc,
    setSelectedArc,
    isSavingArc,
    handleSaveArc,
    handleCreateNewArc,
  } = useArcManagement(selectedServer, members, setMembers);

  const categories = [
    "Fictional Characters",
    "Real People",
    "Objects",
    "Places",
    "Abstract Concepts",
  ];

  useEffect(() => {
    if (status !== "loading") {
      setShowLoading(false);
      setIsLoaded(true);
    }
  }, [status]);

  if (showLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: 0.1 }}
        >
          <LoaderCircle className="text-zinc-300 animate-spin h-24 w-24" />
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return <div>Redirecting to sign-in...</div>;
  }

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          servers={servers}
          selectedServer={selectedServer}
          selectedServerName={selectedServerName}
          handleServerSelection={handleServerSelection}
          selectedArc={selectedArc}
          setSelectedArc={setSelectedArc}
          handleCreateNewArc={handleCreateNewArc}
          applyAllNicknames={applyAllNicknames}
          isApplyingAll={isApplyingAll}
          isSavingArc={isSavingArc}
          handleSaveArc={handleSaveArc}
          members={members}
          category={category}
          setCategory={setCategory}
          theme={theme}
          setTheme={setTheme}
          loading={loading}
          handleGenerateCharacters={handleGenerateCharacters}
          categories={categories}
        />
      }
    >
      <div
        className={`w-auto transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="text-center font-bold"></div>
        </div>
        <ServerContent
          selectedServer={selectedServer}
          serversError={serversError}
          membersError={membersError}
          members={members}
          isUpdating={isUpdating}
          isApplyingAll={isApplyingAll}
          onNicknameChange={handleNicknameChange}
          onApplyNickname={(userId: string, nickname: string) =>
            handleUpdateNickname(userId, nickname, true)
          }
        />
      </div>
    </DashboardLayout>
  );
}
