const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data", "vouches.json");

function load() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "{}");
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function addVouch(targetId, authorId, reason) {
  const data = load();

  if (!data[targetId]) {
    data[targetId] = [];
  }

  data[targetId].push({
    authorId,
    reason,
    timestamp: Date.now()
  });

  save(data);
  return data[targetId];
}

function getVouches(targetId) {
  const data = load();
  return data[targetId] || [];
}

module.exports = { addVouch, getVouches };