import fetch from 'node-fetch';
import path from 'node:path';
import fs from 'node:fs/promises';

// Convert a version string into a numeric key for easy comparison.
function versionKey(v) {
    const m = v.match(/^(\d+)\.(\d+)a(\d+)$/);
    if (!m) throw new Error(`Invalid version format: ${v}`);
    // Calculate a numeric key: major*1e6 + minor*1e3 + patch.
    return Number(m[1]) * 1e6 + Number(m[2]) * 1e3 + Number(m[3]);
}

async function fetchResource(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
    return (response.headers.get('content-type') || '').includes('application/json')
    ? response.json()
    : response.text();
}

async function updateSpecWithBuildInfo() {
    const baseURL = 'https://download-installer.cdn.mozilla.net/pub/firefox/nightly/latest-mozilla-central/';

    // Fetch the directory listing and extract all matching JSON file names.
    const listingText = await fetchResource(baseURL);
    const regex = /href="\/pub\/firefox\/nightly\/latest-mozilla-central\/(firefox-([0-9]+\.[0-9]+a[0-9]+)\.en-US\.linux-x86_64\.json)"/g;
    const matches = Array.from(listingText.matchAll(regex));
    if (matches.length === 0) throw new Error('Could not find any JSON build info file in directory listing');

    // Select the match with the highest version.
    const chosen = matches.reduce((max, curr) =>
    !max || versionKey(curr[2]) > versionKey(max[2]) ? curr : max, null);
    if (!chosen) throw new Error('No valid JSON build info file found');

    // Fetch JSON build info.
    const jsonURL = new URL(chosen[1], baseURL).toString();
    const buildInfo = await fetchResource(jsonURL);
    const { moz_app_version: versionFromJson, buildid: buildId } = buildInfo;
    if (!versionFromJson || !buildId) throw new Error('Missing version and buildid in JSON build info');

    const newVersion = `${versionFromJson}^${buildId}`;

    // Read and update the spec file.
    const specFilePath = path.join('..', 'firefox-nightly.spec');
    let specContent = await fs.readFile(specFilePath, 'utf8');
    specContent = specContent
    .replace(/^(Version:\s{12}).*$/m, `$1${newVersion}`)
    .replace(/^(%global\s{13}short_version\s+).+$/m, `$1${versionFromJson}`);
    await fs.writeFile(specFilePath, specContent);

    // Output the new version for GitHub Actions.
    console.log(`NEW_VERSION=${newVersion}`);
}

updateSpecWithBuildInfo().catch(err => {
    console.error('Error updating spec file:', err);
    process.exit(1);
});
