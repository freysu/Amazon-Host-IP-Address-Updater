// Import necessary libraries
const { writeReadmeFile, writeJsonFile } = require("./src/file_utils");
const logger = require('./src/logger');
const { processUrls } = require('./src/ipResolver');
const { amazon_urls } = require('./config/config');

async function main(verbose = false) {
  logger.info('Starting IP address updater...');
  const start_time = Date.now();
  let contentList = [];

  try {
    contentList = await processUrls(amazon_urls, verbose);
  } catch (error) {
    logger.error('Error processing URLs -1 :', error);
    return; // Terminate execution upon encountering an error
  }

  const end_time = Date.now();

  if (!contentList.length) {
    logger.warn('No valid content obtained.');
    return;
  }

  const content = contentList
    .map(([ip, url]) => {
      const padding = ip ? ' '.repeat(30 - ip.length) : " ".repeat(30 - "#".length);
      return `${ip}${padding}${url}`;
    })
    .join('\n');
    logger.warn(JSON.stringify(content));
    logger.warn(!Array.isArray(contentList))
    logger.warn(JSON.stringify(contentList));


  const update_time = new Date().toISOString();

  try {
    const hasChange = await writeReadmeFile(content, update_time);
    if (hasChange) {
      await writeJsonFile(contentList);
    }
  } catch (error) {
    logger.error(error.message);
    return; // Terminate execution upon encountering an error
  }

  if (verbose) {
    logger.info('Content:');
    logger.info(content);
    logger.info(`End script. Time taken: ${(end_time - start_time) / 1000} seconds.`);
  }
}

main(true);
