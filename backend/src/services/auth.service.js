import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { users } from '../data/users.memory.js';

export async function registerService({ username, password }) {
  const exists = users.find(u => u.username === username);
  if (exists) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password.trim(), 10);

  const user = {
    id: uuid(),
    username: username.trim(),
    password: hashedPassword
  };

  users.push(user);

  return { id: user.id, username: user.username };
}

export async function loginService({ username, password }) {
  const user = users.find(u => u.username === username);
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '1h' }
  );

  return { token };
}
