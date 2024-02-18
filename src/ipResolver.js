// // ipResolver.js
// const axios = require('axios');
const ping = require('ping');
const { promisify } = require('util');
const logger = require('./logger');
const { PING_TIMEOUT, MAX_ATTEMPTS, CONCURRENT_REQUESTS } = require('../config/config');
const Header = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.23.184.0 Mobile Safari/537.36 Edge/18.18362 SearchCraft/2.8.2 Baidu;P1 10.0",
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json'
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* 
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
*/

async function getIpFromApi(amazonUrl, headers) {
    try {
        const response = await fetch(`http://ip-api.com/json/${amazonUrl}?lang=zh-CN`, {
            method: 'GET',
            headers: Object.assign({
                'Content-Type': 'application/json; charset=utf-8',
            }, Headers),
            timeout: PING_TIMEOUT,
        });
        const data = await response.json(); // 使用 json() 方法解析 JSON 响应
        if (response.ok && data.status === 'success' && data.query.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/)) {
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

    try {
        const results = await Promise.allSettled(promises);
        return results.filter(result => result.status === 'fulfilled').map(result => result.value);
    } catch (error) {
        logger.error(`Failed to process all URLs: ${error.message}`);
        throw error;
    }
}

module.exports = {
    processUrls,
};
