import { getUser } from "#utils/users";

const getUserService = async(userId) => {
  const user = getUser(userId);
  if (!user) throw new Error('User not found');

  return {  
    username: user.username
  };
}

export { getUserService };
