// // ipResolver.js
// const axios = require('axios');
// const ping = require('ping');
// const { promisify } = require('util');
// const logger = require('./logger');
// const { PING_TIMEOUT, MAX_ATTEMPTS, CONCURRENT_REQUESTS } = require('../config/config');

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms))
// }
// async function retryIfResultNone(fn) {
//     let result = await fn();
//     let attempt = 1;

//     while (result === null && attempt <= MAX_ATTEMPTS) {
//         logger.error(`Attempt ${attempt} failed. Retrying...`);
//         await sleep(500); // wait for 1 second before retrying
//         result = await fn();
//         attempt++;
//     }

//     if (result === null) {
//         throw new Error('Max attempts reached. Unable to get result.');
//     }

//     return result;
// }
// async function getIpFromApi(amazonUrl, headers) {
//     let trueIp = null;

//     // for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
//     try {
//         const response = await axios.get(`http://ip-api.com/json/${amazonUrl}?lang=zh-CN`, {
//             headers,
//             timeout: PING_TIMEOUT,
//         });

//         const data = response.data;

//         if (
//             data.status === 'success' &&
//             data.query.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/) &&
//             data.query.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/).length === 1
//         ) {
//             trueIp = data.query;
//             // break;
//         }
//     } catch (error) {
//         logger.error(`Error querying ${amazonUrl}: ${error.message}`);
//     }
//     // }

//     return trueIp;
// }

// async function queryIpApi(amazonUrl) {
//     try {
//         const amazonIps = await promisify(require('dns').resolve)(amazonUrl);
//         return amazonIps;
//     } catch (error) {
//         logger.error(`Error querying ${amazonUrl} by Socket. Trying to get IP from API: ${error.message}`);
//         try {
//             const cAmazonIps = await retryIfResultNone(() =>
//                 getIpFromApi(amazonUrl, {
//                     'user-agent':
//                         'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36',
//                     Host: 'ip-api.com',
//                 })
//             );
//             return cAmazonIps;
//         } catch (error) {
//             logger.error(`Error querying ${amazonUrl} by API: ${error.message}`);
//             return null;
//         }
//     }
// }

// async function getBestIp(ipList) {
//     let bestIp = '';
//     let minMs = PING_TIMEOUT;
//     if (!Array.isArray(ipList)) {
//         ipList = [ipList]; // Convert to array if not already an array
//     }
//     for (const ip of ipList) {
//         const pingResult = await ping.promise.probe(ip, { timeout: PING_TIMEOUT });

//         if (pingResult.time === PING_TIMEOUT) {
//             // Timeout, consider IP invalid
//             continue;
//         } else {
//             if (pingResult.time < minMs) {
//                 minMs = pingResult.time;
//                 bestIp = ip;
//             }
//         }
//     }

//     return bestIp;
// }

// async function getIp(amazonUrl) {
//     return await queryIpApi(amazonUrl);
// }

// async function processUrl(amazonUrl, verbose) {
//     try {
//         const ip = await getIp(amazonUrl); // Await the result here
//         const bestIp = await getBestIp(ip); // Await the result here
//         if (!bestIp || bestIp === '' || bestIp === null) {
//             logger.error(`bestIp :${bestIp} ;Error processing ${amazonUrl}`);
//             return ['', amazonUrl];
//         }
//         if (verbose) {
//             logger.info(`Processed ${amazonUrl}`);
//         }
//         return [bestIp || '#'.padEnd(30), amazonUrl];
//     } catch (error) {
//         logger.error(`Error processing ${amazonUrl}: ${error?.message}`);
//         return ['', amazonUrl];
//     }
// }

// async function processUrls(urls, verbose) {
//     const contentList = [];
//     const tasks = urls.map((url) => processUrl(url, verbose));
//     logger.info(`Processing ${urls.length} urls`);
//     for (const result of await Promise.all(tasks)) {
//         if (result) {
//             contentList.push(result);
//         }
//     }

//     return contentList;
// }

// module.exports = {
//     processUrls,
// };

// // ipResolver.js
const axios = require('axios');
const ping = require('ping');
const { promisify } = require('util');
const logger = require('./logger');
const { PING_TIMEOUT, MAX_ATTEMPTS, CONCURRENT_REQUESTS } = require('../config/config');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getIpFromApi(amazonUrl, headers) {
    try {
        const response = await axios.get(`http://ip-api.com/json/${amazonUrl}?lang=zh-CN`, {
            headers,
            timeout: PING_TIMEOUT,
        });
        const data = response.data;
        if (data.status === 'success' && data.query.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/)) {
            return data.query;
        } else {
            logger.info(`Skipped IP from API for ${amazonUrl}: No valid IP or status not success.`);
        }
    } catch (error) {
        logger.error(`Error querying ${amazonUrl} from API: ${error.message}`);
        throw error;
    }
    return null;
}

async function queryIpApi(amazonUrl) {
    try {
        const amazonIps = await promisify(require('dns').resolve)(amazonUrl);
        return amazonIps;
    } catch (error) {
        logger.error(`Error querying ${amazonUrl} by Socket. Trying to get IP from API: ${error.message}`);
        try {
            return await getIpFromApi(amazonUrl, {
                'user-agent':
                    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36',
                Host: 'ip-api.com',
            });
        } catch (error) {
            logger.error(`Error querying ${amazonUrl} by API: ${error.message}`);
            throw error;
        }
    }
}

async function getBestIp(ipList) {
    let bestIp = "";
    let minMs = PING_TIMEOUT;
    if (!Array.isArray(ipList)) {
        ipList = [ipList]; // Convert to array if not already an array
    }
    for (const ip of ipList) {
        try {
            const pingResult = await ping.promise.probe(ip, { timeout: PING_TIMEOUT / 1000 });
            if (pingResult.time < minMs) {
                minMs = pingResult.time;
                bestIp = ip;
            }
        } catch (error) {
            logger.error(`Error pinging IP ${ip}: ${error.message}`);
        }
    }
    return bestIp;
}

async function processUrl(amazonUrl, verbose) {
    const ip = await queryIpApi(amazonUrl);
    let bestIp = await getBestIp(ip)
    if (ip && bestIp) {
        if (verbose) {
            logger.info(`Processed ${amazonUrl}`);
            return [bestIp, amazonUrl];
        }
    } else {
        logger.error(`Error processing ${amazonUrl}`);
        return ['#', amazonUrl];
    }
}

async function processUrlWithRetry(url, verbose, maxAttempts = MAX_ATTEMPTS) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await processUrl(url, verbose);
        } catch (error) {
            logger.warn(`Failed to process URL ${url} on attempt ${attempt}. Reason: ${error.message}`);
            if (attempt < maxAttempts) {
                await sleep(PING_TIMEOUT * 2); // 简单的重试间隔
            }
        }
    }
    logger.error(`Failed to process URL ${url} after ${maxAttempts} attempts.`);
    return ['#', url];
}

async function processUrls(amazon_urls, verbose) {
    const promises = amazon_urls.map(async (url) => {
        return processUrlWithRetry(url, verbose);
    });
    // logger.info(promises)
    const results = await Promise.all(promises);
    // logger.info(results)
    return results
}

module.exports = {
    processUrls,
};
