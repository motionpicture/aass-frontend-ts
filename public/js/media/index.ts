/// <reference path="../../../typings/main.d.ts" />

class MediaIndex {
    private modalReapply = $('.modal.type-03');
    private modalDeleteConfirm = $('.modal.type-05');
    private modalDeleteComplete = $('.modal.type-06');
    private modalApplyConfirm = $('.modal.type-07');
    private modalError = $('.modal.type-08');
    private modalEditConfirm = $('.modal.type-09');
    private modalApplyComplete = $('.modal.type-10');
    private modalCheckConfirm = $('.modal.type-11');

    private mediaRow4delete: any;
    private mediaRow4apply: any;
    private mediaRow4reapply: any;
    
    private mediaRow4check: any;

    constructor() {
        let self = this;
        
        // 動画詳細開くイベント
        $('.thumb a').on('click', function(e) {
            e.preventDefault();
            let rootRow: JQuery = $(this).parent().parent().parent();
            self.mediaRow4check = rootRow;

            self.setPlayer($('input[name="media_url_streaming"]', rootRow).val());
            $('.user-id', self.modalCheckConfirm).text($('input[name="user_id"]', rootRow).val());
            $('.description', self.modalCheckConfirm).html($('input[name="application_remarks"]', rootRow).val().replace(/[\n\r]/g, "<br>"));
            $('span.created_at', self.modalCheckConfirm).text($('input[name="created_at"]', rootRow).val());
            $('span.uploaded_by', self.modalCheckConfirm).text($('input[name="uploaded_by"]', rootRow).val());
            
            
            self.modalOpen(self.modalCheckConfirm);
        });
        

        // 削除イベント
        $('.remove-btn a').on('click', function(e) {
            let rootRow = $(this).parent().parent().parent().parent().parent();
            let title = $('input[name="title"]', rootRow).val();
            let id = $('input[name="id"]', rootRow).val();

            self.mediaRow4delete = rootRow;
            $('.title', self.modalDeleteConfirm).text(title);
            self.modalOpen(self.modalApplyConfirm);
        });

        // 削除確認はいイベント
        $(this.modalDeleteConfirm).on('click', '.next-btn', () => {
            let id = $('input[name="id"]', this.mediaRow4delete).val();
            $.ajax({
                type: 'post',
                url: '/media/' + id + '/delete',
                data: {},
                dataType: 'json'
            })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('.modal-cover, .modal').removeClass('active');
                    alert("削除に失敗しました\n" + data.messages.join("\n"));
                } else {
                    this.mediaRow4delete.remove();
                    this.modalOpen(this.modalApplyConfirm);
                }
            })
            .fail(() => {
                $('.modal-cover, .modal').removeClass('active');
                alert("削除に失敗しました");
            })
            .always(() => {
            });
        });

        // 削除完了閉じるイベント
        $('.modal .btn-area .gray-btn a').on('click', (e) => {
            $('.modal-cover, .modal').removeClass('active');
        });

        // 申請イベント
        $('.application-btn a').on('click', function(e) {
            let rootRow = $(this).parent().parent().parent().parent().parent();
            let title = $('input[name="title"]', rootRow).val();
            let id = $('input[name="id"]', rootRow).val();

            self.mediaRow4apply = rootRow;
            $('.title', self.modalApplyConfirm).text(title);
            self.modalOpen(self.modalApplyConfirm);
        });

        // 申請確認はいイベント
        $(this.modalApplyConfirm).on('click', '.next-btn', () => {
            let id = $('input[name="id"]', this.mediaRow4apply).val();
            let applicationId = $('input[name="application_id"]', this.mediaRow4apply).val();

            $.ajax({
                type: 'post',
                url: '/media/' + id + '/apply',
                data: {
                    application_id: applicationId,
                    media_id: id,
                    remarks: $('.text-area textarea', this.modalApplyConfirm).val()
                },
                dataType: 'json'
            })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('.modal-cover, .modal').removeClass('active');
                    alert("申請に失敗しました\n" + data.messages.join("\n"));
                } else {
                    this.modalOpen(this.modalApplyComplete);
                }
            })
            .fail(() => {
                $('.modal-cover, .modal').removeClass('active');
                alert("申請に失敗しました");
            })
            .always(() => {
            });
        });

        // エラーが発生しましたイベント
        $('.error-btn a').on('click', (e) => {
            this.modalOpen(this.modalError);
        });

        // 再申請のお願いイベント
        $('.reapplication-btn a').on('click', function(e) {
            let rootRow = $(this).parent().parent().parent().parent();
            let reason = $('input[name="application_reject_reason"]', rootRow).val();
            self.mediaRow4reapply = rootRow;

            $('.text-area', self.modalReapply).text(reason);
            self.modalOpen(self.modalReapply);
        });

        // 再申請のお願い閉じるイベント
        this.modalReapply.on('click', '.close-btn a, .gray-btn a', (e) => {
            let applicationId = $('input[name="application_id"]', self.mediaRow4reapply).val();

            $.ajax({
                type: 'post',
                url: '/application/' + applicationId + '/reset',
                data: {
                },
                dataType: 'json'
            })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('.modal-cover, .modal').removeClass('active');
                    alert("申請リセットに失敗しました\n" + data.messages.join("\n"));
                } else {
                    $('.modal-cover, .modal').removeClass('active');
                    location.reload();
                }
            })
            .fail(() => {
                $('.modal-cover, .modal').removeClass('active');
                alert("申請リセットに失敗しました");
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
    
    private modalOpen(target: JQuery): void {
        $('.modal-cover').addClass('active');
        $('.modal').removeClass('active');
        target.addClass('active');
        let top: number = $(window).scrollTop() + 150;
        target.css('top', String(top) + 'px');
    }
}

$(() => {
    let mediaIndex = new MediaIndex();
});