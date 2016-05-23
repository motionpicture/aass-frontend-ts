/// <reference path="../../typings/index.d.ts" />

class AdminModals {
    private coverNode = $('.modal-cover');
    private modalNode = $('.modal');

    constructor() {
        let self = this;

        // モーダル閉じるイベント
        $('.modal .close-btn a').on('click', (e) => {
            e.preventDefault();
            this.coverNode.removeClass('active');
            this.modalNode.removeClass('active');
            // location.redirect();
        });

        // いいえイベント
        $('.modal .btn-area .prev-btn a').on('click', (e) => {
            e.preventDefault();
            this.coverNode.removeClass('active');
            this.modalNode.removeClass('active');
        });
    }
}

$(() => {
    let adminModals = new AdminModals();
});