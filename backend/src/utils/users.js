import { users } from '#data/users.memory';

const findUser = (username) => users.find(u => u.username === username);
const getUser = (userId) => users.find(u => u.id === userId);

const saveUser = (userData) => {
    users.push(userData);
};

export { findUser, getUser, saveUser };