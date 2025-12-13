import { users } from '../data/users.memory.js';

console.log('USERS');

async function getUserService(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');

  return {
    username: user.username
  };
}

export { getUserService };
