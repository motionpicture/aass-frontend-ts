/// <reference path="../../../typings/main.d.ts" />

class MediaForm {
    private isNew: boolean = false;
    private isCanceled: boolean = false;
    private file: any = null;

    private id: string = null;
    private assetId: string = null;
    private filename: string = null;
    private extension: string = null;
    private size: number = null;

    private container: string = null;
    private chunkSize = 4194304; // byte
    private division: number = null;
    private createBlobBlockTimer = null;
    private blobBlockMaxSize: number = 4194304; // byte
    private blobBlockUncreatedIndexes: Array<any> = []; // 未作成ブロックインデックス
    private blobBlockCreatedIndexes: Array<any> = []; // 作成済みブロックインデックス
    private blobBlockCreatingIndexes: Array<any> = []; // 作成中ブロックインデックス

    private messages: Array<string> = [];

    constructor() {
        // 動画登録イベント
        $(document).on('click', 'form .next-btn', () => {
            this.initialize();

            if (this.validate()) {
                if (this.isNew) {
                    this.informProgress();
                    this.createAsset();
                } else {
                    this.createMedia();
                }
            } else {
                let html: string = '<ul>';
                this.messages.forEach((message) => {
                    html += '<li>' + message + '</li>';
                });
                html += '</ul>';
                $('.validation').html(html);
            }
        });

        // アップロードキャンセルイベント
        $(document).on('click', '.modal.type-01 .close-btn a', () => {
            this.cancelUpload();
            $('.modal-cover, .modal').removeClass('active');
        });

        // 戻るイベント

        // ファイル選択イベント
        $(document).on('change', 'form input[name="file"]', () => {
            // var file = this.files[0];

            let inputElement: any = $('form input[name="file"]')[0];
            this.file = inputElement.files[0];
            if (this.file != null) {
                $('.file-value').text(this.file.name);
                let f = this.file.name.split('.');
                $('form input[name="extension"]').val(f[f.length - 1]);
                $('form input[name="size"]').val(this.file.size);
                // this.extension = f[f.length-1];
                // this.size = parseInt(this.file.size);
                // this.division = Math.ceil(this.size / this.chunkSize);
            }
        });
    }

    private validate() {
        if (!$('input[name="title"]', $('form')).val()) {
            this.messages.push('動画名が未入力です。');
        }
        if (!$('textarea[name="description"]', $('form')).val()) {
            this.messages.push('動画概要が未入力です。');
        }
        if (!$('input[name="uploaded_by"]', $('form')).val()) {
            this.messages.push('動画登録者名が未登録です。');
        }

        if (this.isNew) {
            let inputElement: any = $('form input[name="file"]')[0];
            if (inputElement.files.length == 0) {
                this.messages.push('動画が未登録です。');
            }
        }

        return (this.messages.length < 1);
    }

    public initialize() {
        $('.validation').html('');
        $('.modal .progress-bar .progress-inner').width('0%');

        this.isNew = (!$('input[name="id"]', $('form')).val());
        this.isCanceled = false;
        this.assetId = null;
        this.container = null;
        this.filename = null;
        this.createBlobBlockTimer = null;
        this.id = $('input[name="id"]', $('form')).val();
        this.assetId = $('input[name="asset_id"]', $('form')).val();
        this.filename = $('input[name="filename"]', $('form')).val();
        this.extension = $('input[name="extension"]', $('form')).val();
        this.size = parseInt($('input[name="size"]', $('form')).val());


        this.division = Math.ceil(this.size / this.chunkSize);
        this.blobBlockMaxSize = parseInt($('input[name="max_block_size"]', $('form')).val());
        this.blobBlockUncreatedIndexes = [];
        this.blobBlockCreatedIndexes = [];
        this.blobBlockCreatingIndexes = [];
        this.messages = [];
    }

    private byteFormat(byte: number, formatTarget: string): number {
        let result: number;
        let format = {
            KB: 1,
            MB: 2,
            GB: 3
        };
        let truncation: number = Math.pow(10, 2);
        let tmp: number = byte / Math.pow(1000, format[formatTarget]);
        result = Math.floor(tmp * truncation) / truncation;
        return result;
    }
    
    

