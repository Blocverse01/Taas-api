export const allowedOrigins = [
  "http://localhost:3000",
  "https://taas-platform.vercel.app",
  // Add other non-regex origins here
];

export const allowedOriginPatterns = [
  /^https:\/\/taas-platform-[a-zA-Z0-9]+-blocverse\.vercel\.app$/,
  /^http:\/\/localhost:(\d)+$/,
  /.+\.local$/,
  // Add other patterns as needed
];