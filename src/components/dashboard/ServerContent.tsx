import { DSUserList } from "@/components";
import { TitleUpdater } from "./TitleUpdater";
import { Member, Server } from "@/types/types";
import { Toolbar } from "./toolbar/Toolbar";

interface ServerContentProps {
  selectedServer: Server | null;
  serversError: string | null;
  membersError: string | null;
  members: Member[];
  isUpdating: Set<string>;
  isApplyingAll: boolean;
  onNicknameChange: (index: number, nickname: string) => void;
  onApplyNickname: (userId: string, nickname: string) => void;
  onApplyToSelection: (selectedMembers: Member[]) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  showCheckboxes: boolean;
  selectedUserIds: string[];
  setShowCheckboxes: (show: boolean) => void;
}

export default function ServerContent({
  selectedServer,
  serversError,
  membersError,
  members,
  isUpdating,
  isApplyingAll,
  onNicknameChange,
  onApplyNickname,
  onApplyToSelection,
  onSelectionChange,
  showCheckboxes,
  selectedUserIds,
  setShowCheckboxes,
}: ServerContentProps) {
  return (
    <div className="flex flex-col">
      <TitleUpdater />
      <Toolbar
        selectedServer={selectedServer}
        showCheckboxes={showCheckboxes}
        setShowCheckboxes={setShowCheckboxes}
        members={members}
        onApplyToSelection={onApplyToSelection}
        selectedUserIds={selectedUserIds}
      />
      <div className="flex">
        <div className="w-full">
          {serversError || membersError ? (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
              {serversError || membersError}
            </div>
          ) : selectedServer ? (
            <div className="ml-80 my-15 mr-1">
              <DSUserList
                selectedServer={selectedServer}
                members={members}
                isUpdating={isUpdating}
                onNicknameChange={onNicknameChange}
                onApplyNickname={onApplyNickname}
                isApplyingAll={isApplyingAll}
                onSelectionChange={onSelectionChange}
                showCheckboxes={showCheckboxes}
                setShowCheckboxes={setShowCheckboxes}
              />
            </div>
          ) : (
            <div className="text-center font-semibold text-4xl text-text-secondary py-20">
              Select a server to view and manage members
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
