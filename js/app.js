/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/
let board, turn, winner, tie;


/*------------------------ Cached Element References ------------------------*/
const squareEls = document.getElementsByClassName('sqr');
const msgEl = document.getElementById('message');


/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Functions --------------------------------*/
document.onload = init();

function init(){
  // console.log(squareEls)
  board = [];
  turn = -1;
  winner = false;
  tie = false;

  for (const sqr of squareEls) board.push(null);
  render();
}

function render(){
  
}