    private cancelUpload() {
        this.isCanceled = true;

        if (this.createBlobBlockTimer !== null) {
            console.log('canceling upload...');
            clearInterval(this.createBlobBlockTimer);
        }
    }

    /**
     * 進捗を更新する
     */
    private informProgress(): void {
        console.log('updating progress...');
        $('.modal-cover').addClass('active');
        if (!$('.modal.type-01').hasClass('active')) {
            $('.modal').removeClass('active');
            $('.modal.type-01').addClass('active');
        }

        let blobBlockCreatedCount = this.blobBlockCreatedIndexes.length;
        console.log('blobBlockCreatedCount:' + blobBlockCreatedCount);

        let rate = Math.floor(blobBlockCreatedCount * 100 / this.division);
        $('.modal .progress-bar .progress-inner').width(rate + '%');

        let uploadedSize = (blobBlockCreatedCount < this.division) ? this.chunkSize * blobBlockCreatedCount : this.size;
        let uploadStr: string = this.byteFormat(uploadedSize, 'MB') + 'MB / ' + this.byteFormat(this.size, 'MB') + 'MB';
        $('.modal .progress-bar-text').html(uploadStr);
    }

    /**
     * 失敗をお知らせする
     */
    private informFailure() {
        $('.modal-cover').addClass('active');
        if (!$('.modal.type-08').hasClass('active')) {
            $('.modal').removeClass('active');
            $('.modal.type-08').addClass('active');
        }
    }

    public loadFile(blockIndex) {
        let readPos = this.chunkSize * blockIndex;
        let endPos = readPos + this.chunkSize;
        if (endPos > this.size) {
            endPos = this.size;
        }

        let blob;
        // chunk可能なAPIを保持しているかチェック
        if (this.file.slice) {
            blob = this.file.slice(readPos, endPos);
        } else if (this.file.webkitSlice) {
            blob = this.file.webkitSlice(readPos, endPos);
        } else if (this.file.mozSlice) {
            blob = this.file.mozSlice(readPos, endPos);
        } else {
            alert('The File APIs are not Slice supported in this browser.');
            return false;
        }

        this.createBlobBlock(blob, blockIndex);
    }

    public createBlobBlock(fileData, blockIndex) {
        let formData = new FormData();
        formData.append('file', fileData);
        formData.append('extension', this.extension);
        formData.append('container', this.container);
        formData.append('filename', this.filename);

        let startIndex = blockIndex * Math.floor(this.chunkSize / this.blobBlockMaxSize);
        formData.append('index', startIndex);

        let ajax = $.ajax({
            url: '/media/appendFile',
            method: 'post',
            //        timeout: 25000,
            dataType: 'json',
            data: formData,
            processData: false, // Ajaxがdataを整形しない指定
            contentType: false // contentTypeもfalseに指定
        })
            .done((data) => {
                if (this.isCanceled) {
                    return;
                }

                // エラーメッセー時表示
                if (!data.isSuccess) {
                    // リトライ
                    this.blobBlockUncreatedIndexes.push(blockIndex);
                    this.blobBlockCreatingIndexes.splice(this.blobBlockCreatingIndexes.indexOf(blockIndex), 1);
                } else {
                    // 結果保存
                    console.log('created. index:' + blockIndex);

                    this.blobBlockCreatedIndexes.push(blockIndex);
                    this.blobBlockCreatingIndexes.splice(this.blobBlockCreatingIndexes.indexOf(blockIndex), 1);

                    this.informProgress();

                    // ブロブブロックを全て作成したらコミット
                    if (this.blobBlockCreatedIndexes.length == this.division) {
                        clearInterval(this.createBlobBlockTimer);
                        this.createBlobBlockTimer = null;

                        // コミット
                        this.commitFile();
                    }
                }
            })
            .fail(() => {
                // リトライ
                this.blobBlockUncreatedIndexes.push(blockIndex);
                this.blobBlockCreatingIndexes.splice(this.blobBlockCreatingIndexes.indexOf(blockIndex), 1);
                // 3度までリトライ?
                // if (tryCount < 3) {
                //     this.loadFile(this, blockIndex, tryCount + 1);
                // } else {
                //     // タイマークリア
                //     clearInterval(this.createBlobBlockTimer);
                //     this.createBlobBlockTimer = null;
                //     alert('ブロブブロックを作成できませんでした blockIndex:' + blockIndex);
                // }
            })
            .always(() => {
                // ajaxリストから削除
                // delete this.blobBlockCreatingAjaxes[blockIndex];
            });
        // ajaxリストに追加
        // this.blobBlockCreatingAjaxes[blockIndex] = ajax;
    }

