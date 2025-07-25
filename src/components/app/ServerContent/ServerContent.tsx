"use client";
import UserList from "./UserList/UserList";
import Toolbar from "./Toolbar/Toolbar";

import { ServerContentProps } from "@/components/app/ServerContent/ServerContent.types";

export default function ServerContent({
  selectedServer,
  serversError,
  membersError,
  fetchedMembers,
  isUpdating,
  onUpdateNicknameLocally,
  onApplyNickname,
  onUpdateSelectedNicknames,
  onSelectedUserIds,
  showCheckboxes,
  selectedUserIds,
  setShowCheckboxes,
  isPageLoaded,
}: ServerContentProps) {
  return (
    <div
      className={`flex-1 transition-opacity duration-500 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-full">
            <Toolbar
              selectedServer={selectedServer}
              showCheckboxes={showCheckboxes}
              setShowCheckboxes={setShowCheckboxes}
              members={fetchedMembers}
              onUpdateSelectedNicknames={onUpdateSelectedNicknames}
              selectedUserIds={selectedUserIds}
            />
            {serversError || membersError ? (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
                {serversError || membersError}
              </div>
            ) : selectedServer ? (
              <div className="ml-34 mt-24 mr-4">
                <UserList
                  selectedServer={selectedServer}
                  fetchedMembers={fetchedMembers}
                  isUpdating={isUpdating}
                  onUpdateNicknameLocally={onUpdateNicknameLocally}
                  onApplyNickname={onApplyNickname}
                  onSelectedUserIds={onSelectedUserIds}
                  showCheckboxes={showCheckboxes}
                />
              </div>
            ) : (
              <div className="text-center font-semibold text-4xl text-zinc-700 py-29">
                Select a server to view and manage members
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
