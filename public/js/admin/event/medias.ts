/// <reference path="../../../typings/main.d.ts" />

class AdminEventMedias {
    private modalAcceptComplete = $('.modal.type-01');
    private modalRejectComplete = $('.modal.type-02');
    private modalCheckConfirm = $('.modal.type-03');
    private modalAcceptConfirm = $('.modal.type-04');
    private modalRejectConfirm = $('.modal.type-07');

    private eventRow4check: any;

    constructor() {
        let self = this;

        // ダウンロードイベント
        $(document).on('click', '.original-btn a', function(e) {
            let rootRow = $(this).parent().parent().parent().parent().parent();
            let id = $('input[name="id"]', rootRow).val();
            window.open('/admin/media/' + id + '/download');
        });

        // JPEG2000エンコードイベント
        $(document).on('click', '.encode-btn a', function(e) {
            let rootRow = $(this).parent().parent().parent().parent().parent();
            let id = $('input[name="id"]', rootRow).val();

            console.log('starting encode to jpeg2000... id:', id);
            $.ajax({
                type: 'post',
                url: '/admin/media/' + id + '/encode2jpeg2000',
                data: {},
                dataType: 'json'
            })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('.modal-cover, .modal').removeClass('active');
                    alert("エンコードに失敗しました\n" + data.messages.join("\n"));
                } else {
                    alert('エンコードを開始しました');
                }
            })
            .fail(() => {
                $('.modal-cover, .modal').removeClass('active');
                alert("エンコードに失敗しました");
            })
            .always(() => {
            });
        });
    }

    private setPlayer(src) {
        let videoOptions = {
            "nativeControlsForTouch": false,
            controls: true,
            autoplay: false,
            width: "600",
            height: "300",
        }
        let player = amp("azuremediaplayer", videoOptions);
        player.src([
            {
                "src": src,
                "type": "application/vnd.ms-sstr+xml"
            }
        ]);
    }
}

$(() => {
    let adminEventMedias = new AdminEventMedias();
});