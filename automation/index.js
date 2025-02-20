import fetch from 'node-fetch';
import path from 'node:path';
import fs from 'node:fs/promises';

async function updateSpecWithBuildInfo() {
    const baseURL = 'https://download-installer.cdn.mozilla.net/pub/firefox/nightly/latest-mozilla-central/';

    // Fetch the directory listing HTML.
    const listingResponse = await fetch(baseURL);
    if (!listingResponse.ok) {
        throw new Error(`Failed to fetch directory listing: ${listingResponse.status}`);
    }
    const listingText = await listingResponse.text();

    // Extract the JSON build info file name.
    const jsonMatch = listingText.match(/href="[^"]*(firefox-[^"]+\.en-US\.linux-x86_64\.json)"/);
    if (!jsonMatch) {
        throw new Error('Could not find JSON build info file in directory listing');
    }
    const jsonFileName = jsonMatch[1];
    const jsonURL = new URL(jsonFileName, baseURL).toString();

    // Fetch the JSON build info.
    const jsonResponse = await fetch(jsonURL);
    if (!jsonResponse.ok) {
        throw new Error(`Failed to fetch JSON build info: ${jsonResponse.status}`);
    }
    const buildInfo = await jsonResponse.json();

    // Extract the version and buildid from the JSON.
    const versionFromJson = buildInfo.moz_app_version;
    const buildId = buildInfo.buildid;
    if (!versionFromJson || !buildId) {
        throw new Error('Missing version or buildid in JSON build info');
    }
    const newVersion = `${versionFromJson}^${buildId}`;
    console.log(`New version: ${newVersion}`);

    // Read the current RPM spec file.
    const specFilePath = path.join('..', 'firefox-nightly.spec');
    const specContent = await fs.readFile(specFilePath, 'utf8');

    // Update the Version line, using exactly 12 spaces after "Version:".
    function specUpdater(content, newVersion) {
        if (!content || !newVersion) throw new Error('Invalid content or version');
        const lines = content.split('\n');
        const versionLineIndex = lines.findIndex(line => line.startsWith('Version:'));
        if (versionLineIndex < 0) throw new Error('Failed to find Version: line in spec file');
        lines[versionLineIndex] = `Version:            ${newVersion}`;
        return lines.join('\n');
    }

    const updatedSpecContent = specUpdater(specContent, newVersion);

    // Write the updated content back to the spec file.
    await fs.writeFile(specFilePath, updatedSpecContent);
    console.log('Spec file updated successfully.');
}

updateSpecWithBuildInfo().catch(err => {
    console.error('Error updating spec file:', err);
    process.exit(1);
});
