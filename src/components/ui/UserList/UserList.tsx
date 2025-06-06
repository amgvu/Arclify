import { motion } from "framer-motion";
import { UserListCard } from "../UserListCard/UserListCard";
import { styles } from "./UserList.styles";
import { Member } from "@/types/types";
import { useState, useEffect } from "react";

interface UserListProps {
  members: Member[];
  isUpdating: string | null;
  selectedServer: string;
  onNicknameChange: (index: number, nickname: string) => void;
  onApplyNickname: (userId: string, nickname: string) => void;
  isApplyingAll: boolean;
}

const roleGroupVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.3,
    },
  }),
};

const shiftVariants = {
  initial: { y: 0 },
  animate: (index: number) => ({
    y: [0, 10, 0],
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1],
      delay: index * 0.06,
    },
  }),
};

export const DSUserList: React.FC<UserListProps> = ({
  members,
  isUpdating,
  selectedServer,
  onNicknameChange,
  onApplyNickname,
  isApplyingAll,
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isApplyingAll) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isApplyingAll]);

  const groupedMembers = members.reduce(
    (acc: Record<string, Member[]>, member) => {
      const highestRole = member.roles[0]?.name || "No Role";
      if (!acc[highestRole]) {
        acc[highestRole] = [];
      }
      acc[highestRole].push(member);
      return acc;
    },
    {}
  );

  const sortedRoles = Object.keys(groupedMembers).sort((a, b) => {
    const roleAPosition =
      members.find((m) => m.roles[0]?.name === a)?.roles[0]?.position ?? -1;
    const roleBPosition =
      members.find((m) => m.roles[0]?.name === b)?.roles[0]?.position ?? -1;
    return roleBPosition - roleAPosition;
  });

  const memberIndices = members.reduce((acc, member, index) => {
    acc[member.user_id] = index;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        {sortedRoles.map((roleName, roleIndex) => (
          <motion.div
            key={roleName}
            custom={roleIndex}
            initial="hidden"
            animate="visible"
            variants={roleGroupVariants}
          >
            <div className="text-md text-zinc-400 text-sm font-medium border-[#252525] mt-3 mb-1">
              {roleName}
            </div>
            {groupedMembers[roleName].map((member) => (
              <motion.div
                key={`${member.user_id}-${animationKey}`}
                className="mb-1"
                custom={memberIndices[member.user_id]}
                initial="initial"
                variants={shiftVariants}
              >
                <UserListCard
                  member={member}
                  selectedServer={selectedServer}
                  isUpdating={isUpdating === member.user_id}
                  isApplyingAll={isApplyingAll}
                  onNicknameChange={(nickname) => {
                    onNicknameChange(memberIndices[member.user_id], nickname);
                  }}
                  onApplyNickname={() =>
                    onApplyNickname(member.user_id, member.nickname)
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DSUserList;
