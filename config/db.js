//file import
import chalk from "chalk";
import mongoose from "mongoose";

const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(chalk.bgGreen.white(`database connect...`));
  } catch (err) {
    console.log(chalk.bgRed.black(err.message));
  }
};

//export default
export default databaseConnection;
