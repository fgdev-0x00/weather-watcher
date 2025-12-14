import { v4 as uuid } from 'uuid';
import { findUser, saveUser } from '#utils/users';
import { generateHash, compareHash } from '#utils/crypto';
import { generateToken } from '#utils/auth';


const registerService = async ({ username, password }) => {
  //Mock User DB
  const exists = findUser(username);
  if (exists) throw new Error('User already exists');

  const hashedPassword = await generateHash(password);

  const user = {
    id: uuid(),
    username: username,
    password: hashedPassword,
  };

  saveUser(user);

  return { status:'Success'};
}

const loginService = async ({ username, password }) => {
  //Mock User DB
  const user = findUser(username);
  if (!user) throw new Error('Invalid credentials');

  const isValid = await compareHash(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = generateToken(user.id);

  return { token };
}

export { registerService, loginService };