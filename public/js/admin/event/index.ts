/// <reference path="../../../typings/main.d.ts" />

class AdminEventIndex {
    private modalAcceptComplete = $('.modal.type-01');
    private modalRejectComplete = $('.modal.type-02');
    private modalCheckConfirm = $('.modal.type-03');
    private modalAcceptConfirm = $('.modal.type-04');
    private modalRejectConfirm = $('.modal.type-07');

    private eventRow4check: any;

    constructor() {
        let self = this;

        // 動画詳細開くイベント
        $('.thumb a').on('click', function(e) {
            let rootRow = $(this).parent().parent().parent();
            self.eventRow4check = rootRow;

            self.setPlayer($('input[name="media_url_streaming"]', rootRow).val());
            $('.user-id', self.modalCheckConfirm).text($('input[name="user_id"]', rootRow).val());
            $('.description', self.modalCheckConfirm).html($('input[name="remarks"]', rootRow).val().replace(/[\n\r]/g, "<br>"));
            $('span.created_at', self.modalCheckConfirm).text($('input[name="media_created_at"]', rootRow).val());
            $('span.uploaded_by', self.modalCheckConfirm).text($('input[name="media_uploaded_by"]', rootRow).val());
            $('span.held_from', self.modalCheckConfirm).text($('input[name="held_from"]', rootRow).val());
            $('span.place', self.modalCheckConfirm).text($('input[name="place"]', rootRow).val());

            $('.modal-cover').addClass('active');
            $('.modal').removeClass('active');
            self.modalCheckConfirm.addClass('active');
        });

        // 動画詳細開くイベント
        $('.approval-btn a').on('click', function(e) {
            let rootRow = $(this).parent().parent().parent().parent();
            self.eventRow4check = rootRow;

            self.setPlayer($('input[name="media_url_streaming"]', rootRow).val());
            $('.user-id', self.modalCheckConfirm).text($('input[name="user_id"]', rootRow).val());
            $('.description', self.modalCheckConfirm).text($('input[name="remarks"]', rootRow).val());
            $('span.created_at', self.modalCheckConfirm).text($('input[name="media_created_at"]', rootRow).val());
            $('span.uploaded_by', self.modalCheckConfirm).text($('input[name="media_uploaded_by"]', rootRow).val());
            $('span.held_from', self.modalCheckConfirm).text($('input[name="held_from"]', rootRow).val());
            $('span.place', self.modalCheckConfirm).text($('input[name="place"]', rootRow).val());

            $('.modal-cover').addClass('active');
            $('.modal').removeClass('active');
            self.modalCheckConfirm.addClass('active');
        });

        // 承認するイベント
        this.modalCheckConfirm.on('click', '.next-btn a', () => {
            $('.date dd', self.modalAcceptConfirm).text($('input[name="held_from"]', this.eventRow4check).val());
            $('.screen dd', self.modalAcceptConfirm).text($('input[name="held_from"]', this.eventRow4check).val());
            $('.title dd', self.modalAcceptConfirm).text($('input[name="media_title"]', this.eventRow4check).val());
            $('.time dd', self.modalAcceptConfirm).text();
            $('.user dd', self.modalAcceptConfirm).text($('input[name="media_uploaded_by"]', this.eventRow4check).val());
            $('.description dd', self.modalAcceptConfirm).text($('input[name="media_description"]', this.eventRow4check).val());

            $('.modal-cover').addClass('active');
            $('.modal').removeClass('active');
            this.modalAcceptConfirm.addClass('active');
        });

        // 否認するイベント
        this.modalCheckConfirm.on('click', '.prev-btn a', () => {
            $('.modal-cover').addClass('active');
            $('.modal').removeClass('active');
            this.modalRejectConfirm.addClass('active');
        });

        // ダウンロードイベント
        this.modalCheckConfirm.on('click', '.download-btn a', () => {
            let mediaId = $('input[name="media_id"]', this.eventRow4check).val();
            window.open('/admin/media/' + mediaId + '/download');
        });

        // 承認決定イベント
        this.modalAcceptConfirm.on('click', '.next-btn a', () => {
            let applicationId = $('input[name="application_id"]', this.eventRow4check).val();

            console.log('accepting... id:', applicationId);
            $.ajax({
                type: 'post',
                url: '/admin/application/' + applicationId + '/accept',
                data: {},
                dataType: 'json'
            })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('.modal-cover, .modal').removeClass('active');
                    alert("承認に失敗しました\n" + data.messages.join("\n"));
                } else {
                    $('.modal-cover').addClass('active');
                    $('.modal').removeClass('active');
                    this.modalAcceptComplete.addClass('active');
                }
            })
            .fail(() => {
                $('.modal-cover, .modal').removeClass('active');
                alert("承認に失敗しました");
            })
            .always(() => {
            });
        });

        // 否認決定イベント
        this.modalRejectConfirm.on('click', '.next-btn a', () => {
            let applicationId = $('input[name="application_id"]', this.eventRow4check).val();

            console.log('rejecting... id:', applicationId);
            console.log('reason:', $('textarea', this.modalRejectConfirm).val());
            $.ajax({
                type: 'post',
                url: '/admin/application/' + applicationId + '/reject',
                data: {
                    reason: $('textarea', this.modalRejectConfirm).val()
                },
                dataType: 'json'
            })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('.modal-cover, .modal').removeClass('active');
                    alert("否認に失敗しました\n" + data.messages.join("\n"));
                } else {
                    $('.modal-cover').addClass('active');
                    $('.modal').removeClass('active');
                    this.modalRejectComplete.addClass('active');
                }
            })
            .fail(() => {
                $('.modal-cover, .modal').removeClass('active');
                alert("否認に失敗しました");
            })
            .always(() => {
            });
        });

        // JPEG2000エンコードイベント
        $(document).on('click', '.encode-btn a', function(e) {
            let rootRow = $(this).parent().parent().parent().parent();
            let mediaId = $('input[name="media_id"]', rootRow).val();

            console.log('starting encode to jpeg2000... id:', mediaId);
            $.ajax({
                type: 'post',
                url: '/admin/media/' + mediaId + '/encode2jpeg2000',
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
    let adminEventIndex = new AdminEventIndex();
});