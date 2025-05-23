/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { DSInput, DSButton, DSDialog } from "@/components/";
import { styles } from "./UserListCard.styles";
import { Member, Nickname } from "@/types/types";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { ChevronDown, ChevronUp, X, Check, RotateCcw } from "lucide-react";
import { fetchNicknames, deleteNickname } from "@/lib/utilities/api";

interface UserListCardProps {
  member: Member;
  isUpdating: boolean;
  selectedServer: string;
  onNicknameChange: (nickname: string) => void;
  onApplyNickname: () => void;
}

export const UserListCard: React.FC<UserListCardProps> = ({
  member,
  isUpdating,
  selectedServer,
  onNicknameChange,
  onApplyNickname,
}) => {
  const [inputValue, setInputValue] = useState(
    member.nickname || member.globalName || ""
  );
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previousNicknames, setPreviousNicknames] = useState<Nickname[]>([]);
  const [isLoadingNicknames, setIsLoadingNicknames] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [nicknameToDelete, setNicknameToDelete] = useState<Nickname | null>(
    null
  );
  const controls = useAnimation();

  useEffect(() => {
    if (!isInputFocused) {
      setInputValue(member.nickname || member.globalName || "");
    }
  }, [member.nickname, member.globalName, isInputFocused]);

  useEffect(() => {
    const fetchPreviousNicknames = async () => {
      if (isExpanded && selectedServer && member.user_id) {
        setIsLoadingNicknames(true);
        setFetchError(null);
        try {
          const nicknames = await fetchNicknames(
            selectedServer,
            member.user_id
          );
          setPreviousNicknames(nicknames);
        } catch (error) {
          console.error("Failed to fetch nicknames:", error);
          setFetchError(
            "Unable to fetch previous nicknames. Please try again."
          );
        } finally {
          setIsLoadingNicknames(false);
        }
      }
    };

    fetchPreviousNicknames();
  }, [isExpanded, selectedServer, member.user_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onNicknameChange(e.target.value);
  };

  const handleRevert = () => {
    const globalName = member.globalName || "";
    setInputValue(globalName);
    onNicknameChange(globalName);
  };

  const handleDeleteNickname = (nickname: Nickname) => {
    setNicknameToDelete(nickname);
    setIsPromptOpen(true);
  };

  const confirmDeleteNickname = () => {
    if (nicknameToDelete && selectedServer && member.user_id) {
      deleteNickname(selectedServer, member.user_id, nicknameToDelete.nickname)
        .then(() => {
          setPreviousNicknames((prevNicknames) =>
            prevNicknames.filter(
              (nick) => nick.nickname !== nicknameToDelete.nickname
            )
          );
        })
        .catch((error) => {
          console.error("Error deleting nickname:", error);
        })
        .finally(() => {
          setIsPromptOpen(false);
          setNicknameToDelete(null);
        });
    }
  };

  const cancelDeleteNickname = () => {
    setIsPromptOpen(false);
    setNicknameToDelete(null);
  };

  const handleApplyNickname = async () => {
    await controls.start({
      y: [0, 350, 0],
      transition: { duration: 0.1, ease: "easeOut" },
    });
    onApplyNickname();
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={controls}
      className={`${styles.card} relative bg-no-repeat bg-left`}
    >
      <div className="absolute inset-0"></div>
      <div className="flex items-center space-x-4 relative z-10">
        <div className="h-full flex-shrink-0 relative">
          <img
            src={member.avatar_url}
            alt={`${member.username}'s avatar`}
            width={128}
            height={128}
            className={styles.avatar}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
        </div>
        <div className="w-full text-xl flex flex-col justify-center">
          <DSInput
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder={`Nickname for ${member.username}`}
            className={styles.nicknameInput}
            disabled={isUpdating}
          />
          <div className={styles.username}>
            {member.username}
            {member.userTag}
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <DSButton
            onClick={handleApplyNickname}
            disabled={isUpdating || !inputValue}
            className={`${styles.applyButton} ${
              isUpdating ? "motion-preset-pop motion-duration-1000" : ""
            }`}
          >
            <Check className="w-4 h-4 mr-[-2px]" />
            {isUpdating ? "Applying..." : "Apply"}
          </DSButton>
          <DSButton
            onClick={handleRevert}
            disabled={isUpdating}
            className={`${styles.applyButton}`}
          >
            <RotateCcw className="w-4 h-4 mr-[-2px]" />
            Reset
          </DSButton>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 transition-all cursor-pointer rounded-lg"
        >
          <motion.div animate={{ rotate: isExpanded ? 360 : 0 }}>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-neutral-700 hover:text-neutral-100 transition-all duration-200" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-700 hover:text-neutral-100 transition-all duration-200" />
            )}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-1 px-2 border-t border-[#252525]">
              <div className="flex items-center gap-2 mb-2 text-sm text-neutral-500">
                Saved Nicknames
              </div>
              {isLoadingNicknames ? (
                <div className="text-neutral-400 text-xs">
                  Loading nicknames...
                </div>
              ) : fetchError ? (
                <div className="text-red-400">{fetchError}</div>
              ) : (
                <div className="flex flex-wrap mb-1 gap-2">
                  {previousNicknames.map((nickname, index) => (
                    <motion.div
                      key={`${nickname.userId}-${nickname.nickname}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <button
                        onClick={() => {
                          setInputValue(nickname.nickname);
                          onNicknameChange(nickname.nickname);
                        }}
                        className="px-3 py-1 text-sm bg-black border-[#252525] border cursor-pointer transition-all hover:bg-neutral-900 rounded-full"
                      >
                        {nickname.nickname}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNickname(nickname);
                        }}
                        className="absolute bottom-4 -right-1 p-1 cursor-pointer text-sm text-neutral-950 bg-red-400 rounded-full transition hover:bg-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <DSDialog
        isOpen={isPromptOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the nickname "${nicknameToDelete?.nickname}"?`}
        onConfirm={confirmDeleteNickname}
        onCancel={cancelDeleteNickname}
      />
    </motion.div>
  );
};

export default UserListCard;
