import * as bcrypt from "bcrypt";
import * as fs from "fs";
import readline from "readline";

const saltRounds = 10;
const envFilePath = ".env";

async function generateSalt() {
  try {
    let envContent = "";

    // Check if the .env file already exists
    if (fs.existsSync(envFilePath)) {
      // Read the content of the .env file
      envContent = fs.readFileSync(envFilePath, "utf-8");

      // Check if API_KEY_SALT is defined and set
      const match = envContent.match(/API_KEY_SALT=(.+)/);
      if (match) {
        const existingSalt = match[1].trim();
        if (existingSalt) {
          // Ask for confirmation before replacing the salt
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          rl.question(
            "Warning: API_KEY_SALT variable is already defined and set in the .env file. Replacing it will make previously created API keys invalid. Continue? (yes/no): ",
            async (answer) => {
              rl.close();

              if (answer.toLowerCase() !== "yes") {
                console.log("Salt generation aborted.");
                return;
              }

              // Replace the existing API_KEY_SALT with the new one
              envContent = envContent.replace(
                /API_KEY_SALT=(.+)/,
                `API_KEY_SALT=${await generateNewSalt()}`
              );
              writeEnvFile(envContent);
            }
          );
        } else {
          // API_KEY_SALT is defined but not set, generate and write salt
          const newSalt = await generateNewSalt();
          envContent = envContent.replace(/API_KEY_SALT=.*/, `API_KEY_SALT=${newSalt}`);
          writeEnvFile(envContent);
        }
      } else {
        // API_KEY_SALT is not defined, generate and write salt
        const newSalt = await generateNewSalt();
        writeEnvFile(`${envContent}\nAPI_KEY_SALT=${newSalt}`);
      }
    } else {
      // .env file doesn't exist, generate and write salt
      const newSalt = await generateNewSalt();
      writeEnvFile(`API_KEY_SALT=${newSalt}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function generateNewSalt() {
  // Generate a new salt using bcrypt
  return await bcrypt.genSalt(saltRounds);
}

function writeEnvFile(content: string) {
  // Create or update the .env file with the new content
  fs.writeFileSync(envFilePath, content);

  console.log("Salt generated and .env file updated successfully.");
}

generateSalt();
