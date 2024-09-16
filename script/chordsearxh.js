const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "chordsearchfile",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "chan", // change credit if crush moko
  description: "Searches for chords based on a query and sends the data as a file.",
  usages: "chordsearchfile [query]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage("Please provide a query.", threadID, messageID);
  }

  api.sendMessage(`Searching for chords related to "${query}"...`, threadID, messageID);

  try {
    const response = await axios.get(`https://nash-rest-api-production.up.railway.app/search/chords?q=${encodeURIComponent(query)}`);
    const chordsData = response.data;

    // Prepare a simple text representation of the response data
    const chordsText = JSON.stringify(chordsData, null, 2);

    // Create a file path
    const time = new Date();
    const timestamp = time.toISOString().replace(/[:.]/g, "-");
    const path = __dirname + '/cache/' + `${timestamp}_chords.json`;

    // Write data to file
    fs.writeFileSync(path, chordsText);

    // Send the file as a message
    setTimeout(() => {
      api.sendMessage({
        body: "Chords data downloaded successfully!",
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path));
    }, 5000);

  } catch (error) {
    console.error(error);
    api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
  }
};