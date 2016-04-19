/// <reference path="../../../typings/main.d.ts" />

class MediaIndex {
    private modelDeleteConfirm = $('.modal.type-05');
    private modelDeleteComplete = $('.modal.type-06');
    private modelApplyConfirm = $('.modal.type-07');
    private modelError = $('.modal.type-08');
    private modelEditConfirm = $('.modal.type-09');
    private modelApplyComplete = $('.modal.type-10');

    private mediaRow4delete: any;
    private mediaRow4apply: any;

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
        $('.application-btn a').on('click', function(e) {
            let rootRow = $(this).parent().parent().parent().parent().parent();
            let title = $('input[name="title"]', rootRow).val();
            let id = $('input[name="id"]', rootRow).val();

            self.mediaRow4apply = rootRow;
            $('.title', self.modelApplyConfirm).text(title);
            $('.modal-cover').addClass('active');
            self.modelApplyConfirm.addClass('active');
        });

        // 申請確認はいイベント
        $(this.modelApplyConfirm).on('click', '.next-btn', () => {
            let id = $('input[name="id"]', this.mediaRow4apply).val();

            $.ajax({
                type: 'post',
                url: '/media/' + id + '/apply',
                data: {
                    media_id: id,
                    remarks: $('.text-area textarea', this.modelApplyConfirm).val()
                },
                dataType: 'json'
            })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('.modal-cover, .modal').removeClass('active');
                    alert("申請に失敗しました\n" + data.messages.join("\n"));
                } else {
                    $('.modal-cover').addClass('active');
                    $('.modal').removeClass('active');
                    this.modelApplyComplete.addClass('active');
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
            $('.modal-cover').addClass('active');
            this.modelError.addClass('active');
        });
    }
}

$(() => {
    let mediaIndex = new MediaIndex();
});