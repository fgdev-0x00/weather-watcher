import { getUserService } from '#services/user.service';

const getUserController = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const data = await getUserService(userId);

    if(data == null) {
      return res.status(401).json({ message: 'No token provided' });
    }

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