import { getUser } from "#utils/users";

const getUserService = async(userId) => {
  const user = getUser(userId);
  if (!user) return null;

  return {  
    username: user.username
  };
}

export { getUserService };
