/// <reference path="../../../typings/main.d.ts" />

class MediaForm {
    private isNew = false;
    private file = null;
    private extension = null;
    private size = null;
    private assetId = null;
    private container = null;
    private filename = null;
    private chunkSize = 4194304; // byte
    private division = null;
    private createBlobBlockTimer = null;
    private blobBlockMaxSize = 4194304; // byte
    private blobBlockUncreatedIndexes = []; // 未作成ブロックインデックス
    private blobBlockCreatedIndexes = []; // 作成済みブロックインデックス
    private blobBlockCreatingIndexes = []; // 作成中ブロックインデックス
    private messages = [];

    constructor() {
        $(document).on('click', 'form button', () => {
            $('p.error').html('');
            this.initialize();

            if (this.validate()) {
                if (this.isNew) {
                    $('#progressModal').modal('show');
                    this.createAsset();
                } else {
                    this.createMedia();
                }
            } else {
                $('p.error').append(this.messages.join('<br>'));
            }
        });
    }

    public validate() {
        if (!$('input[name="title"]', $('form')).val()) {
            this.messages.push('動画名を入力してください');
        }
        if (!$('textarea[name="description"]', $('form')).val()) {
            this.messages.push('動画概要を入力してください');
        }
        if (!$('input[name="uploaded_by"]', $('form')).val()) {
            this.messages.push('動画登録者名を入力してください');
        }
        if ($('input[name="file"]', $('form'))[0].files.length == 0) {
            this.messages.push('ファイルを選択してください');
        }

        return (this.messages.length < 1);
    }

    public initialize() {
        this.isNew = (!$('input[name="id"]', $('form')).val());
        this.assetId = null;
        this.container = null;
        this.filename = null;
    //	this.chunkSize = parseInt($('select[name="chunk_size"]', $('form')).val());
        this.division = null;
        this.createBlobBlockTimer = null;
        this.blobBlockMaxSize = parseInt($('input[name="max_block_size"]', $('form')).val());
        this.blobBlockUncreatedIndexes = [];
        this.blobBlockCreatedIndexes = [];
        this.blobBlockCreatingIndexes = [];
        this.messages = [];

        $('#progressModal').on('hidden.bs.modal', (e) => {
            this.cancelUpload();
        });
    }

    public cancelUpload() {
        if (this.createBlobBlockTimer !== null) {
            console.log('canceling upload...');
            alert('キャンセルしました');
            clearInterval(this.createBlobBlockTimer);
        }
    }

    public showProgress = function(text) {
        $('#progressModal .modal-body p').html(text);
    }

    public loadFile(blockIndex) {
        var readPos = this.chunkSize * blockIndex;
        var endPos = readPos + this.chunkSize;
        if (endPos > this.size) {
            endPos = this.size;
        }

        var blob;
        // chunk可能なAPIを保持しているかチェック
        if (this.file.slice) {
            blob = this.file.slice(readPos, endPos);
        } else if(this.file.webkitSlice) {
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
        var formData = new FormData();
        formData.append('file', fileData);
        formData.append('extension', this.extension);
        formData.append('container', this.container);
        formData.append('filename', this.filename);

        var startIndex = blockIndex * Math.floor(this.chunkSize / this.blobBlockMaxSize);
        formData.append('index', startIndex);

        var ajax = $.ajax({
            url: '/media/appendFile',
            method: 'post',
    //        timeout: 25000,
            dataType: 'json',
            data: formData,
            processData: false, // Ajaxがdataを整形しない指定
            contentType: false // contentTypeもfalseに指定
        })
        .done((data) => {
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

                var blobBlockCreatedCount = this.blobBlockCreatedIndexes.length;
                console.log('blobBlockCreatedCount:' + blobBlockCreatedCount);

                var rate = Math.floor(blobBlockCreatedCount * 100 / this.division);
                this.showProgress(rate + '% (' + blobBlockCreatedCount + '/' + this.division + ') をアップロードしました...');
                // ブロブブロックを全て作成したらコミット
                if (blobBlockCreatedCount == this.division) {
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
        this.showProgress('ブロブブロックをコミットします...');

        var formData = new FormData();
        formData.append('extension', this.extension);
        formData.append('asset_id', this.assetId);
        formData.append('container', this.container);
        formData.append('filename', this.filename);
        var blockCount = Math.ceil(this.size / this.blobBlockMaxSize);
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
                this.showProgress('ファイルアップロード完了');

                // DB登録
                this.createMedia();
            }
        })
        .fail(() => {
            alert('fail');
        })
        .always(() => {
        });
    }

    public createAsset() {
        this.file = $('input[name="file"]', $('form'))[0].files[0];
        f = this.file.name.split('.');
        this.extension = f[f.length-1];
        this.size = parseInt(this.file.size);
        this.division = Math.ceil(this.size / this.chunkSize);
        console.log(this.file, this.extension, this.size, this.division);
        for (var i=0; i<this.division; i++) {
            this.blobBlockUncreatedIndexes.push(i);
        }

        this.showProgress('ブロブを準備しています...');

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
                console.log(data.params);
                this.assetId = data.params.assetId;
                this.container = data.params.container;
                this.filename = data.params.filename;

                // 定期的にブロブブロック作成
                this.showProgress(this.chunkSize + 'byteごとに分割アップロードします...');
                this.createBlobBlockTimer = setInterval(() => {
                    // 回線が遅い場合、アクセスがたまりすぎないように調整(ブラウザ同時接続数を考慮)
                    if (this.blobBlockCreatingIndexes.length > 2) {
                        return;
                    }

                    if (this.blobBlockUncreatedIndexes.length > 0) {
                        var nextIndex = this.blobBlockUncreatedIndexes[0];
                        console.log('nextIndex:' + nextIndex);
                        this.blobBlockCreatingIndexes.push(nextIndex);
                        this.blobBlockUncreatedIndexes.shift();
                        this.loadFile(nextIndex);
                    }
                }, 300);
            }
        })
        .fail(() => {
            alert('fail');
        })
        .always(() => {
        });
    }

    public createMedia() {
        this.showProgress('DBに登録します...');
        var formData = new FormData();
        formData.append('id', $('input[name="id"]', $('form')).val());
        formData.append('title', $('input[name="title"]', $('form')).val());
        formData.append('description', $('textarea[name="description"]', $('form')).val());
        formData.append('uploaded_by', $('input[name="uploaded_by"]', $('form')).val());
        formData.append('extension', this.extension);
        formData.append('size', this.size);
        formData.append('asset_id', this.assetId);
        formData.append('filename', this.filename);

        $.ajax({
            url: '/media/create',
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
                this.showProgress('登録完了');
            }
        })
        .fail(() => {
            alert('fail');
        })
        .always(() => {
            // if (this.isNew) {
            //     $('.progress').hide();
            // }
        });
    }
}

$(() => {
    let mediaForm = new MediaForm();
});