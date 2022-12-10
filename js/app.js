/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
]
const timeoutIds = [];
/*---------------------------- Variables (state) ----------------------------*/
let board, turn, winner, tie;
//board is an array of the board state
//turn is who's turn it is
//winner -bool- was there a winner THIS turn.
//tie -bool- did the game tie.

/*------------------------ Cached Element References ------------------------*/
const squareEls = document.getElementsByClassName('sqr');
const msgEl = document.getElementById('message');
const boardEl = document.getElementById('board');
const resetBtnEl = document.getElementById('reset');
const toggleAnim = document.getElementById('anim');
const deloreans = document.getElementsByClassName('delorean');

/*----------------------------- Event Listeners -----------------------------*/
boardEl.addEventListener('click', handleClick);
resetBtnEl.addEventListener('click', init);
toggleAnim.addEventListener('click', pauseAnims)

/*-------------------------------- Functions --------------------------------*/
//initialize after page loads.
document.onload = init();

function init(){
  //initialize variables

  board = [];
  turn = -1;
  winner = false;
  tie = false;

  //initialize the board model to null values
  for (const sqr of squareEls) board.push(null);
  render();
  animateCars();
}

function handleClick(evt){
  if(evt.target.id === 'board') return;
  const sqIdx = evt.target.id.slice(2);
  // console.log('sqIdx', sqIdx)
  // console.log(board[sqIdx])
  if(board[sqIdx]) return;
  if(winner) return;
  placePiece(sqIdx);
  checkWinner();
  checkTie();
  switchPlayerTurn();
  render();
}

function placePiece(idx){
  board[idx] = turn;
}

function checkTie(){
  if(winner) return;
  (board.some(idx => idx === null)) ? tie=false : tie=true;
  // console.log(tie);
}

function checkWinner(){
//board may look like [1, 1, 1, -1, null, -1, null, -1, null]
winningCombos.forEach(combo =>{
  let sum =0;
  combo.forEach(idx =>{
    sum += board[idx];
  })
  // console.log(combo,sum);
  if(Math.abs(sum) === 3) winner = true;
})
// console.log();
}

function switchPlayerTurn(){
  if(winner) return;
  turn *= -1;
}

function render(){
  // board[0] = 1;
  // board[1] = -1;
  updateBoard();
  updateMessage();
}

function updateBoard(){
  board.forEach((sqr, idx) => {
    if(sqr){
      sqr < 0 ? squareEls[idx].textContent = 'X' : squareEls[idx].textContent = 'O'
    }else squareEls[idx].textContent = '';
  });
}

function updateMessage(){
  //Nested ternaries are not fun. this first checks for a win condition, 
  // then checks for a tie, if not the win. then defaults to 'ongoing'
  (winner && !tie) ? msgEl.textContent = `The winner is ${getCurPlayer()}!` 
    : ((!winner && tie) ? msgEl.textContent = `The game tied on ${getCurPlayer()}'s turn.`
      : msgEl.textContent = `${getCurPlayer()}, it's your turn!`); 
}

function getCurPlayer(){
  return turn < 0 ? "Player 1" : "Player 2";
}



function animateCars(stop = false){

  const delEls = document.querySelectorAll('.delorean');
  // console.log(delEls);

  if(stop){
    // console.log('in stop');
    let id = setTimeout(function() {}, 0);
    // console.log(id);
    while (id--) {
      clearTimeout(id); // will do nothing if no timeout with id is present
      timeoutIds.pop();
    }
    // console.log(timeoutIds);
    return;
  }

  delEls.forEach((car, idx) => {
    let pos = car.style.left.slice(0,3);
    clearInterval(timeoutIds[idx]);
    timeoutIds[idx] = setInterval(frame, (idx+1)*2); //change 1 to something else non-static once you get this running.
    function frame(){
      if(pos === window.innerWidth){
        pos = -150;
      }else{
        pos ++;
        car.style.left = `${pos}px`;
      }
      // console.log(car.style.left);
    }
  });
}

function pauseAnims(evt){
  let targetClass = evt.target.className;

  switch(targetClass){
    case('running'):
      // console.log('in running');
      evt.target.classList.remove('running');
      evt.target.classList.add('stopped');
      // state = 'none';
      animateCars(true);
      break;
    case('stopped'):
      // console.log('in stopped');
      evt.target.classList.remove('stopped');
      evt.target.classList.add('running');
      animateCars();
      break;
  }  
}