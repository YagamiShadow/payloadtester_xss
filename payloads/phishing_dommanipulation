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
