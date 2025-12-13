import { getUserService } from '../services/user.service.js';

async function getUserController(req, res) {
  try {
    const data = await getUserService(req.user.userId);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
}

export { getUserController };