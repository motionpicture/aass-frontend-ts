/// <reference path="../../typings/main.d.ts" />

class Modals {
    private coverNode = $('.modal-cover');
    private modalNode = $('.modal');

    constructor() {
        let self = this;

        // モーダル閉じるイベント
        $('.modal .close-btn a').on('click', (e) => {
            this.coverNode.removeClass('active');
            this.modalNode.removeClass('active');
            // location.redirect();
        });

        // いいえイベント
        $('.modal .btn-area .prev-btn a').on('click', (e) => {
            this.coverNode.removeClass('active');
            this.modalNode.removeClass('active');
        });
    }
}

$(() => {
    let modals = new Modals();
});