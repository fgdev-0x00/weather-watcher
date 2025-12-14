import bcrypt from 'bcryptjs';

const saltRounds = 10;

const generateHash = async (plainData) => {
    const hasedData = await bcrypt.hash(plainData, saltRounds)
    return hasedData;
}

const compareHash = async (plainData, hash) => {
    const isValid = await bcrypt.compare(plainData, hash);
    return isValid;
};

export { generateHash, compareHash };