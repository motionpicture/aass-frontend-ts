/// <reference path="../../../typings/main.d.ts" />
/// <reference path="../../../definitions/main.d.ts" />

class AdminEventMedias {
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
            e.preventDefault();
            let rootRow: JQuery = $(this).parent().parent().parent();
            self.eventRow4check = rootRow;

            self.setPlayer($('input[name="media_url_streaming"]', rootRow).val());
            $('.user-id', self.modalCheckConfirm).text($('input[name="user_id"]', rootRow).val());
            $('.description', self.modalCheckConfirm).html($('input[name="application_remarks"]', rootRow).val().replace(/[\n\r]/g, "<br>"));
            $('span.created_at', self.modalCheckConfirm).text($('input[name="created_at"]', rootRow).val());
            $('span.uploaded_by', self.modalCheckConfirm).text($('input[name="uploaded_by"]', rootRow).val());
            
            self.modalCheckConfirm.find('.info').eq(2).hide();
            self.modalCheckConfirm.find('.download-btn').hide();
            self.modalCheckConfirm.find('.btn-area').hide();
            
            self.modalOpen(self.modalCheckConfirm);
        });

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
                    rootRow.find('.encode-btn').remove();
                    let encodeingDom: string = `
                        <div class="btn gray-btn encodeing-btn not-active pressed">
                            <a href="javascript:void(0);">エンコード中<div class="progress-bar"></div></a>
                        </div>`;
                    rootRow.find('.control .group').append(encodeingDom);
                }
            })
            .fail(() => {
                $('.modal-cover, .modal').removeClass('active');
                alert("エンコードに失敗しました");
            })
            .always(() => {
            });
        });

        // JPEG2000DLイベント
        $(document).on('click', '.download-jpeg2000-btn a', function(e) {
            let rootRow = $(this).parent().parent().parent().parent().parent();
            let id = $('input[name="id"]', rootRow).val();
            window.open('/admin/media/' + id + '/download/jpeg2000');
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
    let adminEventMedias = new AdminEventMedias();
});