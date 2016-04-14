/// <reference path="../../typings/main.d.ts" />
var AdminAuth = (function () {
    function AdminAuth() {
        // ログインイベント
        $('.login form .gray-btn').on('click', function (e) {
            $('form').submit();
        });
        // ログアウトイベント
        $('header nav .logout a').on('click', function (e) {
            console.log('logouting...');
            $.ajax({
                url: '/admin/logout',
                method: 'post',
                dataType: 'json',
                data: {},
                processData: false,
                contentType: false // contentTypeもfalseに指定
            })
                .done(function (data) {
                if (data.isSuccess) {
                    $('.modal-cover, .modal.type-logout').addClass('active');
                }
            })
                .fail(function () {
            })
                .always(function () {
            });
        });
    }
    return AdminAuth;
}());
$(function () {
    var adminAuth = new AdminAuth();
});
