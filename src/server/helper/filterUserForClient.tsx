import type { User } from "@clerk/nextjs/dist/types/server";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    name: user.username,
    profilePicture: user.profileImageUrl,
  };
};

export default filterUserForClient;
