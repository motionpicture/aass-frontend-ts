/// <reference path="../../../typings/main.d.ts" />

class AdminEventIndex {
    private modelAcceptComplete = $('.modal.type-01');
    private modelRejectComplet = $('.modal.type-02');
    private modelCheckConfirm = $('.modal.type-03');
    private modelAcceptConfirm = $('.modal.type-04');
    // private modelRejectConfirm = $('.modal.type-03');

    private eventRow4check: any;

    constructor() {
        let self = this;

        // 動画認証を行うイベント
        $('.approval-btn a').on('click', function(e) {
            let rootRow = $(this).parent().parent().parent().parent();

            self.eventRow4check = rootRow;
            $('.user-id', self.modelCheckConfirm).text($('input[name="user_id"]', rootRow).val());
            $('.description', self.modelCheckConfirm).text($('input[name="remarks"]', rootRow).val());
            $('span.created_at', self.modelCheckConfirm).text($('input[name="media_created_at"]', rootRow).val());
            $('span.uploaded_by', self.modelCheckConfirm).text($('input[name="media_uploaded_by"]', rootRow).val());
            $('span.held_from', self.modelCheckConfirm).text($('input[name="held_from"]', rootRow).val());
            $('span.place', self.modelCheckConfirm).text($('input[name="place"]', rootRow).val());
            $('.modal-cover').addClass('active');
            self.modelCheckConfirm.addClass('active');
        });

        // 承認するイベント
        this.modelCheckConfirm.on('click', '.next-btn a', () => {
            let applicationId = $('input[name="application_id"]', self.eventRow4check).val();
            console.log('accepting... id:', applicationId);
        });
    }
}

$(() => {
    let adminEventIndex = new AdminEventIndex();
});