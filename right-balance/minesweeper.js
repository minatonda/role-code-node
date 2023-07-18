function buildMinesweeper(ROWS = 8, COLS = 8, MINES = 10) {

    function buildBoard(nrows = 8, ncols = 8) {
        // A 2D array to represent the game board
        let board = [];

        // Initialize the board, state, and place mines randomly
        for (let row = 0; row < nrows; row++) {
            board[row] = [];
            for (let col = 0; col < ncols; col++) {
                board[row][col] = 0;
            }
        }

        return board;
    }

    // Function to build Minesweeper structure
    function buildBoardAndMines(nrows = 8, ncols = 8, nmines = 10) {
        // An array to keep track of the positions of mines on the board
        let board = buildBoard(nrows, ncols);
        let mines = [];

        // Initialize the board, state, and place mines randomly
        for (let i = 0; i < nmines; i++) {
            let row = Math.floor(Math.random() * nrows);
            let col = Math.floor(Math.random() * ncols);
            if (board[row][col] !== "*") {
                board[row][col] = "*";
                mines.push([row, col]);
            } else {
                i--;
            }
        }

        return [board, mines];
    }

    // Function to Populate the board with the number of mines around each cell
    function populateBoardWithNumberOfMinesAroundCell(board, mines) {
        // Populate the board with the number of mines around each cell
        for (let i = 0; i < mines.length; i++) {
            let row = mines[i][0];
            let col = mines[i][1];
            for (let r = Math.max(0, row - 1); r <= Math.min(row + 1, ROWS - 1); r++) {
                for (let c = Math.max(0, col - 1); c <= Math.min(col + 1, COLS - 1); c++) {
                    if (board[r][c] !== "*") {
                        board[r][c]++;
                    }
                }
            }
        }
    }


    // Game Data
    const opened = [];
    const [board, mines] = buildBoardAndMines(ROWS, COLS, MINES);
    let status = 0;

    populateBoardWithNumberOfMinesAroundCell(board, mines);

    function getBoard() {
        return board;
    }

    function getStatus() {
        return status;
    }

    // Function to display the game board in the console
    function displayBoard(vtype = 0) {
        console.log("- " + new Array(COLS).fill("-").join(" "));
        console.log("- " + new Array(COLS).fill("-").join(" "));
        console.log("  " + [...Array(COLS).keys()].join(" "));

        if (vtype == 0) {
            for (let row = 0; row < ROWS; row++) {
                const display = board[row].map((col, idxCol) => opened.some((cords) => cords[0] === row && cords[1] === idxCol) ? col : '#');
                console.log(row + " " + display.join(" "));
            }
        }

        if (vtype == 1) {
            for (let row = 0; row < ROWS; row++) {
                const display = board[row];
                console.log(row + " " + display.join(" "));
            }
        }

        if (vtype == 2) {
            for (let row = 0; row < ROWS; row++) {
                const masked = board[row].map((col, idxCol) => opened.some((cords) => cords[0] === row && cords[1] === idxCol) ? col : '#');
                const display = board[row];
                console.log(row + " " + display.join(" ") + " ||| " + masked.join(" "));
            }
        }

    }

    // Function to be done
    function revealCell(row, col, display = true) {
        if (status !== 0) {
            return status;
        }

        if (opened.some((coords) => coords[0] === row && coords[1] === col)) {
            return status;
        }

        opened.push([row, col]);

        if (board[row][col] === "*") {
            status = -1;
        }

        if (board[row][col] === 0) {
            rowmin = row - 1;
            rowmin = rowmin < 0 ? 0 : rowmin;

            rowmax = row + 1;
            rowmax = rowmax > (ROWS - 1) ? (ROWS - 1) : rowmax;

            colmin = col - 1;
            colmin = colmin < 0 ? 0 : colmin;

            colmax = col + 1;
            colmax = colmax > (COLS - 1) ? (COLS - 1) : colmax;

            for (let irow = rowmin; irow <= rowmax; irow++) {
                for (let icol = colmin; icol <= colmax; icol++) {
                    if (irow === row && icol === col) {
                        continue;
                    }
                    revealCell(irow, icol, false);
                }
            }
        }

        if (opened.length === ((ROWS * COLS) - MINES)) {
            status = 1;
        }

        if (status === 1) {
            console.log("- " + new Array(COLS).fill("-").join(" "));
            console.log("- " + new Array(COLS).fill("-").join(" "));
            console.log("  " + "Y O U  W I N");
            displayBoard(2);
            return status;
        }

        if (status === -1) {
            console.log("- " + new Array(COLS).fill("-").join(" "));
            console.log("- " + new Array(COLS).fill("-").join(" "));
            console.log("  " + "Y O U  L O S T");
            displayBoard(2);
            return status;
        }

        if (status === 0 && display) {
            displayBoard(0);
        }
    }

    return {
        revealCell,
        displayBoard,
        getBoard,
        getStatus
    }
}

const ROWS = 8;
const COLS = 8;
const MINES = 10;

function winMinesweeper() {
    const game = buildMinesweeper(ROWS, COLS, MINES);
    const board = game.getBoard();

    let crows = ROWS - 1;
    while (crows >= 0 && game.getStatus() === 0) {
        let ccols = COLS - 1;
        while (ccols >= 0) {
            if (board[crows][ccols] !== "*") {
                game.revealCell(crows, ccols);
            }
            ccols -= 1;
        }
        crows -= 1;
    }

}

function loseMinesweeper() {
    const game = buildMinesweeper(ROWS, COLS, MINES);
    const board = game.getBoard();

    let crows = ROWS - 1;
    while (crows >= 0 && game.getStatus() === 0) {
        let ccols = COLS - 1;
        while (ccols >= 0) {
            if (board[crows][ccols] === "*") {
                game.revealCell(crows, ccols);
            }
            ccols -= 1;
        }
        crows -= 1;
    }
}

winMinesweeper();
loseMinesweeper();