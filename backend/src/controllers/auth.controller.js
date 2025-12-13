import { registerService, loginService } from '../services/auth.service.js';

const requiredFields = ['username', 'password'];
const checkFields = (userPayload) => requiredFields.every(field => field in userPayload && userPayload[field]);

export async function register(req, res) {
  try {
    const userPayload = req.body;
    if(!checkFields(userPayload)) {
      res.status(400).json({ success: false, message: 'Requirted Field Missing' });
    }
    const user = await registerService(userPayload);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function login(req, res) {
  try {
    const userPayload = req.body;
    if(!checkFields(userPayload)) {
      res.status(400).json({ success: false, message: 'Requirted Field Missing' });
    }
    const result = await loginService(userPayload);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}