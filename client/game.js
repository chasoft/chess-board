Session.set('reverse_board', false);

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
    return getCurrentGame();
};

Template.board.boardRows = function() {
    return BOARD_ROWS[Session.get('reverse_board')];
};

Template.board.boardCols = function() {
    return BOARD_COLS[Session.get('reverse_board')];
};

Template.board.events = {
    'keypress input#message': function(e) {
        if (e.keyCode == '13') {
            var msg = $('input#message');
            if (msg.val()) {
                addMessage(msg.val());
                msg.val("");
            }
        }
    },
    'dragstart [draggable=true]': function(e) {
        e.dataTransfer.setData("source_id", e.target.parentNode.id);
        e.dataTransfer.setData("piece", e.target.innerHTML);
    },
    'dragover .dropzone': function(e) {
        e.preventDefault();
    },
    'drop .dropzone': function(e) {
        var targetId = e.target.id ? e.target.id : e.target.parentNode.id;
        var sourceId = e.dataTransfer.getData("source_id");
        var piece = e.dataTransfer.getData("piece");
        if (sourceId === 'offboard_pieces') {
            putPiece(piece, targetId);
        } else if (sourceId !== targetId) {
            movePiece(sourceId, targetId);
        }
    },
    'click .piece': function(e) {
        var targetId = e.target.id ? e.target.id : e.target.parentNode.id;
        if (e.ctrlKey)
            removePiece(targetId);
    },
    'click .dropzone': function(e) {
        if (e.ctrlKey) {
            $('.dropdown').dropdown();
        }
    }
};

Template.board.rendered = function() {
    $('#messages').scrollTop($('#messages').height());
    $('#message').focus();
};

Template.navigation.events = {
    'click button#reset': function() {
        Games.update({_id: getBoardId()}, {$set: createBoard()});
    },
    'click button#rotate': function() {
        Session.set('reverse_board', !Session.get('reverse_board'));
    },
    'click button#new-board': function(e) {
        var boardId = Games.insert(createBoard());
        Meteor.Router.to("/board/" + boardId);
    }
};

Template.navigation.boardId = function() {
    return getBoardId();
};

getCurrentGame = function() {
    return Games.findOne({_id: getBoardId()});
};

getBoardId = function() {
    return Session.get('boardId');
};

addMessage = function(msg) {
    Games.update({_id: getBoardId()}, {$push: {messages: {text: msg, isMove: false}}});
};

movePiece = function(from, to) {
    var game = getCurrentGame();
    game.pieces[to] = game.pieces[from];
    game.pieces[from] = EMPTY;
    Games.update({_id: getBoardId()}, {$set: {pieces: game.pieces},
        $push: {messages: {text: from + "-" + to, isMove: true}}});
};

putPiece = function(piece, pos) {
    var game = getCurrentGame();
    game.pieces[pos] = piece;
    Games.update({_id: getBoardId()}, {$set: {pieces: game.pieces},
        $push: {messages: {text: "Put " + piece + " on " + pos, isMove: true}}});
};

removePiece = function(pos) {
    var game = getCurrentGame();
    game.pieces[pos] = EMPTY;
    Games.update({_id: getBoardId()}, {$set: {pieces: game.pieces},
        $push: {messages: {text: "Removed the piece on " + pos, isMove: true}}});
};
