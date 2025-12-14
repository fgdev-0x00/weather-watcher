import { checkRequiredFields } from '#utils/validations';
import { registerService, loginService } from '#services/auth.service';

const requiredFields = ['username', 'password'];

const parsePayload = (userPayload) => {
  const parsed = {
    username: userPayload.username.trim(),
    password: userPayload.password.trim(),
  };

  return parsed;
};

const register = async (req, res) => {
  try {
    const userPayload = req.body;
    if(!checkRequiredFields(userPayload, requiredFields)) {
      res.status(400).json({ success: false, message: 'Requirted Field Missing' });
    }

    const parsedPayload = parsePayload(userPayload);
    const user = await registerService(parsedPayload);

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.log('error: ', err);
    res.status(400).json({ success: false, message: err.message });
  }
}

const login = async (req, res) => {
  try {
    const userPayload = req.body;
    if(!checkRequiredFields(userPayload, requiredFields)) {
      res.status(400).json({ success: false, message: 'Requirted Field Missing' });
    }

    const parsedPayload = parsePayload(userPayload);
    const result = await loginService(parsedPayload);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}

export { register, login };
