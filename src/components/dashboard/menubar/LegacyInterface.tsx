import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCheck,
  TextSelect,
  SaveAll,
  WandSparkles,
  ChevronsUpDown,
  Loader2,
  NotebookText,
} from "lucide-react";
import { DSButton, DSCreateMenu } from "@/components";
import { Member, Arc, Server } from "@/types/types";

interface NicknamesPanelProps {
  selectedServer: Server | null;
  selectedArc: Arc | null;
  setSelectedArc: (arc: Arc | null) => void;
  handleCreateNewArc: (newArcName: string) => void;
  isApplyingAll: boolean;
  isSavingArc: boolean;
  handleSaveArc: () => void;
  members: Member[];
  onApplyToSelection: (selectedMembers: Member[]) => void;
  selectedUserIds: string[];
  showCheckboxes: boolean;
  setShowCheckboxes: (show: boolean) => void;
  category: string;
  setCategory: (category: string | ((current: string) => string)) => void;
  theme: string;
  setTheme: (theme: string) => void;
  loading: boolean;
  handleGenerateCharacters: (selectedMembers: Member[]) => void;
  categories: string[];
}

export function NicknamesPanel({
  selectedServer,
  selectedArc,
  setSelectedArc,
  handleCreateNewArc,
  isApplyingAll,
  isSavingArc,
  handleSaveArc,
  members,
  onApplyToSelection,
  selectedUserIds = [],
  showCheckboxes,
  setShowCheckboxes,
  category,
  setCategory,
  theme,
  setTheme,
  loading,
  handleGenerateCharacters,
  categories,
}: NicknamesPanelProps) {
  const handleApply = () => {
    if (!selectedUserIds || selectedUserIds.length === 0) return;
    const selectedMembers = members.filter((member) =>
      selectedUserIds.includes(member.user_id)
    );
    onApplyToSelection(selectedMembers);
  };

  const handleGenerate = () => {
    if (!selectedUserIds || selectedUserIds.length === 0) return;
    const selectedMembers = members.filter((member) =>
      selectedUserIds.includes(member.user_id)
    );
    handleGenerateCharacters(selectedMembers);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <NotebookText className="w-4.5 text-text-primary h-4.5" />
        <span className="text-text-primary">Nickname Sets</span>
      </div>

      <DSCreateMenu
        selectedServer={selectedServer}
        selectedArc={selectedArc}
        setSelectedArc={setSelectedArc}
        onCreateNewArc={handleCreateNewArc}
      />

      <div>
        <ul className="space-y-2">
          <div className="flex gap-2">
            <AnimatePresence mode="wait">
              {isApplyingAll ? (
                <motion.div
                  key="apply-loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center w-full"
                >
                  <Loader2 className="animate-spin w-4 h-4 text-text-primary" />
                  <p className="ml-2 text-sm text-text-primary">Applying...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="apply-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <DSButton
                    onClick={handleApply}
                    className="w-full bg-button disabled:bg-disabled-button disabled:text-text-disabled border border-border-subtle text-text-primary font-bold hover:bg-button-hover"
                    disabled={
                      isApplyingAll ||
                      !selectedServer ||
                      members.length === 0 ||
                      selectedUserIds.length === 0
                    }
                  >
                    <CheckCheck className="w-4 h-4 mr-[-2px]" />
                    {selectedUserIds.length > 0
                      ? `Apply ${selectedUserIds.length}`
                      : "Apply"}
                  </DSButton>
                </motion.div>
              )}
            </AnimatePresence>

            <DSButton
              onClick={() => setShowCheckboxes(!showCheckboxes)}
              className="w-full bg-button font-bold disabled:bg-disabled-button disabled:text-text-disabled border border-border-subtle text-text-primary hover:bg-button-hover"
              disabled={!selectedServer}
            >
              <TextSelect className="w-4 h-4 mr-[-2px]" />
              {showCheckboxes ? "Unselect" : "Select"}
            </DSButton>
          </div>

          <AnimatePresence mode="wait">
            {isSavingArc ? (
              <motion.div
                key="save-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Loader2 className="animate-spin w-4 h-4 text-text-primary" />
                <p className="ml-2 text-sm text-text-primary">Saving Set...</p>
              </motion.div>
            ) : (
              <motion.div
                key="save-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DSButton
                  onClick={handleSaveArc}
                  className="w-full bg-button font-bold disabled:bg-disabled-button disabled:text-text-disabled border border-border-subtle text-text-primary hover:bg-button-hover"
                  disabled={
                    isSavingArc ||
                    !selectedServer ||
                    !selectedArc ||
                    members.length === 0
                  }
                >
                  <SaveAll className="w-4 h-4 mr-[-2px]" />
                  Save Set
                </DSButton>
              </motion.div>
            )}
          </AnimatePresence>
        </ul>
      </div>

      <div className="border-t border-border">
        <div className="pt-1">
          <button
            className="flex items-center gap-1 py-1 text-text-primary transition-all text-sm cursor-pointer relative"
            onClick={() =>
              setCategory((current) => {
                const currentIndex = categories.indexOf(current);
                const nextIndex = (currentIndex + 1) % categories.length;
                return categories[nextIndex];
              })
            }
          >
            <ChevronsUpDown className="w-3 h-3 opacity-70 flex-shrink-0" />
            <AnimatePresence mode="wait">
              <motion.span
                key={category}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                className="hover:text-zinc-400 font-medium inline-block"
              >
                {category}
              </motion.span>
            </AnimatePresence>
          </button>
          <input
            className="bg-input py-1 border text-md text-text-primary rounded-md border-border-subtle cursor-pointer pl-2 focus:cursor-auto max-w-full shadow-white/10 focus:outline-hidden focus:ring-1 focus:ring-border-active transition duration-200 ease-in-out w-full"
            placeholder="Enter a movie, game, thing, etc"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
          <div className="flex justify-end space-x-4 mt-3">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <Loader2 className="animate-spin w-8 h-8 text-text-primary" />
                </motion.div>
              ) : (
                <motion.div
                  key="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className=""
                >
                  <DSButton
                    onClick={handleGenerate}
                    className={`transition-all bg-button ${
                      !loading && "disabled:bg-disabled-button"
                    } bg-button disabled:text-text-disabled border border-border-subtle text-text-primary font-bold hover:bg-button-hover`}
                    disabled={
                      loading ||
                      !selectedServer ||
                      members.length === 0 ||
                      selectedUserIds.length === 0
                    }
                  >
                    <WandSparkles className="w-4 h-4 mr-[-2px]" />
                    {selectedUserIds.length > 0
                      ? `Generate ${selectedUserIds.length}`
                      : "Generate"}
                  </DSButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
