/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/
let board, turn, winner, tie;
//board is an array of the board state
//turn is who's turn it is
//winner -bool- was there a winner THIS turn.
//tie -bool- did the game tie.

/*------------------------ Cached Element References ------------------------*/
const squareEls = document.getElementsByClassName('sqr');
const msgEl = document.getElementById('message');


/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Functions --------------------------------*/
//initialize after page loads.
document.onload = init();

function init(){
  //set variables
  board = [];
  turn = -1;
  winner = false;
  tie = false;

  //initialize the board model to null values
  for (const sqr of squareEls) board.push(null);
  render();
  // updateMessage();
}

function render(){
  board[0] = 1;
  board[1] = -1;
}

function updateBoard(){
  board.forEach((sqr, idx) => {
    if(sqr){
      sqr < 0 ? squareEls[idx].textContent = 'X' : squareEls[idx].textContent = 'O'
    }
  });
}

function updateMessage(){
  winner = false;
  tie = false;

  (winner && !tie) ? msgEl.textContent = `The winner is ${getCurPlayer()}!` 
    : ((!winner && tie) ? console.log('tie')
      : console.log('game ongoing')); 

  // switch(true){

  //   case tie && !winner:
  //     console.log('Tie Game');
  //     break;
  //   case winner && !tie:
  //     console.log("there's a winner");
  //     break;
  //   default:
  //     console.log('default');
  //     break;
    
  // }
    
  
}

function getCurPlayer(){

}