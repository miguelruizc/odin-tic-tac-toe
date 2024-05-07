//Board object
function Board() {
    //Board attributes
    const rows = 3;
    const columns = 3;
    let board = new Array(rows);

    //Populate board w/ Cells
    for(let i = 0; i < rows; i++) {
        board[i] = new Array(columns);
        for(let j = 0; j < columns; j++) {
            board[i][j] = Cell();
        }
    }

    //Render Method
    const render = function() {
        let boardString = "";
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                boardString += board[i][j].getValue()+" ";
            }
            boardString += "\n";
        }
        console.log(boardString);
    }

    //Set cell method
    const setCell = function(row, column, character) {
        // Make sure coordinates are not out of bound
        if(row < 0 || row > (rows-1) ||
         column < 0 || column > (columns-1)) {
            console.log("Invalid coordinates, out of bound");
            return;
         }
         else {
            board[row][column].setValue(character);
         }
    }

    //Get cell method
    const getCell = function(row, column) {
         // Make sure coordinates are not out of bound
         if(row < 0 || row > (rows-1) ||
         column < 0 || column > (columns-1)) {
            console.log("Invalid coordinates, out of bound");
            return;
         }
         else {
            return board[row][column].getValue();
         }
    }

    const getNumberOfRows = () => {
        return rows;
    }

    const getNumberOfColumns = () => {
        return columns;
    }

    //Return public members
    return {
        render, 
        setCell,
        getCell,
        getNumberOfRows,
        getNumberOfColumns,
    };
}

//Cell object
function Cell() {
    let value = '#';

    const setValue = (newValue) => {
        value = newValue;
    };

    const getValue = () => value;

    return {
        setValue,
        getValue
    };
}

//Player object
function Player(name, token) {
    const _name = name;
    const _token = token;
    
    const getName = () => _name;
    const getToken = () => _token;
    
    return {getName, getToken};
} 

//GameController object 
function GameController() {
    const board = Board();
    const players = [Player("Miguel", "X"), Player("Maria", "O")];
    
    let activePlayer = players[0];
    let _winner = undefined;
    let _gameWon = false;

    const playRound = () => {
        // Get input for row & column
        let row, column;

        do {
            // Row
            do {
                let input = prompt(`${activePlayer.getName()} turn, enter row (0-2): `);
                row = parseInt(input);
                if(isNaN(row) || row < 0 || row > 2) {
                    console.log("Invalid input, enter a number between 0-2");
                }
            } while(row < 0 || row > 2);
            
            //Column
            do {
                let input = prompt(`${activePlayer.getName()} turn, enter column (0-2): `);
                column= parseInt(input);
                if(isNaN(column) || column < 0 || column > 2) {
                    console.log("Invalid input, enter a number between 0-2");
                }
            } while(column < 0 || column > 2);
            
            //Check if cell is not empty
            if(board.getCell(row, column) === players[0].getToken() || board.getCell(row, column) === players[1].getToken()) {
                console.log("Invalid cell, choose an empty (#) position");
            }
        
            // Loop until input is a valid cell
        } while(board.getCell(row, column) === players[0].getToken() || board.getCell(row, column) === players[1].getToken());    
      
        // Play move & switch player
        board.setCell(row, column, activePlayer.getToken());
        if(checkWinner() === true) {
            _gameWon = true;
            render();
            console.log("Winner: "+ getWinner());
        }
        switchActivePlayer();
    }

    const switchActivePlayer = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }

    const render = () => {
        board.render();
    }

    const checkWinner = () => {
        //Board 3x3 & win condition is 3 back to back of the same token (e.g. "XXX")
        let player0WinString = ""+ players[0].getToken() + players[0].getToken() + players[0].getToken(); 
        let player1WinString = ""+ players[1].getToken() + players[1].getToken() + players[1].getToken(); 

        //Check rows
        for(let i = 0; i < 3; i++){
            let rowString = "";

            for(let j = 0; j < 3; j++){
                rowString += board.getCell(i,j);    
            }

            if(rowString === player0WinString){
                _winner = players[0];
                return true;
            }
            else if(rowString === player1WinString){
                _winner = players[1];
                return true;
            }
        }

        //Check columns
        for(let i = 0; i < 3; i++){
            let columnString = ""

            for(let j = 0; j < 3; j++){
                columnString += board.getCell(j, i);
            }

            if(columnString === player0WinString){
                _winner = players[0];
                return true;
            }
            else if(columnString === player1WinString){
                _winner = players[1];
                return true;
            }
        }
        
        //Check diagonals (manually set for a 3x3 board)
        let diagonal1String = "" + board.getCell(0,0) + board.getCell(1,1) + board.getCell(2,2);
        let diagonal2String = "" + board.getCell(2,0) + board.getCell(1,1) + board.getCell(2,0);
            //Diagonal 1
            if(diagonal1String === player0WinString){
                _winner = players[0];
                return true;
            }
            else if(diagonal1String === player1WinString){
                _winner = players[1];
                return true;
            }
            //Diagonal 2
            if(diagonal2String === player0WinString){
                _winner = players[0];
                return true;
            }
            else if(diagonal2String === player1WinString){
                _winner = players[1];
                return true;
            }
            
        // No winner found
        return false;
    }

    const getWinner = () => {
        if(_gameWon)
            return _winner.getName();
        else
            return "Winner not found";
    }

    const isWon = () => {
        return _gameWon;
    }

    const getBoard = () => {
        return board;
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    return {
        playRound,
        render,
        isWon,
        getBoard,
        getActivePlayer,
    };
}

//DOMController object
function DOMController() {
    
    //DOM elements
    let gameInfoDiv = document.getElementById("game-info");
    let boardDiv = document.getElementById("board");

    const updateDOM = function(gameController) {
        //Clear DOM, by setting .board text content to an empty string
        gameInfoDiv.textContent = "";
        boardDiv.textContent = "";

        //Get up-to-date board
        let board = gameController.getBoard();

        //Get up-to-date active player
        let activePlayer = gameController.getActivePlayer();

        //Render active player in #game-info
        gameInfoDiv.textContent = `Turn: ${activePlayer.getName()}(${activePlayer.getToken()})`;
        
        //Render board with buttons
        let rows = board.getNumberOfRows();
        let columns = board.getNumberOfColumns();

        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                //Create button w/cell info
                let button = document.createElement("button");
                button.setAttribute("id", `${i}-${j}`);
                button.setAttribute("class", "cell");
                button.innerText = board.getCell(i, j);
                //Add event listener
                button.addEventListener("click", function() {
                    console.log("button clicked");
                });
                //Append
                boardDiv.appendChild(button);
            }
            boardDiv.appendChild(document.createElement("br"));
        }
    }

    return {
        updateDOM,
    };
}

// Program start here: 
let g = GameController();
let d = DOMController();

//Game loop
// do {
//     g.render();
//     g.playRound();
// } while (!g.isWon());

d.updateDOM(g);

