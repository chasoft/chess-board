var PIECE_SET = {
    WP: '&#9817', WR: '&#9814', WN: '&#9816', WB: '&#9815', WQ: '&#9813', WK: '&#9812',
    BP: '&#9823', BR: '&#9820', BN: '&#9822', BB: '&#9821', BQ: '&#9819', BK: '&#9818',
};

var EMPTY = '';
var BOARD_COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var BOARD_ROWS = ['8', '7', '6', '5', '4', '3', '2', '1'];

createBoard = function() {
    return {messages: [{text: "Game on!", isMove: false}], pieces:
                {a8: PIECE_SET.BR, b8: PIECE_SET.BN, c8: PIECE_SET.BB, d8: PIECE_SET.BQ, e8: PIECE_SET.BK, f8: PIECE_SET.BB, g8: PIECE_SET.BN, h8: PIECE_SET.BR,
                    a7: PIECE_SET.BP, b7: PIECE_SET.BP, c7: PIECE_SET.BP, d7: PIECE_SET.BP, e7: PIECE_SET.BP, f7: PIECE_SET.BP, g7: PIECE_SET.BP, h7: PIECE_SET.BP,
                    a6: "", b6: "", c6: "", d6: "", e6: "", f6: "", g6: "", h6: "",
                    a5: "", b5: "", c5: "", d5: "", e5: "", f5: "", g5: "", h5: "",
                    a4: "", b4: "", c4: "", d4: "", e4: "", f4: "", g4: "", h4: "",
                    a3: "", b3: "", c3: "", d3: "", e3: "", f3: "", g3: "", h3: "",
                    a2: PIECE_SET.WP, b2: PIECE_SET.WP, c2: PIECE_SET.WP, d2: PIECE_SET.WP, e2: PIECE_SET.WP, f2: PIECE_SET.WP, g2: PIECE_SET.WP, h2: PIECE_SET.WP,
                    a1: PIECE_SET.WR, b1: PIECE_SET.WN, c1: PIECE_SET.WB, d1: PIECE_SET.WQ, e1: PIECE_SET.WK, f1: PIECE_SET.WB, g1: PIECE_SET.WN, h1: PIECE_SET.WR
                }
    };
};

Handlebars.registerHelper('render_board', function(pieces) {
    var boardHtml = '<table id="chess_board" cellpadding="0" cellspacing="0">';
    for (var row in BOARD_ROWS) {
        var rowHtml = "<tr>";
        for (var col in BOARD_COLS) {
            var pos = BOARD_COLS[col] + BOARD_ROWS[row];
            var pieceHtml = pieces[pos] ? '<div class=piece draggable=true title="Drag to move. Ctrl+Click to remove.">' + pieces[pos] + '</div>' : "";
            rowHtml = rowHtml + '<td class=dropzone id=' + pos + '>' + pieceHtml + '</td>';
        }
        boardHtml = boardHtml + rowHtml + "</tr>";
    }
    return boardHtml + "</table>";
});

Handlebars.registerHelper('render_piece', function(piece) {
    return "<div class=offboard_piece draggable=true title='Drag to add to the board.'>" + PIECE_SET[piece.toUpperCase()] + "</div>";
});