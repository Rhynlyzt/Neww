const axios = require('axios');

module.exports.config = {
  name: "trivia",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "chan",
  description: "Fetches a trivia question.",
  usages: "trivia",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  if (args.length > 0) {
    return api.sendMessage("This command does not require additional arguments.", threadID, messageID);
  }

  api.sendMessage("⌛ Fetching a trivia question for you...", threadID, messageID);

  try {
    const response = await axios.get('https://nash-rest-api-production.up.railway.app/trivia');
    const trivia = response.data;

    if (!trivia || !trivia.question) {
      return api.sendMessage("Sorry, I couldn't fetch a trivia question at the moment.", threadID, messageID);
    }

    api.sendMessage(`🗒️ Here's a trivia question for you:\n\n📃${trivia.question}`, threadID, messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
  }
};