    public commitFile() {
        console.log('comitting BlobBlocks...');

        let formData = new FormData();
        formData.append('extension', this.extension);
        formData.append('asset_id', this.assetId);
        formData.append('container', this.container);
        formData.append('filename', this.filename);
        let blockCount = Math.ceil(this.size / this.blobBlockMaxSize);
        formData.append('blockCount', blockCount);

        $.ajax({
            url: '/media/commitFile',
            method: 'post',
            dataType: 'json',
            data: formData,
            processData: false, // Ajaxがdataを整形しない指定
            contentType: false // contentTypeもfalseに指定
        })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('p.error').append(data.messages.join('<br>'));
                } else {
                    console.log('upload completed.');

                    // DB登録
                    this.createMedia();
                }
            })
            .fail(() => {
                this.informFailure();
            })
            .always(() => {
            });
    }

    public createAsset() {
        for (let i = 0; i < this.division; i++) {
            this.blobBlockUncreatedIndexes.push(i);
        }

        console.log('creating asset...');
        $.ajax({
            url: '/media/createAsset',
            method: 'post',
            dataType: 'json',
            data: {},
            processData: false, // Ajaxがdataを整形しない指定
            contentType: false // contentTypeもfalseに指定
        })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('p.error').append(data.messages.join('<br>'));
                } else {
                    // アセットIDとファイル名を取得
                    console.log('asset created. params:', data.params);
                    this.assetId = data.params.assetId;
                    this.container = data.params.container;
                    this.filename = data.params.filename;

                    // 定期的にブロブブロック作成
                    console.log('uploading... chunkSize:', this.chunkSize);
                    this.createBlobBlockTimer = setInterval(() => {
                        // 回線が遅い場合、アクセスがたまりすぎないように調整(ブラウザ同時接続数を考慮)
                        if (this.blobBlockCreatingIndexes.length > 2) {
                            return;
                        }

                        if (this.blobBlockUncreatedIndexes.length > 0) {
                            let nextIndex = this.blobBlockUncreatedIndexes[0];
                            console.log('nextIndex:' + nextIndex);
                            this.blobBlockCreatingIndexes.push(nextIndex);
                            this.blobBlockUncreatedIndexes.shift();
                            this.loadFile(nextIndex);
                        }
                    }, 300);
                }
            })
            .fail(() => {
                this.informFailure();
            })
            .always(() => {
            });
    }

    private createMedia() {
        console.log('inserting or updating...');
        let formData = new FormData();
        formData.append('id', $('input[name="id"]', $('form')).val());
        formData.append('title', $('input[name="title"]', $('form')).val());
        formData.append('description', $('textarea[name="description"]', $('form')).val());
        formData.append('uploaded_by', $('input[name="uploaded_by"]', $('form')).val());
        formData.append('extension', this.extension);
        formData.append('size', this.size);
        formData.append('asset_id', this.assetId);
        formData.append('filename', this.filename);

        $.ajax({
            url: location.href,
            method: 'post',
            dataType: 'json',
            data: formData,
            processData: false, // Ajaxがdataを整形しない指定
            contentType: false // contentTypeもfalseに指定
        })
            .done((data) => {
                // エラーメッセー時表示
                if (!data.isSuccess) {
                    $('p.error').append(data.messages.join('<br>'));
                } else {
                    // フォームを空に
                    if (this.isNew) {
                        $('input[name="title"]', $('form')).val('');
                        $('textarea[name="description"]', $('form')).val('');
                        $('input[name="uploaded_by"]', $('form')).val('');
                        $('input[name="file"]', $('form')).val('');
                    }

                    $('.modal').removeClass('active');
                    $('.modal-cover, .modal.type-02').addClass('active');
                }
            })
            .fail(() => {
                this.informFailure();
            })
            .always(() => {
            });
    }
}

$(() => {
    let mediaForm = new MediaForm();
});