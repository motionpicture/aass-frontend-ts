/// <reference path="../../../typings/main.d.ts" />

class AdminEventForm {
    constructor() {
        // 登録イベント
        $('form .gray-btn.next-btn').on('click', function(e) {
            $('form').submit();
        });

        let inputHeld: any = $('input[name="held"]');
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
                // "fromLabel": "From",
                // "toLabel": "To",
                // "customRangeLabel": "Custom",
            }
        }, function(start, end, label)
        {
            $('form input[name="held_from"]').val(start.format('YYYY-MM-DD HH:mm:ss'));
            $('form input[name="held_to"]').val(end.format('YYYY-MM-DD HH:mm:ss'));
        });
    }
}

$(() => {
    let adminEventForm = new AdminEventForm();
});