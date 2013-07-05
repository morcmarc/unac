var Grid = (function () {
    function Grid(id, depth) {
        this.id = id;

        this.moveMade = new TypedEvent();

        this._winner = 0;

        this.generateGrid(id, depth);
    }
    Grid.prototype.render = function () {
        var template = _.template('<table class="grid">' + '<tr>' + '<td data-square="<%= content[0].id %>" class="square top left unowned"><%= content[0].render() %></td>' + '<td data-square="<%= content[1].id %>" class="square top center unowned"><%= content[1].render() %></td>' + '<td data-square="<%= content[2].id %>" class="square top right unowned"><%= content[2].render() %></td>' + '</tr>' + '<tr>' + '<td data-square="<%= content[3].id %>" class="square left unowned"><%= content[3].render() %></td>' + '<td data-square="<%= content[4].id %>" class="square center unowned"><%= content[4].render() %></td>' + '<td data-square="<%= content[5].id %>" class="square right unowned"><%= content[5].render() %></td>' + '</tr>' + '<tr>' + '<td data-square="<%= content[6].id %>" class="square bottom left unowned"><%= content[6].render() %></td>' + '<td data-square="<%= content[7].id %>" class="square bottom center unowned"><%= content[7].render() %></td>' + '<td data-square="<%= content[8].id %>" class="square bottom right unowned"><%= content[8].render() %></td>' + '</tr>' + '</table>');

        return template({
            content: this._squares
        });
    };

    Grid.prototype.getSquareById = function (id) {
        if (id.length > 1) {
            var nextSquareId = id.substr(0, 1);
            var remainingId = id.substr(1);

            return this._grids[nextSquareId].getSquareById(remainingId);
        }

        return this._squares[id];
    };

    Grid.prototype.isGridFull = function (id) {
        if (id.length >= 1) {
            var nextSquareId = id.substr(0, 1);
            var remainingId = id.substr(1);

            return this._grids[nextSquareId].isGridFull(remainingId);
        }

        return this.checkFull();
    };

    Grid.prototype.setWinner = function (winner) {
        console.log("Unable to set winner directly on a grid object.");

        return false;
    };

    Grid.prototype.getWinner = function () {
        return this._winner;
    };

    Grid.prototype.generateGrid = function (id, depth) {
        var _this = this;
        this._squares = new Array();
        this._grids = new Array();

        for (var g = 0; g <= 8; g++) {
            var squareId = id + g.toString();

            var square;

            if (depth > 0) {
                var grid = new Grid(squareId, depth - 1);

                square = grid;

                this._grids.push(grid);
            } else {
                square = new Square(squareId);
            }

            square.moveMade.add(function (id, winner, nextGridId) {
                return _this.onMoveMade(id, winner, nextGridId);
            });

            this._squares.push(square);
        }
    };

    Grid.prototype.onMoveMade = function (id, winner, nextGridId) {
        var $square = $('*[data-square="' + id + '"]');

        if (winner == 1) {
            $square.removeClass("unowned");
            $square.addClass("p1owned");
        } else if (winner == 2) {
            $square.removeClass("unowned");
            $square.addClass("p2owned");
        }

        if (this._winner == 0) {
            this._winner = this.checkWinner();

            if (this._winner > 0) {
                $('*[data-square="' + this.id + '"] > table > tbody > tr > td').removeClass("top").removeClass("bottom").removeClass("left").removeClass("right");
                var gridDepth = nextGridId.length - this.id.length;
                var squareId = this.id.substr(this.id.length - 1);

                nextGridId = nextGridId.substr(0, gridDepth) + squareId + nextGridId.substr(gridDepth + 1);
            }
        }

        this.moveMade.trigger(this.id, this._winner, nextGridId);
    };

    Grid.prototype.checkWinner = function () {
        var winningGrids = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (var g = 0; g < winningGrids.length; g++) {
            var winningGrid = winningGrids[g];

            var square1Winnner = this._squares[winningGrid[0]].getWinner();
            var square2Winnner = this._squares[winningGrid[1]].getWinner();
            var square3Winnner = this._squares[winningGrid[2]].getWinner();

            if (square1Winnner != 0 && square1Winnner == square2Winnner && square2Winnner == square3Winnner) {
                return this._squares[winningGrid[0]].getWinner();
            }
        }

        return 0;
    };

    Grid.prototype.checkFull = function () {
        for (var s = 0; s < this._squares.length; s++) {
            if (this._squares[s].getWinner() == 0) {
                return false;
            }
        }

        return true;
    };
    return Grid;
})();
//@ sourceMappingURL=Grid.js.map