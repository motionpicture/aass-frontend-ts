/// <reference path="../../../typings/main.d.ts" />

class MediaIndex {
    private modelDeleteConfirm = $('.modal.type-05');
    private modelDeleteComplete = $('.modal.type-06');
    private mediaRow4delete: any;

    constructor() {
        let self = this;

        // 削除イベント
        $('.remove-btn a').on('click', function(e) {
            let rootRow = $(this).parent().parent().parent().parent().parent();
            let title = $('input[name="title"]', rootRow).val();
            let id = $('input[name="id"]', rootRow).val();

            self.mediaRow4delete = rootRow;
            $('.title', self.modelDeleteConfirm).text(title);
            $('.modal-cover').addClass('active');
            self.modelDeleteConfirm.addClass('active');
        });

        // 削除確認はいイベント
        $(this.modelDeleteConfirm).on('click', '.next-btn', () => {
            let id = $('input[name="id"]', this.mediaRow4delete).val();
            console.log('deleting media...id:', id);
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
                    $('.modal-cover').addClass('active');
                    $('.modal').removeClass('active');
                    this.modelDeleteComplete.addClass('active');
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
        $('.apply_media a').on('click', function(e) {
            let rootRow = $(this).parent().parent();
            let id = $('input[name="id"]', rootRow).val();

            $.ajax({
                type: 'post',
                url: '/media/' + id + '/apply',
                data: {},
                dataType: 'json'
            })
            .done(function(data) {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    alert('apply fail!');
                } else {
                    $('.apply_media').hide();
                    $('.no_apply_media').show();
                    $('.no_apply_media', rootRow).html('申請中');
                    alert('apply success!');
                }
            })
            .fail(function() {
                alert('fail');
            })
            .always(function() {
            });
        });
    }
}

$(() => {
    let mediaIndex = new MediaIndex();
});