const fs = require('fs');
const path = require('path');

const JOBS_FILE = path.join(__dirname, '../data/jobs.json');

function ensureDirectoryExists() {
  const dir = path.dirname(JOBS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJobs() {
  ensureDirectoryExists();

  if (!fs.existsSync(JOBS_FILE)) {
    writeJobs([]);
    return [];
  }

  const data = fs.readFileSync(JOBS_FILE, 'utf8');
  if (!data.trim()) {
    writeJobs([]);
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing jobs.json, resetting file', error);
    writeJobs([]);
    return [];
  }
}

function writeJobs(jobs) {
  ensureDirectoryExists();
  fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
}

module.exports = { readJobs, writeJobs };