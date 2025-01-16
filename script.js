document.addEventListener('DOMContentLoaded', function () {
    var board = document.getElementById('board');
    var btn1 = document.getElementById('btn1');
    var btn2 = document.getElementById('btn2');
    var btn3 = document.getElementById('btn3');
    var btn4 = document.getElementById('btn4');
    var btn5 = document.getElementById('btn5');
    var btn6 = document.getElementById('btn6');
    var btn7 = document.getElementById('btn7');
    var btn8 = document.getElementById('btn8');
    var btn9 = document.getElementById('btn9');
    var textbtn = document.getElementById('textbtn');
    var retrybtn = document.getElementById('retrybtn');
    var singlePlayerbtn = document.getElementById('singlePlayerbtn');
    var twoPlayerbtn = document.getElementById('twoPlayerbtn');
    var gamemodediv = document.getElementById('gamemode');
    var levelsdiv = document.getElementById('levels');
    var level1 = document.getElementById('level1');
    var level2 = document.getElementById('level2');
    var level3 = document.getElementById('level3');
    var score = document.getElementById('scoreText');


    var buttons = [btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8, btn9];
    var freePositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var corners = [1, 3, 7, 9];
    var edges = [2, 4, 6, 8];

    // Hide certain components initially
    retrybtn.style.display = 'none';
    textbtn.style.display = 'none';
    levelsdiv.style.display = 'none';
    score.style.display = 'none';

   // Function to register the game clicks
    let currentGameMode = "Two Player";
    let Xturn = true;
    let gameover = false;
    let gamestart = false;
    let singlePlayerStart = false;
    let first = true;
    let compStart = false;
    let gameCount = 1;
    let turnCount = 1;
    let playerSymbol;
    let playerColor;
    let compSymbol;
    let compColor;
    let compStartChoice = 0;
    let compSecondChoice = 0;
    let playerStartChoice = 0;
    let wins = 0;
    let ties = 0;
    let losses = 0;

    function gameModeChoice (button) {
        if (button.textContent.trim() === "Single Player") {
            toggleVisibilityFlex(gamemodediv);
            toggleVisibilityBlock(levelsdiv);
        } else {
            toggleVisibilityFlex(gamemodediv);
            toggleVisibilityFlex(textbtn);
            gamestart = true;
        }
    }

    function levelChoice (button) {
        toggleVisibilityBlock(levelsdiv);
        textbtn.textContent = "Choose a position!";
        toggleVisibilityFlex(textbtn);
        toggleVisibilityBlock(score);
        turnCount = 1;
        gameCount = 1;
        singlePlayerStart = true;
        if (button.textContent.trim() === "Regular") {
            currentGameMode = "Regular";
        } 
        else if (button.textContent.trim() === "Hard") {
            currentGameMode = "Hard";
        }
        else if (button.textContent.trim() === "Impossible") {
            currentGameMode = "Impossible";
        }
    }

    function getRandomPosition(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    function removeElement(array, element) {
        const index = array.indexOf(element);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    function symbolDeclaration() {
        if (gameCount % 2 !== 0) {
            playerSymbol = "X";
            playerColor = "red";
            compSymbol = "O"
            compColor = "blue";
        }
        else {
            playerSymbol = "O";
            playerColor = "blue";
            compSymbol = "X";
            compColor = "red";
        }
    }

    function singlePlayerMode (button) {
        if (button.textContent.trim() !== "" || gameover === true || singlePlayerStart === false) {
            return;
        } else {
            let currbtn = buttonToPosition(button);
            removeElement(freePositions, currbtn);
            if (first) {
                first = false;
                playerStartChoice = currbtn;
                if (!compStart) {
                    symbolDeclaration();
                }
            }
            button.textContent = playerSymbol;
            button.style.color = playerColor;
            if (win(playerSymbol)) {
                wins++;
                score.textContent = "Wins: " + wins + " Ties: " + ties + " Losses: " + losses;
                textbtn.textContent = "You won!";
                gameover = true;
                board.style.backgroundColor = playerColor;
                toggleVisibilityBlock(retrybtn);
                return;
            }
            if (turnCount === 5) {
                tieCheck();
                score.textContent = "Wins: " + wins + " Ties: " + ties + " Losses: " + losses;
            }
    
            let computerChoice;
            if (currentGameMode === "Impossible") {
                if (compStart) {
                    computerChoice = scoreCheck(compSymbol) || scoreCheck(playerSymbol) || centerSetup(button) || cornerSetup() || edgeSetup() || getRandomPosition(freePositions);
                }
                else {
                    if (playerStartChoice === 5) {
                        computerChoice = scoreCheck(compSymbol) || scoreCheck(playerSymbol) || centerDefend(button) || getRandomPosition(freePositions);
                    }
                    else if (corners.includes(playerStartChoice)) {
                        computerChoice = scoreCheck(compSymbol) || scoreCheck(playerSymbol) || cornerDefend(button) || getRandomPosition(freePositions);
                    }
                    else {
                        computerChoice = scoreCheck(compSymbol) || scoreCheck(playerSymbol) || edgeDefend(button) || getRandomPosition(freePositions);
                    }
                }
            }
            else if (currentGameMode === "Hard") {
                if (compStart) {
                    computerChoice = scoreCheck(compSymbol) || scoreCheck(playerSymbol) || centerSetup(button) || cornerSetup() || getRandomPosition(freePositions);
                }
                else {
                    if (playerStartChoice === 5) {
                        computerChoice = scoreCheck(compSymbol) || scoreCheck(playerSymbol) || centerDefend(button) || getRandomPosition(freePositions);
                    }
                    else if (corners.includes(playerStartChoice)) {
                        computerChoice = scoreCheck(compSymbol) || scoreCheck(playerSymbol) || cornerDefend(button) || getRandomPosition(freePositions);
                    }
                    else {
                        computerChoice = scoreCheck(compSymbol) || scoreCheck(playerSymbol) || getRandomPosition(freePositions);
                    }
                    
                }
            }
            else {
                computerChoice = scoreCheck(compSymbol) || scoreCheck(playerSymbol) || getRandomPosition(freePositions);
            }
            removeElement(freePositions, computerChoice);
            buttons[computerChoice-1].textContent = compSymbol;
            buttons[computerChoice-1].style.color = compColor;
            if (win(compSymbol)) {
                losses++;
                score.textContent = "Wins: " + wins + " Ties: " + ties + " Losses: " + losses;
                textbtn.textContent = "You lost!";
                gameover = true;
                board.style.backgroundColor = compColor;
                toggleVisibilityBlock(retrybtn);
                return;
            }
            if (turnCount === 4) {
                tieCheck();
                score.textContent = "Wins: " + wins + " Ties: " + ties + " Losses: " + losses;
            }
            turnCount++;
        }
    }

   function BoardControlAndTwoPlayerMode(button) {
        if (singlePlayerStart === true && gameover === false) {
            singlePlayerMode(button);
        }
        else if (button.textContent.trim() !== "" || gameover === true || gamestart === false) {
            return;
        }
        else {
            if (Xturn) {
                Xturn = false;
                button.textContent = "X";
                button.style.color = "red";
                if (win("X")) {
                    textbtn.textContent = "Player 1 wins!";
                    gameover = true;
                    board.style.backgroundColor = "red";
                    toggleVisibilityBlock(retrybtn);
                    return;
                }
                textbtn.textContent = "Player 2, pick your position!";
            }
            else {
                Xturn = true;
                button.textContent = "O";
                button.style.color = "blue";
                if (win("O")) {
                    textbtn.textContent = "Player 2 wins!";
                    gameover = true;
                    board.style.backgroundColor = "blue";
                    toggleVisibilityBlock(retrybtn);
                    return;
                }
                textbtn.textContent = "Player 1, pick your position!";
            }
            tieCheck();
        }
    }

    function oppositeEdge (edge) {
        let op;
        if (edge === 2) { op = 8; }
        else if (edge === 4) { op = 6; }
        else if (edge === 6) { op = 4; }
        else if (edge === 8) { op = 2; }
        return op;
    }

    function edgeDefend(button) {
        let setupMove = 0;
        let currbtn = buttonToPosition(button);
        switch (turnCount) { 
            case 1:
                if (edges.includes(playerStartChoice)) {
                    while (true) {
                        var rand = getRandomPosition(freePositions);
                        var twocorners = adjacentCorners(playerStartChoice);
                        if (rand === 5 || rand === twocorners[0] || rand === twocorners[1]) {
                            setupMove = rand;
                            break;
                        }
                    }
                    compSecondChoice = setupMove;
                }
                break;
            case 2:
                if (compSecondChoice === 5 && currbtn === oppositeEdge(playerStartChoice)) {
                    while (true) {
                        var rand = getRandomPosition(freePositions);
                        if (edges.includes(rand)) {
                            setupMove = rand;
                            break;
                        }
                    }
                }
                else if (compSecondChoice === 5 && corners.includes(currbtn)) {
                    setupMove = cornerDefendNonAdjacentEdge(currbtn, playerStartChoice);
                }
                else if (corners.includes(compSecondChoice) && edges.includes(currbtn)) {
                    if (nonAdjacentEdgeCase(compSecondChoice, currbtn)) {
                        for (var pos of freePositions) {
                            var adjEdges = adjacentEdges(pos);
                            var edge1 = adjEdges[0], edge2 = adjEdges[1];
                            if (corners.includes(pos) && pos !== oppositeCorner(compSecondChoice) && buttons[edge1-1].textContent === "" && buttons[edge2-1].textContent === "") {
                                setupMove = pos;
                            }
                        }
                    }
                    else {
                        setupMove = 5;
                    }
                }
                else if (corners.includes(compSecondChoice) && corners.includes(currbtn)) {
                    setupMove = 5;
                }
                break;
            default:
                return 0;
        }
        return setupMove;
    }

    function edgeSetup() {
        let setupMove = 0;
        switch (turnCount) {
            case 1:
                if (edges.includes(compStartChoice) && playerStartChoice === 5) {
                    let excludedEdge = oppositeEdge(compStartChoice);
                    edgesExcludeOpposite = edges.filter(item => item !== excludedEdge);
                    for (var edge of edgesExcludeOpposite) {
                        if (buttons[edge-1].textContent === "") {
                            setupMove = edge; ///////////// only not losing(not trying to setup 100% of the time)
                        }
                    }
                }
                else if (edges.includes(compStartChoice) && edges.includes(playerStartChoice)) {
                    setupMove = 5;
                }
                else if (edges.includes(compStartChoice) && corners.includes(playerStartChoice)) {
                    for (var pos of freePositions) {
                        if (corners.includes(pos)) {
                            setupMove = pos;
                        }
                    }
                }
                compSecondChoice = setupMove;
                break;
            case 2:
                if (playerStartChoice === oppositeEdge(compStartChoice)) {
                    let freeEdges = [];
                    for (var edge of edges) {
                        for (var freeSpot of freePositions) {
                            if (edge === freeSpot) {
                                freeEdges.push(edge);
                            }
                        }
                    }
                    setupMove = getRandomPosition(freeEdges);
                }
                if (edges.includes(compStartChoice) && compSecondChoice === 5) {
                    adjacentCorners(compStartChoice);
                    setupMove = getRandomPosition(adjacentCorners);
                }
                break;
            default:
                return 0;
        }
        return setupMove;
    }

    // Function to defend a trap starting from the center
    function centerDefend(button) {
        let setupMove = 0;
        let currbtn = buttonToPosition(button);
        switch (turnCount) {
            case 1:
                if (playerStartChoice === 5) {
                    setupMove = getRandomPosition(corners);
                }
                break;
            case 2:
                if (corners.includes(currbtn)) {
                    let freeCorners = [];
                    for (var corner of corners) {
                        for (var freeSpot of freePositions) {
                            if (corner === freeSpot) {
                                freeCorners.push(corner);
                            }
                        }
                    }
                    setupMove = getRandomPosition(freeCorners);
                }
                break;
            default:
                return 0;
        }
        return setupMove;
    }

    // Function to setup a trap starting from the center
    function centerSetup(button) {
        let setupMove = 0;
        let currbtn = buttonToPosition(button);
        switch (turnCount) {
            case 1:
                if (compStartChoice === 5 && edges.includes(currbtn)) {
                    setupMove = getRandomPosition(corners);
                }
                else if (compStartChoice === 5 && corners.includes(currbtn)) {
                    if (currbtn === 1) { setupMove = 9; }
                    else if (currbtn === 3) { setupMove = 7; }
                    else if (currbtn === 7) { setupMove = 3; }
                    else if (currbtn === 9) { setupMove = 1; }
                }
                break;
            case 2:
                let freeCorners = [];
                for (var corner of corners) {
                    for (var freeSpot of freePositions) {
                        if (corner === freeSpot) {
                            freeCorners.push(corner);
                        }
                    }
                }
                setupMove = cornerCheck(freeCorners);
                break;
            default:
                return 0;
        }
        return setupMove;
    }

    function oppositeCorner(startCorner) {
        let oppositecorner;
        if (startCorner === 1) { oppositecorner = 9; }
        else if (startCorner === 3) { oppositecorner = 7; }
        else if (startCorner === 7) { oppositecorner = 3; }
        else if (startCorner === 9) { oppositecorner = 1; }
        return oppositecorner;
    }

    // Function to defend a trap starting from the corner
    function cornerDefend(button) {
        let setupMove = 0;
        let currbtn = buttonToPosition(button);
        switch (turnCount) {
            case 1:
                if (corners.includes(playerStartChoice)) {
                    setupMove = 5;
                }
                break;
            case 2:
                if (corners.includes(currbtn)) {
                    setupMove = getRandomPosition(edges);
                }
                else if(nonAdjacentEdgeCase(playerStartChoice, currbtn)) {
                    setupMove = cornerDefendNonAdjacentEdge(playerStartChoice, currbtn);
                }
                break;
            default:
                return 0;
        }
        return setupMove;
    }

    // Function to setup a trap starting from the corner
    function cornerSetup() {
        let setupMove = 0;
        switch (turnCount) {
            case 1:
                if (corners.includes(compStartChoice) && corners.includes(playerStartChoice)) {
                    let freeCorners = [];
                    for (var corner of corners) {
                        for (var freeSpot of freePositions) {
                            if (corner === freeSpot) {
                                freeCorners.push(corner);
                            }
                        }
                    }
                    setupMove = getRandomPosition(freeCorners);
                }
                else if (corners.includes(compStartChoice) && edges.includes(playerStartChoice)) {
                    setupMove = adjacentEdgeCase() || nonAdjacentEdgeCase(compStartChoice, playerStartChoice);
                }
                else if (corners.includes(compStartChoice) && playerStartChoice === 5) {
                    setupMove = getRandomPosition(freePositions);
                }
                break;
            case 2:
                if (edges.includes(playerStartChoice)) {
                    if (adjacentEdgeCase() !== 0) {
                        setupMove = oppositeCorner(compStartChoice);
                    }
                    else {
                        let excludedCorner = oppositeCorner(compStartChoice);
                        cornersExcludeOpposite = corners.filter(item => item !== excludedCorner);
                        for (var corner of cornersExcludeOpposite) {
                            if (buttons[corner-1].textContent === "") {
                                setupMove = corner;
                            }
                        }
                    }
                }
                else {
                    for (var corner of corners) {
                        if (buttons[corner-1].textContent === "") {
                            setupMove = corner;
                        }
                    }
                }
                break;
            default:
                return 0;
        }
        return setupMove;
    }

    function adjacentEdges(corner) {
        let adjEdges = [];
        if (corner === 1) {
            adjEdges = [2, 4];
        }
        else if (corner === 3) {
            adjEdges = [2, 6];
        }
        else if (corner === 7) {
            adjEdges = [4, 8];
        }
        else if (corner === 9) {
            adjEdges = [6, 8];
        }
        return adjEdges;
    }

    function adjacentCorners(edge) {
        let adjCorners = [];
        if (edge === 2) {
            adjCorners = [1, 3];
        }
        else if (edge === 4) {
            adjCorners = [1, 7];
        }
        else if (edge === 6) {
            adjCorners = [3, 9];
        }
        else if (edge === 8) {
            adjCorners = [7, 9];
        }
        return adjCorners;
    }

    function cornerDefendNonAdjacentEdge(pos1, pos2) {
        let setupMoves = [];
        if (pos1 === 1 && pos2 === 6) {
            setupMoves = [3, 8, 9];
        }
        else if (pos1 === 1 && pos2 === 8) {
            setupMoves = [6, 7, 9];
        }
        else if (pos1 === 3 && pos2 === 4) {
            setupMoves = [1, 7, 8];
        }
        else if (pos1 === 3 && pos2 === 8) {
            setupMoves = [4, 7, 9];
        }
        else if (pos1 === 7 && pos2 === 2) {
            setupMoves = [1, 3, 6];
        }
        else if (pos1 === 7 && pos2 === 6) {
            setupMoves = [2, 3, 9];
        }
        else if (pos1 === 9 && pos2 === 2) {
            setupMoves = [1, 3, 4];
        }
        else if (pos1 === 9 && pos2 === 4) {
            setupMoves = [1, 2, 7];
        }
        return getRandomPosition(setupMoves);
    }

    function adjacentEdgeCase() {
        let setUpMove;
        if (compStartChoice === 1 && playerStartChoice === 2) {
            setUpMove = 7;
        }
        else if (compStartChoice === 1 && playerStartChoice === 4) {
            setUpMove = 3;
        }
        else if (compStartChoice === 3 && playerStartChoice === 2) {
            setUpMove = 9;
        }
        else if (compStartChoice === 3 && playerStartChoice === 6) {
            setUpMove = 1;
        }
        else if (compStartChoice === 7 && playerStartChoice === 4) {
            setUpMove = 9;
        }
        else if (compStartChoice === 7 && playerStartChoice === 8) {
            setUpMove = 1;
        }
        else if (compStartChoice === 9 && playerStartChoice === 6) {
            setUpMove = 7;
        }
        else if (compStartChoice === 9 && playerStartChoice === 8) {
            setUpMove = 3;
        }
        return setUpMove;
    }

    function nonAdjacentEdgeCase(pos1, pos2) {
        let setUpMove = 0;
        if (pos1 === 1 && pos2 === 6) {
            setUpMove = 3;
        }
        else if (pos1 === 1 && pos2 === 8) {
            setUpMove = 7;
        }
        else if (pos1 === 3 && pos2 === 4) {
            setUpMove = 1;
        }
        else if (pos1 === 3 && pos2 === 8) {
            setUpMove = 9;
        }
        else if (pos1 === 7 && pos2 === 2) {
            setUpMove = 1;
        }
        else if (pos1 === 7 && pos2 === 6) {
            setUpMove = 9;
        }
        else if (pos1 === 9 && pos2 === 4) {
            setUpMove = 7;
        }
        else if (pos1 === 9 && pos2 === 2) {
            setUpMove = 3;
        }
        return setUpMove;
    }

    // Function to check if a tie has accured
    function tieCheck() {
        if (btn1.textContent.trim() !== "" && btn2.textContent.trim() !== "" && btn3.textContent.trim() !== "" && 
        btn4.textContent.trim() !== "" && btn5.textContent.trim() !== "" && btn6.textContent.trim() !== "" && 
        btn7.textContent.trim() !== "" && btn8.textContent.trim() !== "" && btn9.textContent.trim() !== "") {
            toggleVisibilityBlock(retrybtn);
            textbtn.textContent = "Tie game!";
            ties++;
            gameover = true;
        } else {
            return;
        }
    }

    winningCombinations = [ [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7] ];

    function scoreCheck(symbol) {
        for (var i = 0; i < winningCombinations.length; i++) {
            let combination = winningCombinations[i]; // Current winning combination
            let count = 0;
            let freeSpot = null;
    
            // Iterate over positions in the current combination
            for (var pos of combination) {
                if (buttons[pos - 1].textContent === symbol) {
                    count++; // Count how many spots are occupied by the symbol
                } else if (freePositions.includes(pos)) {
                    freeSpot = pos; // Track the free spot in the combination
                }
            }
    
            // If two spots are occupied by the symbol and one is free, return the free spot
            if (count === 2 && freeSpot !== null) {
                return freeSpot;
            }
        }
        return 0; // No winning or blocking move found
    }

    function cornerCheck(freeCorners) {
        for (var corner of freeCorners) {
            var winCount = 0;
            for (var i = 0; i < winningCombinations.length; i++) {
                let combination = winningCombinations[i]; // Current winning combination
                let count = 0;
                let occupied = false;
        
                // Iterate over positions in the current combination
                for (var pos of combination) {
                    if (pos === corner) {
                        count++;
                    }
                    else if (buttons[pos - 1].textContent === compSymbol) {
                        count++;
                    } 
                    else if (buttons[pos - 1].textContent === playerSymbol) {
                        occupied = true;
                    }
                }
        
                // If two spots are occupied by the compSymbol and one is free, count the winning possibilties
                if (count === 2 && occupied === false) {
                    winCount++;
                }
            }
            if (winCount >= 2) {
                return corner;
            }
        }
        return 0; // No winning or blocking move found
    }

    // Function to check if anyone has won
    function win(symbol) {
        var win = false;
        var positions = [];
        var pos = 1;
        buttons.forEach(function(button) {
            if (button.textContent === symbol) {
                positions.push(pos)
            }
            pos++;
        });

        var rone = 0, rtwo = 0, rthree = 0, rdiagonal = 0;
        var cone = 0, ctwo = 0, cthree = 0, cdiagonal = 0;
        for (var n of positions) {
            if (n == 1 || n == 2 || n == 3) { rone++; }
            else if (n == 4 || n == 5 || n == 6) { rtwo++; }
            else if (n == 7 || n == 8 || n == 9) { rthree++; }

            if (n == 1 || n == 4 || n == 7) { cone++; }
            else if (n == 2 || n == 5 || n == 8) { ctwo++; }
            else if (n == 3 || n == 6 || n == 9) { cthree++; }

            if (n == 1 || n == 5 || n == 9) { rdiagonal++; }
            if ( n == 3 || n == 5 || n == 7) { cdiagonal++; }
        }

        if (rone == 3 || rtwo == 3 || rthree == 3 || rdiagonal == 3 || cone == 3 || ctwo == 3 || cthree == 3 || cdiagonal == 3) {
            win = true;
        }
        return win;
    }

    function buttonToPosition(button) {
        let pos = null;
        switch (button.id) {
            case "btn1":
                pos = 1;
                break;
            case "btn2":
                pos = 2;
                break;
            case "btn3":
                pos = 3;
                break;
            case "btn4":
                pos = 4;
                break;
            case "btn5":
                pos = 5;
                break;
            case "btn6":
                pos = 6;
                break;
            case "btn7":
                pos = 7;
                break;
            case "btn8":
                pos = 8;
                break;
            case "btn9":
                pos = 9;
                break;
            default:
                console.error("Invalid button ID");
        }
        return pos;
    }

    // Function to toggle the visibility of an element
    function toggleVisibilityBlock(element) {
        if (element.style.display === 'none') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }

    // Function to toggle the visibility of an element
    function toggleVisibilityFlex(element) {
        if (element.style.display === 'none') {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    }

    retrybtn.addEventListener('click', function () {
        resetGame(currentGameMode);
    });

    function resetGame(mode) {
        first = true;
        turnCount = 1;
        gameover = false;
        buttons.forEach(button => {
            button.textContent = "";
        });
    
        if (mode === 'Two Player') {
            gamestart = true;
            board.style.backgroundColor = "black";
            retrybtn.style.display = 'none';
            textbtn.textContent = "Player 1, pick your position!";
        } 
        else {
            singlePlayerStart = true;
            board.style.backgroundColor = "black";
            retrybtn.style.display = 'none';
            textbtn.textContent = " Choose your position!";
            freePositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            gameCount++;
            symbolDeclaration();
            playerStartChoice = 0;
            compSecondChoice = 0;
            compStart = false;
            if (gameCount % 2 == 0) {
                compStart = true;
                compStartChoice = getRandomPosition(freePositions);
                removeElement(freePositions, compStartChoice);
                buttons[compStartChoice-1].textContent = compSymbol;
                buttons[compStartChoice-1].style.color = compColor;
            }
        }
    }

    // Add event listeners to buttons
    btn1.addEventListener('click', function () { BoardControlAndTwoPlayerMode(btn1); });
    btn2.addEventListener('click', function () { BoardControlAndTwoPlayerMode(btn2); });
    btn3.addEventListener('click', function () { BoardControlAndTwoPlayerMode(btn3); });
    btn4.addEventListener('click', function () { BoardControlAndTwoPlayerMode(btn4); });
    btn5.addEventListener('click', function () { BoardControlAndTwoPlayerMode(btn5); });
    btn6.addEventListener('click', function () { BoardControlAndTwoPlayerMode(btn6); });
    btn7.addEventListener('click', function () { BoardControlAndTwoPlayerMode(btn7); });
    btn8.addEventListener('click', function () { BoardControlAndTwoPlayerMode(btn8); });
    btn9.addEventListener('click', function () { BoardControlAndTwoPlayerMode(btn9); });

    singlePlayerbtn.addEventListener('click', function () { gameModeChoice(singlePlayerbtn); });
    twoPlayerbtn.addEventListener('click', function () { gameModeChoice(twoPlayerbtn); });

    level1.addEventListener('click', function () { levelChoice(level1); });
    level2.addEventListener('click', function () { levelChoice(level2); });
    level3.addEventListener('click', function () { levelChoice(level3); });

});