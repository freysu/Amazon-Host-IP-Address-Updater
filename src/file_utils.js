const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

const SCRIPT_DIR = __dirname;
const README_PATH = path.join(SCRIPT_DIR, '../README.md');
const README_TEMPLATE_PATH = path.join(SCRIPT_DIR, '../README_template.md');
const HOSTS_PATH = path.join(SCRIPT_DIR, '../dist/hosts');
const HOSTS_JSON_PATH = path.join(SCRIPT_DIR, '../dist/hosts.json');

async function writeReadmeFile(hostsContent, updateTime) {
    const outputDocFilePath = README_PATH;
    const templatePath = README_TEMPLATE_PATH;
    await writeHostFile(hostsContent);

    try {
        await fs.access(outputDocFilePath);
        const oldContent = await fs.readFile(outputDocFilePath, 'utf-8');
        if (oldContent) {
            const oldHosts = oldContent.split('```bash')[1].split('```')[0].trim();
            const oldUpdateTime = oldContent.split('# Update time:')[1].trim().split('\n')[0];
            const hostsContentHosts = hostsContent.split('# Update time:')[0].trim();

            if (oldHosts === hostsContentHosts && oldUpdateTime === updateTime) {
                logger.info('Host not changed');
                return false;
            }
        }
    } catch (error) {
        // File doesn't exist or error reading file
    }

    const templateStr = await fs.readFile(templatePath, 'utf-8');
    const updatedHostsContent = templateStr.replace('{hosts_str}', hostsContent).replace('{update_time}', updateTime);

    await fs.writeFile(outputDocFilePath, updatedHostsContent, 'utf-8');
    return true;
}

async function writeHostFile(hostsContent) {
    const outputFilePath = HOSTS_PATH;
    await fs.writeFile(outputFilePath, hostsContent, 'utf-8');
}

async function writeJsonFile(hostsList) {
    const outputFilePath = HOSTS_JSON_PATH;
    await fs.writeFile(outputFilePath, JSON.stringify(hostsList), 'utf-8');
}

module.exports = {
    writeReadmeFile,
    writeJsonFile
};
