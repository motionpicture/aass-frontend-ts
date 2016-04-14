/// <reference path="../../../typings/main.d.ts" />
var AdminEventForm = (function () {
    function AdminEventForm() {
        var _this = this;
        // 確認イベント
        $('form .gray-btn.next-btn a').on('click', function (e) {
            $('.validation').removeClass('active');
            // var isNew = (!$('input[name="id"]', $(this)).val());
            var form = $('form');
            var formElement = form.get()[0];
            $.ajax({
                url: '/admin/event/validate',
                method: 'post',
                dataType: 'json',
                data: new FormData(formElement),
                processData: false,
                contentType: false // contentTypeもfalseに指定
            })
                .done(function (data) {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    var html_1 = '';
                    data.messages.forEach(function (message) {
                        html_1 += '<li>' + message + '</li>';
                    });
                    $('.validation ul').html(html_1);
                    $('.validation').addClass('active');
                }
                else {
                    // モーダルに内容反映
                    var modal = $('.modal.type-05');
                    $('.email dd', modal).text($('input[name="email"]', form).val());
                    $('.user_id dd', modal).text($('input[name="user_id"]', form).val());
                    $('.password dd', modal).text($('input[name="password"]', form).val());
                    $('.held dd', modal).text($('input[name="held"]', form).val());
                    $('.place dd', modal).text($('input[name="place"]', form).val());
                    $('.remarks dd', modal).html($('textarea[name="remarks"]', form).val().replace(/[\n\r]/g, '<br>'));
                    $('.modal-cover, .modal.type-05').addClass('active');
                }
            })
                .fail(function () {
                alert('fail');
            })
                .always(function () {
            });
            return false;
        });
        // 登録イベント
        $('.modal.type-05 .btn.next-btn a').on('click', function (e) {
            $('.validation').removeClass('active');
            $('.modal-cover, .modal.type-05').removeClass('active');
            var isNew = (!$('input[name="id"]', $(_this)).val());
            var form = $('form');
            var formElement = form.get()[0];
            $.ajax({
                url: location.href,
                method: 'post',
                dataType: 'json',
                data: new FormData(formElement),
                processData: false,
                contentType: false // contentTypeもfalseに指定
            })
                .done(function (data) {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    var html_2 = '';
                    data.messages.forEach(function (message) {
                        html_2 += '<li>' + message + '</li>';
                    });
                    $('.validation ul').html(html_2);
                    $('.validation').addClass('active');
                }
                else {
                    $('.modal-cover, .modal.type-06').addClass('active');
                }
            })
                .fail(function () {
                alert('fail');
            })
                .always(function () {
            });
            return false;
        });
        // 確認いいえイベント
        $('.modal.type-05 .btn.prev-btn a').on('click', function (e) {
            $('.modal-cover, .modal.type-05').removeClass('active');
        });
        // 確認閉じるイベント
        $('.modal.type-05 .close-btn a').on('click', function (e) {
            $('.modal-cover, .modal.type-05').removeClass('active');
        });
        // 上映日時フォーム
        var inputHeld = $('input[name="held"]');
        inputHeld.daterangepicker({
            timePicker: true,
            timePicker24Hour: true,
            timePickerIncrement: 10,
            startDate: $('form input[name="held_from"]').val(),
            endDate: $('form input[name="held_to"]').val(),
            locale: {
                format: 'YYYY/MM/DD HH:mm',
                //    "separator": " - ",
                "applyLabel": "決定",
                "cancelLabel": "キャンセル",
            }
        }, function (start, end, label) {
            $('form input[name="held_from"]').val(start.format('YYYY-MM-DD HH:mm:ss'));
            $('form input[name="held_to"]').val(end.format('YYYY-MM-DD HH:mm:ss'));
        });
    }
    return AdminEventForm;
}());
$(function () {
    var adminEventForm = new AdminEventForm();
});
