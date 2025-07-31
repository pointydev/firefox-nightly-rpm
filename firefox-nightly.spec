%global             source_name firefox
%global             application_name firefox-nightly
%global             full_name firefox-nightly
%global             internal_name firefox-nightly
%global             debug_package %{nil}
%global             short_version 143.0a1

Name:               firefox-nightly
Version:            143.0a1^20250731043531
Release:            0%{?dist}
Summary:            Firefox Nightly unstable Web browser

License:            MPLv1.1 or GPLv2+ or LGPLv2+
URL:                https://www.mozilla.org/en-US/firefox/nightly/
Source0:            https://download-installer.cdn.mozilla.net/pub/firefox/nightly/latest-mozilla-central/firefox-%{short_version}.en-US.linux-x86_64.tar.xz
Source1:            %{internal_name}.desktop
Source2:            policies.json
Source3:            %{internal_name}

ExclusiveArch:      x86_64

Recommends:         (plasma-browser-integration if plasma-workspace)
Recommends:         (gnome-browser-connector if gnome-shell)

BuildRequires:      chrpath

Requires(post):     gtk-update-icon-cache

%description
Get a sneak peek at our next generation web browser, and help us make it the best
browser it can be: try Firefox Nightly.

Nightly is an unstable testing and development platform. By default, Nightly
sends data to Mozilla — and sometimes our partners — to help us handle problems
and try ideas.

Note: Firefox Nightly will update approximately once or twice a day.

Bugs related to Firefox Developer Edition should be reported directly to Mozilla:
<https://bugzilla.mozilla.org/>

Bugs related to this package should be reported at this GitHub project:
<https://github.com/pointydev/firefox-nightly-rpm/issues/>

Based on: <https://github.com/the4runner/firefox-dev/>

%prep
%setup -q -n %{source_name}

%install
%__rm -rf %{buildroot}

%__install -d %{buildroot}{/opt/%{application_name},%{_bindir},%{_datadir}/applications,%{_datadir}/icons/hicolor/128x128/apps,%{_datadir}/icons/hicolor/64x64/apps,%{_datadir}/icons/hicolor/48x48/apps,%{_datadir}/icons/hicolor/32x32/apps,%{_datadir}/icons/hicolor/16x16/apps}

%__cp -r * %{buildroot}/opt/%{application_name}
#ERROR   0002: file '/opt/firefox-nightly/libonnxruntime.so' contains an invalid runpath '$' in [$]
chrpath --delete %{buildroot}/opt/%{application_name}/libonnxruntime.so || :

%__install -D -m 0644 %{SOURCE1} -t %{buildroot}%{_datadir}/applications

%__install -D -m 0444 %{SOURCE2} -t %{buildroot}/opt/%{application_name}/distribution

%__install -D -m 0755 %{SOURCE3} -t %{buildroot}%{_bindir}

%__ln_s ../../../../../../opt/%{application_name}/browser/chrome/icons/default/default128.png %{buildroot}%{_datadir}/icons/hicolor/128x128/apps/%{full_name}.png
%__ln_s ../../../../../../opt/%{application_name}/browser/chrome/icons/default/default64.png %{buildroot}%{_datadir}/icons/hicolor/64x64/apps/%{full_name}.png
%__ln_s ../../../../../../opt/%{application_name}/browser/chrome/icons/default/default48.png %{buildroot}%{_datadir}/icons/hicolor/48x48/apps/%{full_name}.png
%__ln_s ../../../../../../opt/%{application_name}/browser/chrome/icons/default/default32.png %{buildroot}%{_datadir}/icons/hicolor/32x32/apps/%{full_name}.png
%__ln_s ../../../../../../opt/%{application_name}/browser/chrome/icons/default/default16.png %{buildroot}%{_datadir}/icons/hicolor/16x16/apps/%{full_name}.png

%post
gtk-update-icon-cache -ftq %{_datadir}/icons/hicolor

%files
%{_datadir}/applications/%{internal_name}.desktop
%{_datadir}/icons/hicolor/128x128/apps/%{full_name}.png
%{_datadir}/icons/hicolor/64x64/apps/%{full_name}.png
%{_datadir}/icons/hicolor/48x48/apps/%{full_name}.png
%{_datadir}/icons/hicolor/32x32/apps/%{full_name}.png
%{_datadir}/icons/hicolor/16x16/apps/%{full_name}.png
%{_bindir}/%{internal_name}
/opt/%{application_name}
