<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원가입</title>
</head>
<body>
<?php
    include "../connect/connect.php";

    $youEmail = $_POST['youEmail'];
    $youName = $_POST['youName'];
    $youPass = $_POST['youPass'];
    $youPassC = $_POST['youPassC'];
    $youNickName = $_POST['youNickName'];
    $youPhone = $_POST['youPhone'];
    $regTime = time();

    // echo $youEmail, $youName, $youPass, $youNickName, $youPhone, $regTime;

    // $sql="INSERT INTO myMember(youEmail, youName, youPass, youNickName, youPhone, regTime) VALUES('$youEmail', '$youName', '$youPass', '$youNickName', '$youPhone', '$regTime')";
    
    // $result = $connect -> query($sql);

    // if($result){
    //     echo "INSERT INTO TRUE";
    // }else {
    //     echo "INSERT INTO FALSE";
    // }

    //데이터 가져오기 ---> 유효성 검사 --> 데이터 중복검사(X) ---> 회원가입
    //데이터 가져오기 ---> 유효성 검사 --> 데이터 중복검사(O) ---> 로그인


    //메세지 출력
    // function msg($alert){
    //     echo "<p class='alert'>{$alert}</p>";
    // }

    // // 이메일 유효성 검사(내장함수)
    // $checkEmail = filter_var($youEmail, FILTER_VALIDATE_EMAIL);

    // if($checkEmail == false){
    //     msg("이메일이 잘못되었습니다. 올바른 메일 주소를 적어주세요.");
    //     exit;
    // }

    //이메일 유효성 검사(정규식 표현)

    $check_email = preg_match("/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i", $youEmail);


        if($check_email == false){
            msg("이메일이 잘못되었습니다. 올바른 메일 주소를 적어주세요.");
            exit;
        }

    //비밀번호 검사
        if($youPass !== $youPassC){
            msg("비밀번호가 일치하지 않습니다.<br>다시 입력해주세요.");
            exit;
        }

    //비밀번호 암호화
    $youPass = sha1($youPass);

    //이메일 중복검사
    $isEmailCheck = false;

    $sql = "SELECT youEmail FROM myMember WHERE youEmail = '$youEmail'";
    $result = $connect -> query($sql);

    if($result){
        $count = $result -> num_rows;
        if($count == 0) {
            //회원가입
            $isEmailCheck = true;
        } else {
            //로그인 유도
            msg ("이미 회원 가입이 되어있는 유저입니다. 로그인 해주시기 바랍니다.");
            exit;
        }
    } else {
        msg("에러 발생1 -관리자에게 문의해주세요.");
        exit;
    }

    //핸드폰 번호 중복검사
    $isPhoneCheck = false;

    $sql = "SELECT youPhone FROM myMember WHERE youPhone = '$youPhone'";
    $result = $connect -> query($sql);

    if($result){
        $count = $result -> num_rows;
        if($count == 0) {
            //회원가입
            $isPhoneCheck = true;
        } else {
            //로그인 유도
            msg("이미 회원 가입이 되어있습니다. 로그인 해주십시오.");
            exit;
        }
    } else {
        msg("에러 발생1 -관리자에게 문의해주세요.");
        exit;
    }

    //회원가입

    if($isEmailCheck == true && $isPhoneCheck == true) {
        $sql="INSERT INTO myMember(youEmail, youName, youPass, youNickName, youPhone, regTime) VALUES('$youEmail', '$youName', '$youPass', '$youNickName', '$youPhone', '$regTime')";
    
        $result = $connect -> query($sql);
        
        if($result){
            msg("회원가입을 축하합니다!");
            exit;
        }else {
            msg("에러 발생3 -관리자에게 문의해주세요.");
            exit;
        }
    }else{
        msg("이메일 또는 핸드폰번호가 틀립니다. 다시 한 번 확인해주세요.");
        exit;
    }




?>
</body>
</html>