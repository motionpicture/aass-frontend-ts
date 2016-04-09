$(function(){
    $('.delete_media').on('click', function(e){
        var rootRow = $(this).parent().parent();
        var id = $('input[name="id"]', rootRow).val();

        $.ajax({
            type: 'post',
            url: '/media/' + id + '/delete',
            data: {},
            dataType: 'json'
        })
        .done(function(data) {
            // エラーメッセー時表示
            if (!data.isSuccess) {
                alert("delete fail!\n" + data.messages.join("\n"));
            } else {
                rootRow.remove();
                alert('delete success!');
            }
        })
        .fail(function() {
            alert('fail');
        })
        .always(function() {
        });;

        return false;
    });

    $('.apply_media a').on('click', function(e){
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
        });;

        return false;
    });
});