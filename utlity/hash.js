//file include
import bcrypt from "bcryptjs";

export const hash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);
    return hash;
}