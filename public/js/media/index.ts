/// <reference path="../../../typings/main.d.ts" />

class MediaIndex {
    constructor() {
        this.initialize();
    }

    public initialize(): void {
        console.log('adding event delete_media...');
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
                    $('.modal-cover, .modal.type-06').addClass('active');
                }
            })
            .fail(function() {
                alert("削除に失敗しました");
            })
            .always(function() {
            });
        });

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