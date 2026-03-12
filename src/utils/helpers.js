import bcrypt, { hash } from 'bcrypt';

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    console.log(salt)
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const comparePassword = async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed);
}