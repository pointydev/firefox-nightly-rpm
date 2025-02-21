import fetch from 'node-fetch';
import path from 'node:path';
import fs from 'node:fs/promises';

async function fetchResource(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
    return (response.headers.get('content-type') || '').includes('application/json') ? response.json() : response.text();
}

async function updateSpecWithBuildInfo() {
    const baseURL = 'https://download-installer.cdn.mozilla.net/pub/firefox/nightly/latest-mozilla-central/';

    // Fetch directory listing and extract JSON build info file name.
    const listingText = await fetchResource(baseURL);
    const jsonMatch = listingText.match(/href="\/pub\/firefox\/nightly\/latest-mozilla-central\/(firefox-[^"]+\.en-US\.linux-x86_64\.json)"/);
    if (!jsonMatch) throw new Error('Could not find JSON build info file in directory listing');

    // Fetch JSON build info.
    const buildInfo = await fetchResource(new URL(jsonMatch[1], baseURL).toString());
    const { moz_app_version: versionFromJson, buildid: buildId } = buildInfo;
    if (!versionFromJson || !buildId) throw new Error('Missing version and buildid in JSON build info');

    const newVersion = `${versionFromJson}^${buildId}`;
    console.log(`New version: ${newVersion}`);

    // Read and update spec file.
    const specFilePath = path.join('..', 'firefox-nightly.spec');
    let specContent = await fs.readFile(specFilePath, 'utf8');
    specContent = specContent
    .replace(/^(Version:\s{12}).*$/m, `$1${newVersion}`)
    .replace(/^(%global\s{13}short_version\s+).+$/m, `$1${versionFromJson}`);

    await fs.writeFile(specFilePath, specContent);
    console.log('Spec file updated successfully.');
}

updateSpecWithBuildInfo().catch(err => {
    console.error('Error updating spec file:', err);
    process.exit(1);
});
