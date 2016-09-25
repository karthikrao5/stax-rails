$(function () {
    var Aladdin = new blk.API({});
    var $table = $('#displayTable');
    var $rows = $('#rows');
    var $search = $('#search');
    var table;

    function submit(query, rows, columnOrder) {
        if (table) {
            table.destroy();
            table = null;
        }
        $table.html('<p>Searching...</p>');
        Aladdin.searchSecurities({
            query: query,
            rows: rows || 100,
            useDefaultDocumentType: true
        }, function (data) {
            var securities = data.resultMap.SEARCH_RESULTS[0].resultList;
            var columns = columnOrder || [];
            
            var tableData = securities.map(function (sec) {
                return columns.map(function (col) {
                    return col == 'score' ? sec[col].toFixed(3) : sec[col] || '-';
                });
            });
            if (table) {
                table.destroy();
            }
            $table.empty();
            table = $table.DataTable({
                data: tableData,
                columns: columns.map(function (col) {
                    return {
                        title: StringUtil.camelToHuman(col) + '\n(' + col + ')'
                    }
                }),
                order: [
                    [0, 'desc']
                ]
            });
        });
    }

    var colOrder = ['score', 'description', 'asOfDate', 'ticker', 'totalMarketCap', 'gics1sector', "assetType"];
    var searchTimeout;

    function delayedSearch(delay) {
        window.clearTimeout(searchTimeout);
        searchTimeout = window.setTimeout(submit.bind(this, $search.val(), $rows.val(), skipCols, colOrder), delay);
    }

    $search.on('input', delayedSearch.bind($search[0], 250));
    $('#submit').click(delayedSearch.bind($search[0], 0));

    submit($search.val(), $rows.val(), colOrder);

});
