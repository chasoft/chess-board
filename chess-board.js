var PIECE_SET = {
    WP: "&#9817", WR: "&#9814", WN: "&#9816", WB: "&#9815", WQ: "&#9813", WK: "&#9812",
    BP: "&#9823", BR: "&#9820", BN: "&#9822", BB: "&#9821", BQ: "&#9819", BK: "&#9818",
    EMPTY: ""
};

//var BOARD_COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
//var BOARD_ROWS = ['1', '2', '3', '4', '5', '6', '7', '8'];

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

Games = new Meteor.Collection("games");
if (Meteor.isClient) {
    Handlebars.registerHelper('render_piece', function(piece) {
        var result = "<span class='piece' draggable='true'>";
        return piece ? new Handlebars.SafeString(result + piece + "</span>") : "";
    });

    Meteor.Router.add({
        '/': 'start',
        '/board/:id': function(id) {
            console.log("board id is", id);
            Session.set('boardId', id);
            return 'board';
        },
        '*': 'not_found'
    });

    Template.board.game = function() {
        return Games.findOne({_id: Session.get('boardId')});
    };

    Template.board.events = {
        'keypress input#message': function(e) {
            if (e.charCode == '13') {
                var msg = $('input#message').val();
                var game = Games.findOne({_id: Session.get('boardId')});
                var messages = game.messages;
                if (m = msg.match(/^([abcdefgh][12345678])-([abcdefgh][12345678])$/i)) {
                    move(game.pieces, m[1], m[2]);
                    messages.push({text: msg, isMove: true});
                } else if (m = msg.match(/^([w|b][p|r|n|b|q|k]|empty)@([abcdefgh][12345678])$/i)) {
                    game.pieces[m[2]] = PIECE_SET[m[1].toUpperCase()];
                    messages.push({text: msg, isMove: true});
                } else {
                    messages.push({text: msg, isMove: false});
                }
                Games.update({_id: Session.get('boardId')}, {$set: {pieces: game.pieces, messages: messages}});
                $('input#message').val("");
            }
        }
    };

    Template.navigation.events = {
        'click button#reset': function() {
            Games.update({_id: Session.get('boardId')}, {$set: createBoard()});
        },
        'click button#new-board': function(e) {
            var boardId = Games.insert(createBoard());
            Meteor.Router.to("/board/" + boardId);
        }
    };

    Template.navigation.onBoard = function() {
        return Session.get('boardId');
    };

    move = function(pieces, from, to) {
        pieces[to] = pieces[from];
        pieces[from] = PIECE_SET.EMPTY;
        return pieces;
    };
}