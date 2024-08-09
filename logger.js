//Import the required module
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { format, getYear } = require('date-fns');
const { v4: uuid } = require('uuid');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

myEmitter.on('event', async (event, level, message) => {
  console.log(`Event received: ${event}, Level: ${level}, Message: ${message}`);
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${level}\t${event}\t${message}\t${uuid()}`;

  try {
    // Set the path to SemesterThree2024FinalSprint/logs
    const logsDir = path.join(__dirname, '../SemesterThree2024FinalSprint/logs');
    const currFolder = path.join(logsDir, getYear(new Date()).toString());

    // Create directories if not exist
    if (!fs.existsSync(logsDir)) {
      console.log('Creating logs directory');
      await fsPromises.mkdir(logsDir, { recursive: true });
    }

    if (!fs.existsSync(currFolder)) {
      console.log(`Creating year directory: ${currFolder}`);
      await fsPromises.mkdir(currFolder);
    }

    const fileName = `${format(new Date(), 'yyyyMMdd')}_http_events.log`;
    console.log(`Writing to file: ${fileName}`);
    await fsPromises.appendFile(path.join(currFolder, fileName), logItem + '\n');
    console.log(`Log successfully written to ${path.join(currFolder, fileName)}`);
  } catch (err) {
    console.error('Error logging event:', err);
  }
});

// Function to log search queries
function logSearch(userId, query) {
  console.log(`Logging search for user: ${userId}, query: ${query}`);
  myEmitter.emit('event', 'SEARCH', 'INFO', `User: ${userId}, Query: ${query}`);
}

module.exports = logSearch;

