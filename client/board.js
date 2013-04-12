var PIECE_SET = {
    WP: '&#9817', WR: '&#9814', WN: '&#9816', WB: '&#9815', WQ: '&#9813', WK: '&#9812',
    BP: '&#9823', BR: '&#9820', BN: '&#9822', BB: '&#9821', BQ: '&#9819', BK: '&#9818',
};

var EMPTY = '';
var BOARD_COLS = {false:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], true:['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']};
var BOARD_ROWS = {false:['8', '7', '6', '5', '4', '3', '2', '1'], true:['1', '2', '3', '4', '5', '6', '7', '8']};

createBoard = function() {
    return {messages: [{text: "Game on!", isMove: false}], pieces:
                {A8: PIECE_SET.BR, B8: PIECE_SET.BN, C8: PIECE_SET.BB, D8: PIECE_SET.BQ, E8: PIECE_SET.BK, F8: PIECE_SET.BB, G8: PIECE_SET.BN, H8: PIECE_SET.BR,
                    A7: PIECE_SET.BP, B7: PIECE_SET.BP, C7: PIECE_SET.BP, D7: PIECE_SET.BP, E7: PIECE_SET.BP, F7: PIECE_SET.BP, G7: PIECE_SET.BP, H7: PIECE_SET.BP,
                    A6: "", B6: "", C6: "", D6: "", E6: "", F6: "", G6: "", H6: "",
                    A5: "", B5: "", C5: "", D5: "", E5: "", F5: "", G5: "", H5: "",
                    A4: "", B4: "", C4: "", D4: "", E4: "", F4: "", G4: "", H4: "",
                    A3: "", B3: "", C3: "", D3: "", E3: "", F3: "", G3: "", H3: "",
                    A2: PIECE_SET.WP, B2: PIECE_SET.WP, C2: PIECE_SET.WP, D2: PIECE_SET.WP, E2: PIECE_SET.WP, F2: PIECE_SET.WP, G2: PIECE_SET.WP, H2: PIECE_SET.WP,
                    A1: PIECE_SET.WR, B1: PIECE_SET.WN, C1: PIECE_SET.WB, D1: PIECE_SET.WQ, E1: PIECE_SET.WK, F1: PIECE_SET.WB, G1: PIECE_SET.WN, H1: PIECE_SET.WR
                }
    };
};

Handlebars.registerHelper('render_board', function(pieces) {
    var boardHtml = '<table id="chess_board" cellpadding="0" cellspacing="0">';
    var reverse = Session.get("reverse_board");
    for (var row in BOARD_ROWS[reverse]) {
        var rowHtml = "<tr>";
        for (var col in BOARD_COLS[reverse]) {
            var pos = BOARD_COLS[reverse][col].toUpperCase() + BOARD_ROWS[reverse][row].toUpperCase();
            var pc = pieces[pos.toUpperCase()] || pieces[pos.toLowerCase()];
            var pieceHtml = pc ? '<div class=piece draggable=true title="Drag to move. Ctrl+Click to remove.">' + pc + '</div>' : "";
            rowHtml = rowHtml + '<td class=dropzone id=' + pos + '>' + pieceHtml + '</td>';
        }
        boardHtml = boardHtml + rowHtml + "</tr>";
    }
    return boardHtml + "</table>";
});

Handlebars.registerHelper('render_piece', function(piece) {
    return "<div class=offboard_piece draggable=true title='Drag to add to the board.'>" + PIECE_SET[piece.toUpperCase()] + "</div>";
});