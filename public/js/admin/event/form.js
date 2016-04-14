/// <reference path="../../../typings/main.d.ts" />
var AdminEventForm = (function () {
    function AdminEventForm() {
        // 登録イベント
        $('form .gray-btn.next-btn').on('click', function (e) {
            $('form').submit();
        });
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
