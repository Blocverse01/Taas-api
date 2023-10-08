import * as bcrypt from "bcrypt";
import * as fs from "fs";
import readline from "readline";

const BCRYPT_SALT_ROUNDS = 10;
const ENV_FILE_PATH = ".env";
const ENV_VARIABLE_NAME = "API_KEY_SALT=";
const READ_FILE_ENCODING = "utf-8";

async function generateSalt() {
  try {
    let envContent = "";

    if (!fs.existsSync(ENV_FILE_PATH)) {
      writeSalt(`${ENV_VARIABLE_NAME}=`);
      return;
    }

    // Check if the .env file already exists
    envContent = fs.readFileSync(ENV_FILE_PATH, READ_FILE_ENCODING);

    // Check if API_KEY_SALT is defined and set
    const match = RegExp(/API_KEY_SALT=(.+)/).exec(envContent);

    if (!match) {
      writeSalt(`${envContent}\n${ENV_VARIABLE_NAME}=`);
      return;
    }

    const existingSalt = match[1].trim();

    if (!existingSalt) {
      // API_KEY_SALT is defined but not set, generate and write salt
      const newSalt = await generateNewSalt();

      envContent = envContent.replace(/API_KEY_SALT=.*/, `${ENV_VARIABLE_NAME}=${newSalt}`);

      writeEnvFile(envContent);
      return;
    }

    getConfirmation(async (isReplacementConfirmed) => {
      if (!isReplacementConfirmed) {
        return;
      }

      envContent = envContent.replace(/API_KEY_SALT=(.+)/, `${ENV_VARIABLE_NAME}=${await generateNewSalt()}`);

      writeEnvFile(envContent);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function writeSalt(text: string) {
  const newSalt = await generateNewSalt();
  writeEnvFile(`${text}${newSalt}`);
}

function getConfirmation(onConfirm: (confirmation: boolean) => Promise<void>) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "Warning: API_KEY_SALT variable is already defined and set in the .env file. Replacing it will make previously created API keys invalid. Continue? (yes/no): ",
    (answer) => {
      rl.close();

      if (answer.toLowerCase() === "yes") {
        onConfirm(true);
      } else {
        onConfirm(false);
      }
    }
  );
}

async function generateNewSalt() {
  // Generate a new salt using bcrypt
  return await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
}

function writeEnvFile(content: string) {
  // Create or update the .env file with the new content
  fs.writeFileSync(ENV_FILE_PATH, content);

  console.log("Salt generated and .env file updated successfully.");
}

generateSalt();
