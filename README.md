# firefox-nightly

[![⚡️ Powered By: Copr](https://img.shields.io/badge/⚡️_Powered_by-COPR-blue?style=flat-square)](https://copr.fedorainfracloud.org/)
![📦 Architecture: x86_64](https://img.shields.io/badge/📦_Architecture-x86__64-blue?style=flat-square)
[![Latest Version](https://img.shields.io/badge/dynamic/json?color=blue&label=Version&query=builds.latest.source_package.version&url=https%3A%2F%2Fcopr.fedorainfracloud.org%2Fapi_3%2Fpackage%3Fownername%3Dpointy%26projectname%3Dfirefox-nightly%26packagename%3Dfirefox-nightly%26with_latest_build%3DTrue&style=flat-square&logo=firefoxbrowser&logoColor=blue)](https://copr.fedorainfracloud.org/coprs/pointy/firefox-nightly/package/firefox-nightly/)
[![Copr build status](https://copr.fedorainfracloud.org/coprs/pointy/firefox-nightly/package/firefox-nightly/status_image/last_build.png)](https://copr.fedorainfracloud.org/coprs/pointy/firefox-nightly/package/firefox-nightly/)

An unofficial RPM package of [Firefox Nightly](https://www.mozilla.org/en-US/firefox/nightly) designed for [Fedora](https://getfedora.org).

## ⚠️ Special Note
This is just an RPM packaging for the said software and does not include any licenses of its own. The only additional file included is the `.desktop` file written based on the original executable from the Firefox Release Channel (default).

## About the Application
Get a sneak peek at our next generation web browser, and help us make it the best
browser it can be: try Firefox Nightly.

Nightly is an unstable testing and development platform. By default, Nightly
sends data to Mozilla — and sometimes our partners — to help us handle problems
and try ideas.

Note: Firefox Nightly will update approximately once or twice a day.

Bugs related to Firefox Nightly should be reported directly to Mozilla: [https://bugzilla.mozilla.org](https://bugzilla.mozilla.org)

Bugs related to this package should be reported at this GitHub project:
[https://github.com/pointydev/firefox-nightly-rpm/issues](https://github.com/pointydev/firefox-nightly-rpm/issues)

Based on: [https://github.com/the4runner/firefox-dev](https://github.com/the4runner/firefox-dev)

## Installation Instructions
1. Enable `pointy/firefox-nightly` [Copr](https://copr.fedorainfracloud.org/) repository according to your package manager.

```Shell
# If you are using dnf... (you need to have 'dnf-plugins-core' installed)
sudo dnf copr enable pointy/firefox-nightly

# If you are using yum... (you need to have 'yum-plugins-copr' installed)
sudo yum copr enable pointy/firefox-nightly
```

2. (Optional) Update your package list.

```Shell
sudo dnf check-update
```

3. Execute the following command to install the package.

```Shell
sudo dnf install firefox-nightly
```

4. Launch the application from the Application Menu or execute following command in terminal.

```Shell
firefox-nightly
```
