const axios = require('axios');

module.exports.config = {
  name: "tempmail",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "ch4n",
  description: "Generates a temporary email address and optionally checks the inbox.",
  usages: "tempmail [check] [email]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const command = args[0]; // 'check' or empty

  if (!command || command === "gen") {
    // Generate a new temporary email address
    try {
      const response = await axios.get('https://c-v1.onrender.com/tempmail/gen');
      const email = response.data.email;

      api.sendMessage(`📩 Your generated email: ${email}`, threadID, messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage('An error occurred while generating the temporary email.', threadID, messageID);
    }
  } else if (command === "inbox") {
    const email = args[1]; // Email to check, should be provided in the second argument

    if (!email) {
      return api.sendMessage('Please provide the temporary email address to check.', threadID, messageID);
    }

    // Check the inbox for the provided temporary email address
    try {
      const response = await axios.get(`https://c-v1.onrender.com/tempmail/inbox?email=${encodeURIComponent(email)}`);
      const messages = response.data;

      if (messages.length > 0) {
        let messageList = messages.map((msg, index) => `#${index + 1} From: ${msg.from}\nSubject: ${msg.subject}\nDate: ${msg.date}`).join('\n\n');
        api.sendMessage(`📬 Checked Inbox for ${email}:\n\n${messageList}`, threadID, messageID);
      } else {
        api.sendMessage('Your inbox is empty.', threadID, messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('❌ An error occurred while checking the inbox.', threadID, messageID);
    }
  } else {
    api.sendMessage('❌ Invalid command. Use {p}tempmail to generate a new email or {p}tempmail check <email> to check the inbox.', threadID, messageID);
  }
};