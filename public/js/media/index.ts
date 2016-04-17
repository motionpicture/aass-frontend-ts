/// <reference path="../../../typings/main.d.ts" />

class MediaIndex {
    private modelDeleteComplete = $('.modal.type-06');

    constructor() {
        let self = this;

        // 削除イベント
        $('.remove-btn a').on('click', function(e) {
            var rootRow = $(this).parent().parent().parent().parent().parent();
            console.log(rootRow);
            var id = $('input[name="id"]', rootRow).val();

            console.log('deleting media...id:', id);
            $.ajax({
                type: 'post',
                url: '/media/' + id + '/delete',
                data: {},
                dataType: 'json'
            })
            .done(function(data) {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    alert("削除に失敗しました\n" + data.messages.join("\n"));
                } else {
                    rootRow.remove();
                    $('.modal-cover').addClass('active');
                    self.modelDeleteComplete.addClass('active');
                }
            })
            .fail(function() {
                alert("削除に失敗しました");
            })
            .always(function() {
            });
        });

        // 削除完了閉じるイベント
        this.modelDeleteComplete.on('click', '.close-btn a,.gray-btn', () => {
            $('.modal-cover, .modal').removeClass('active');
        });

        // 申請イベント
        $('.apply_media a').on('click', function(e) {
            var rootRow = $(this).parent().parent();
            var id = $('input[name="id"]', rootRow).val();

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