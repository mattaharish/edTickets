$(document).ready(function () {

    var $formLogin = $('#login-form');
    var $formLost = $('#lost-form');
    var $formRegister = $('#register-form');
    var $divForms = $('#div-forms');
    var $next = $('#next');
    var $otpForm = $('#otp-form');
    var $resetForm = $('#new-password-form');

    var $modalAnimateTime = 300;
    var $msgAnimateTime = 150;
    var $msgShowTime = 2000;

    $(document).on("click", "#login_register_btn", function () {
        //alert("Matta");
        modalAnimate($formLogin, $formRegister);
    });

    $('#register_login_btn').click(function () {
        modalAnimate($formRegister, $formLogin);
    });
    $('#login_lost_btn').click(function () {
        modalAnimate($formLogin, $formLost);
    });
    $('#lost_login_btn').click(function () {
        modalAnimate($formLost, $formLogin);
    });
    $('#lost_register_btn').click(function () {
        modalAnimate($formLost, $formRegister);
    });
    $('#register_lost_btn').click(function () {
        modalAnimate($formRegister, $formLost);
    });
    $('#otp_login_btn').click(function () {
        modalAnimate($otpForm, $formLogin)
    });
    $('#otp_register_btn').click(function () {
        modalAnimate($otpForm, $formRegister)
    });
    $('#reset_login_btn').click(function () {
        modalAnimate($resetForm, $formLogin)
    });
    $('#reset_register_btn').click(function () {
        modalAnimate($resetForm, $formRegister)
    });

    $('#lost-form').on('submit', function(e) {
        e.preventDefault();
        if($("#lost_email").val()!=""){
            modalAnimate($formLost, $otpForm);
        }
    });

    $('#otp-form').on('submit', function(e) {
        e.preventDefault();
        /*if($("#unique").val()!=""){
            alert("Matta");
            modalAnimate($otpForm, $resetForm);
        }*/
        var interval = setInterval(checkFunction, 1000);
        function checkFunction(){
            //alert($("#check").val());
            if($("#check").val() == "false"){
                //alert($("#check").val());
                modalAnimate($otpForm, $resetForm);
                clearInterval(interval);
            }
        }
    });

    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        var interval = setInterval(checkFunction, 1000);
        function checkFunction(){
            //alert($("#closeValue").val());
            if($("#closeValue").val() == "false"){
                //alert($("#check").val());
                //alert($("#closeValue").val());
                //modalAnimate($otpForm, $resetForm);
                $('#login-modal').modal('toggle');
                clearInterval(interval);
            }
        }
    });



    function modalAnimate($oldForm, $newForm) {
        var $oldH = $oldForm.height();
        var $newH = $newForm.height();
        $divForms.css("height", $oldH);
        $oldForm.fadeToggle($modalAnimateTime, function () {
            $divForms.animate({
                height: $newH
            }, $modalAnimateTime, function () {
                $newForm.fadeToggle($modalAnimateTime);
            });
        });
    }

});