import { getPopularCities } from '#services/city.service';
import { checkRequiredFields } from '#utils/validations';

const requiredFields = ['name'];

const getCities = async (req, res) => {
  try {

    const popularCities = await getPopularCities();

    res.status(201).json({ success: true, data: popularCities });
  } catch (err) {
    console.log('error: ', err);
    res.status(400).json({ success: false, message: err.message });
  }
}

export { getCities };
