/// <reference path="../../typings/main.d.ts" />

class Login {
    constructor() {
        $('form .gray-btn').on('click', function(e) {
            $('form').submit();
        });
    }
}

$(() => {
    let login = new Login();
});