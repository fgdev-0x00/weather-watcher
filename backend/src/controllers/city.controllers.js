import { getPopularCities } from '#services/city.service';

const getCities = async (req, res) => {
  try {

    const popularCities = await getPopularCities();

    res.status(200).json({ success: true, data: popularCities });
  } catch (err) {
    console.log('error: ', err);
    return res.status(400).json({ success: false, message: err.message });
  }
}

export { getCities };
