<?php
    include "../connect/session.php";

    unset($_SESSION['myMemberID']);
    unset($_SESSION['youEmail']);
    unset($_SESSION['myMemberID']);
?>

<script>
    location.href="../main/main.php"
</script>