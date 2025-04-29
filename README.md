# vnc_samples

- [Progress](PROGRESS.md)

<img src="./docs/screenshots/screenshot_2025_04_29_0.gif" width="640">

## Remote Desktops
### Teamviewer SDK
* Mobile SDK for Android
  * https://www.teamviewer.com/apac/global/support/knowledge-base/other-products/assist-ar/assist-ar-mobile-sdk/mobile-sdk-for-android/
### TigerVNC (C/C++)
* https://tigervnc.org/
* Open Source
  * https://github.com/TigerVNC/tigervnc
  * https://github.com/LibVNC/libvncserver
### Rustdesk (RUST, Flutter GUI)
* https://rustdesk.com/docs/en/client/android/
 * Open Source
   * https://github.com/rustdesk/rustdesk
### noVNC (Javascript)
* https://www.npmjs.com/package/@novnc/novnc
* Open Source
  * https://github.com/novnc/noVNC
### react-vnc (Javascript)
* https://www.npmjs.com/package/react-vnc?activeTab=versions
* Open Source
  * https://github.com/roerohan/react-vnc

## noVNC

### noVNC Test
* https://novnc.com/noVNC/vnc.html

#### Advanced
* WebSocket
Host: localhost
Port: 5901

## Test

### Scenario #0

#### Server Setup #0 (Windows 11): Non-SSL, Non-Password
* Download `tigervnc64-winvnc-1.15.0.exe` from https://sourceforge.net/projects/tigervnc/files/stable/1.15.0/
* install `tigervnc64-winvnc-1.15.0.exe`
* Run `Run VNC Server`
* open `Control Panel` by clicking `VNC server` on startup programs
* Check Security Tab
  * Session Encryption -> None only
  * Check Authentication -> None only

#### Server Setup #1 (Windows 11): Non-SSL, Password
* Download `tigervnc64-winvnc-1.15.0.exe` from https://sourceforge.net/projects/tigervnc/files/stable/1.15.0/
* install `tigervnc64-winvnc-1.15.0.exe`
* Run `Run VNC Server`
* open `Control Panel` by clicking `VNC server` on startup programs
* Check Security Tab
  * Session Encryption -> None only
  * Check Authentication -> Standard VNC
    * Configure
      * set password

#### Client  (Ubuntu 20.04)
* run websokify to proxy
```
websockify -v  5901 192.168.55.34:5900 (No SSL)
```
* run app
```
npm run dev
```
### Scenario #1

#### Server Setup
```
sudo apt update
sudo apt install tigervnc-standalone-server
```
```
vncpasswd
Password:
Verify:
Would you like to enter a view-only password (y/n)? n
```
```
vncserver :1 -localhost -geometry 1024x768 -depth 24
```
```
vncserver -kill :1
killall vncserver
killall Xvnc-session
```
#### Client Setup
```
mkdir .cert
openssl req -x509 -newkey rsa:2048 -keyout .cert/key.pem -out .cert/cert.pem -days 365 -nodes
```
```
python3 -m pip install websockify
websockify --ssl-only --cert=.cert/cert.pem --key=.cert/key.pem 5901 localhost:5900
```

#### Client for Verification
```
sudo apt-get install tigervnc-viewer

xtigervncviewer -SecurityTypes VncAuth -passwd /home/rofox/.vnc/passwd :1
```

