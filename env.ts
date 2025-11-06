// This file is used to securely manage and export environment variables.
// The Gemini API key is retrieved from the process environment.

// IMPORTANT: Make sure to set the API_KEY in your deployment environment.
// This key is essential for the application to communicate with the Gemini API.
export const GEMINI_API_KEY = process.env.API_KEY;
