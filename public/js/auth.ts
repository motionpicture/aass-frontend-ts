/// <reference path="../typings/index.d.ts" />

class Auth {
    constructor() {
        // ログインイベント
        $('.login form .gray-btn').on('click', function(e) {
            $('form').submit();
        });

        // ログアウトイベント
        $('header nav .logout a').on('click', function(e) {
            console.log('logouting...');
            $.ajax({
                url: '/logout',
                method: 'post',
                dataType: 'json',
                data: {},
                processData: false, // Ajaxがdataを整形しない指定
                contentType: false // contentTypeもfalseに指定
            })
            .done((data) => {
                if (data.isSuccess) {
                    $('.modal-cover, .modal.type-logout').addClass('active');
                }
            })
            .fail(() => {
            })
            .always(() => {
            });
        });
    }
}

$(() => {
    let auth = new Auth();
});