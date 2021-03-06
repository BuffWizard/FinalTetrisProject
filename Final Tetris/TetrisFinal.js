//NOTE!! A TETROMINO IS THE NAME OF THE FALLING SHAPES!!
let canvas;
let ctx;
let gBArrayHeight = 20; // Number of cells in array height
let gBArrayWidth = 12; // Number of cells in array width
let startX = 4; // Starting X position for Tetromino
let startY = 0; // Starting Y position for Tetromino
let score = 0; // Tracks the score
let level = 1; // Tracks current level
let winOrLose = "Playing";
// Used as a look up table where each value in the array
// contains the x & y position we can use to draw the
// box on the canvas
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let curTetromino = [[1,0], [0,1], [1,1], [2,1]];

//Will hold all the Tetrominos 
let tetrominos = [];
// The tetromino array with the colors matched to the tetrominos array
let tetrominoColors = ['purple','cyan','blue','yellow','orange','green','red'];
//Holds current Tetromino color
let curTetrominoColor;


let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));


let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));


let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

// Execute SetupCanvas when page loads
document.addEventListener('DOMContentLoaded', SetupCanvas); 


function CreateCoordArray(){
    let xR = 0, yR = 19;
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
        // 12 * 23 = 276 - 12 = 264 Max X value
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
       
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    // Double the size of elements to fit the screen
    ctx.scale(2, 2);

    // Draw Canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw gameboard rectangle
    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    
    // Set font for score label text and draw
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);

    // Draw score rectangle
    ctx.strokeRect(300, 107, 161, 24);

    // Draw score
    ctx.fillText(score.toString(), 310, 127);
    
    // Draw level label text
    ctx.fillText("LEVEL", 300, 157);

    // Draw level rectangle
    ctx.strokeRect(300, 171, 161, 24);

    // Draw level
    ctx.fillText(level.toString(), 310, 190);

    // Draw next label text
    ctx.fillText("WIN / LOSE", 300, 221);

    // Draw playing condition
    ctx.fillText(winOrLose, 310, 261);

    // Draw playing condition rectangle
    ctx.strokeRect(300, 232, 161, 95);
    
    // Draw controls label text
    ctx.fillText("CONTROLS", 300, 354);

    // Draw controls rectangle
    ctx.strokeRect(300, 366, 161, 104);

    // Draw controls text
    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate Right", 310, 463);

    //Handle keyboard presses
    document.addEventListener('keydown', HandleKeyPress);

    //Create the array of Tetromino arrays
    CreateTetrominos();
    //Generate random Tetromino
    CreateTetromino();

    // Create the rectangle lookup table
    CreateCoordArray();

    DrawTetromino();
}

function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino(){
    
    for(let i = 0; i < curTetromino.length; i++){

        
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        // Put Tetromino shape in the gameboard array
        gameBoardArray[x][y] = 1;
        // console.log("Put 1 at [" + x + "," + y + "]");

        // Look for the x & y values in the lookup table
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

       

      
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

// -----  Move & Delete Old Tetrimino -----
function HandleKeyPress(key){
    if(winOrLose != "Game Over"){
    
    if(key.keyCode === 65){
        
        direction = DIRECTION.LEFT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX--;
            DrawTetromino();
        } 

    
    } else if(key.keyCode === 68){
        
        
        direction = DIRECTION.RIGHT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX++;
            DrawTetromino();
        }

 
    } else if(key.keyCode === 83){
        MoveTetrominoDown();
       
    } else if(key.keyCode === 69){
        RotateTetromino();
    }
    } 
}

function MoveTetrominoDown(){
   
    direction = DIRECTION.DOWN;

    // Check for a vertical collision
    if(!CheckForVerticalCollison()){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

// Automatically calls for a Tetromino to fall every second

window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetrominoDown();
    }
  }, 1000);


// Clears the previously drawn Tetromino
function DeleteTetromino(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        // 4. Delete Tetromino square from the gameboard array
        gameBoardArray[x][y] = 0;

        // Draw white where colored squares used to be
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

// Generate random Tetrominos with color
// define every index where there is a colored block
function CreateTetrominos(){
    // Push T 
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Push Square
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino(){
    
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    
    curTetromino = tetrominos[randomTetromino];
   
    curTetrominoColor = tetrominoColors[randomTetromino];
}

//  Check if the Tetromino hits the wall
function HittingTheWall(){
    for(let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }  
    }
    return false;
}

//Check for vertical collison
function CheckForVerticalCollison(){
   
    let tetrominoCopy = curTetromino;
    // Will change values based on collisions
    let collision = false;

    // Cycle through all Tetromino squares
    for(let i = 0; i < tetrominoCopy.length; i++){
        
        let square = tetrominoCopy[i];
        
        let x = square[0] + startX;
        let y = square[1] + startY;

        
        if(direction === DIRECTION.DOWN){
            y++;
        }

        // Check if going to hit a previously set piece
      
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
           
            DeleteTetromino();
            
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        // Check for game over
        if(startY <= 2){
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        } else {

            
            for(let i = 0; i < tetrominoCopy.length; i++){
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                // Add the current Tetromino color
                stoppedShapeArray[x][y] = curTetrominoColor;
            }

            //Check for completed rows
            CheckForCompletedRows();

            CreateTetromino();

            
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }

    }
}

// Check for horizontal shape collision
function CheckForHorizontalCollision(){
   
    var tetrominoCopy = curTetromino;
    var collision = false;

    // Cycle through all Tetromino squares
    for(var i = 0; i < tetrominoCopy.length; i++)
    {
        
        var square = tetrominoCopy[i];
        var x = square[0] + startX;
        var y = square[1] + startY;

        
        if (direction == DIRECTION.LEFT){
            x--;
        }else if (direction == DIRECTION.RIGHT){
            x++;
        }

     
        var stoppedShapeVal = stoppedShapeArray[x][y];

        
        if (typeof stoppedShapeVal === 'string')
        {
            collision=true;
            break;
        }
    }

    return collision;
}

// Check for completed rows
function CheckForCompletedRows(){

    // Track how many rows to delete and where to start deleting
    let rowsToDelete = 0;
    let startOfDeletion = 0;

    // Check every row to see if it has been completed
    for (let y = 0; y < gBArrayHeight; y++)
    {
        let completed = true;
        // Cycle through x values
        for(let x = 0; x < gBArrayWidth; x++)
        {
            // Get values stored in the stopped block array
            let square = stoppedShapeArray[x][y];

            // Check if nothing is there
            if (square === 0 || (typeof square === 'undefined'))
            {
               
                completed=false;
                break;
            }
        }

        // If a row has been completed
        if (completed)
        {
            //Used to shift down the rows
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;

    
            for(let i = 0; i < gBArrayWidth; i++)
            {
               
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
              
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
               
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

// Move rows down after a row has been deleted
function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for (var i = startOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < gBArrayWidth; x++)
        {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1; 
                stoppedShapeArray[x][y2] = square; 

                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0; 
                stoppedShapeArray[x][i] = 0; 
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

//Rotate the Tetromino
function RotateTetromino()
{
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;

    for(let i = 0; i < tetrominoCopy.length; i++)
    {

        curTetrominoBU = [...curTetromino];

       
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();

    // Try to draw the new Tetromino rotation
    try{
        curTetromino = newRotation;
        DrawTetromino();
    }  
    // If there is an error get the backup Tetromino and
    // draw it instead
    catch (e){ 
        if(e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}


function GetLastSquareX()
{
    let lastX = 0;
     for(let i = 0; i < curTetromino.length; i++)
    {
        let square = curTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}
