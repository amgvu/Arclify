"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Member } from "@/types/types";
import {
  useServers,
  useMembers,
  useMemberManagement,
  useThemeGenerator,
  useArcManagement,
  useAuth,
} from "@/lib/hooks";
import {
  AppLayout,
  ServerContent,
  AuthCard,
  Sidebar,
  Topbar,
} from "@/components";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const { session, status } = useAuth();
  const { servers, serversError, selectedServer, handleServerSelection } =
    useServers();

  const { members: fetchedMembers, error: membersError } = useMembers(
    selectedServer?.id ?? ""
  );

  const {
    members,
    isUpdating,
    handleUpdateNicknameLocally,
    handleUpdateNickname,
    setMembers,
    handleUpdateSelectedNicknames,
  } = useMemberManagement(selectedServer, fetchedMembers);

  const {
    category,
    categoryItems,
    setCategory,
    theme,
    setTheme,
    loading,
    handleGenerate,
    randomCategory,
  } = useThemeGenerator(members, setMembers, selectedUserIds);

  const {
    selectedArc,
    setSelectedArc,
    handleCreateGroup,
    arcs,
    newArcName,
    setNewArcName,
    arcNicknamesMap,
    removingArcIds,
    arcMemberCounts,
    isLoading: arcLoading,
    handleCreateClick,
    handleDeleteArc,
  } = useArcManagement(selectedServer, members, setMembers);

  useEffect(() => {
    setShowCheckboxes(false);
  }, [selectedServer]);

  useEffect(() => {
    if (status !== "loading") {
      setShowLoading(false);
      setIsLoaded(true);
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("discord");
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
    <AppLayout
      sidebar={
        <Sidebar
          selectedServer={selectedServer}
          servers={servers}
          handleServerSelection={handleServerSelection}
          selectedArc={selectedArc}
          setSelectedArc={setSelectedArc}
          members={members}
          category={category}
          categoryItems={categoryItems}
          setCategory={setCategory}
          theme={theme}
          setTheme={setTheme}
          handleGenerate={handleGenerate}
          randomCategory={randomCategory}
          loading={loading}
          selectedUserIds={selectedUserIds}
          handleCreateGroup={(groupName: string, selectedMembers: Member[]) =>
            handleCreateGroup(groupName, selectedMembers)
          }
          arcs={arcs}
          newArcName={newArcName}
          setNewArcName={setNewArcName}
          arcNicknamesMap={arcNicknamesMap}
          removingArcIds={removingArcIds}
          arcMemberCounts={arcMemberCounts}
          isLoading={arcLoading}
          handleCreateClick={handleCreateClick}
          handleDeleteArc={handleDeleteArc}
        />
      }
      topbar={<Topbar selectedServer={selectedServer} />}
      authcard={<AuthCard />}
      servercontent={
        <ServerContent
          selectedServer={selectedServer}
          serversError={serversError}
          membersError={membersError}
          members={members}
          isUpdating={isUpdating}
          onUpdateNicknameLocally={handleUpdateNicknameLocally}
          onApplyNickname={(
            userId: string,
            nickname: string,
            globalName: string
          ) => handleUpdateNickname(userId, nickname, globalName, true)}
          onUpdateSelectedNicknames={handleUpdateSelectedNicknames}
          onSelectionChange={setSelectedUserIds}
          showCheckboxes={showCheckboxes}
          setShowCheckboxes={setShowCheckboxes}
          selectedUserIds={selectedUserIds}
          isLoaded={isLoaded}
        />
      }
    ></AppLayout>
  );
}
