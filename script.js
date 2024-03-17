const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const filepath = "./data.txt";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyDak6pLoKL5Kz8BvewuVhoShdZITEIkeow");

fs.readFile(filepath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Print the content of the file
  // Use let instead of const for prompt
  let prompt = data;

  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  console.log(text);
});