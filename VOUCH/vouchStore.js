const fs = require("fs");
const path = require("path");

const DATA_PATH = process.env.VOUCH_DATA_PATH || "/data/vouches.json";

function ensureFile() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      const dir = path.dirname(DATA_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_PATH, JSON.stringify({ vouches: [] }, null, 2));
    }
  } catch (err) {
    console.error("Failed to ensure vouch data file", err);
  }
}

function readData() {
  ensureFile();
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read vouch data", err);
    return { vouches: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write vouch data", err);
  }
}

function addVouch(userId, rating, description, imageUrl) {
  const data = readData();
  data.vouches.push({
    userId,
    rating,
    description,
    image: imageUrl || null,
    timestamp: Date.now()
  });
  writeData(data);
}

function getVouchesForUser(userId) {
  const data = readData();
  return data.vouches.filter(v => v.userId === userId);
}

module.exports = {
  addVouch,
  getVouchesForUser
}; 