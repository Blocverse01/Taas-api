export const API_KEY_SALT = validateEnvVariable("API_KEY_SALT");
export const API_KEY_LENGTH = validateEnvVariable("API_KEY_LENGTH");

function validateEnvVariable(variableName: string) {
  const value = process.env[variableName];

  if (!value) {
    throw new Error(`Missing value for environment variable: ${variableName}`);
  }

  return value;
}
