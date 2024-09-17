const axios = require('axios');

module.exports.config = {
  name: "merriam",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "chan",
  description: "Fetches the definition of a given word.",
  usages: "merriam [word]",
  cooldowns: 3,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    return api.sendMessage("Please provide a word to define.", threadID, messageID);
  }

  const word = args.join(" ");
  api.sendMessage(`⚙️ Merriam Webster is fetching  for you question "${word}"...`, threadID, messageID);

  try {
    const response = await axios.get(`https://nash-rest-api-production.up.railway.app/merriam-webster/definition?word=${encodeURIComponent(word)}`);
    const data = response.data;

    if (!data || !data.definitions || data.definitions.length === 0) {
      return api.sendMessage(`🥺 Sorry, I couldn't find the definition for "${word}".`, threadID, messageID);
    }

    const definitions = data.definitions.map((def, index) => `${index + 1}. ${def}`).join("\n");
    api.sendMessage(`🎉 Here is the result of $"{word}":\n\n📃${definitions}`, threadID, messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage(`❌ An error occurred: ${error.message}`, threadID, messageID);
  }
};