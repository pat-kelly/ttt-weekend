/* 
  Tic Tac Toe - app.js
  Due: 12 Dec. 2022
  Coded by Patrick Kelly.
*/

/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
]
const timeoutIds = []; //This stores the animation timeout IDs.

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
resetBtnEl.addEventListener('click', reset);
toggleAnim.addEventListener('click', pauseAnims)

/*-------------------------------- Initializations --------------------------------*/
//initialize after page loads.
document.onload = init();
document.onload = animateCars();

/*-------------------------------- Functions --------------------------------*/
function reset(){
  /*reload animates the board, then sets a timeout to remove the animation classes, and call init.*/
  boardEl.classList.remove('animate_rollIn');
  boardEl.classList.add('animate__hinge');
  setTimeout(function(){
    boardEl.classList.remove('animate__hinge');
    boardEl.classList.add('animate__rollIn');
    setTimeout(function(){boardEl.classList.remove('animate__rollIn')},1500)
    init();
  }, 2000)
}

function init(){
  //initialize variables
  for(sqr of squareEls){ sqr.classList.remove('invalidMove');}
  board = [];
  turn = -1;
  winner = false;
  tie = false;
  //initialize the board model to null values
  for (const sqr of squareEls) board.push(null);
  render();
}

function handleClick(evt){
  if(!(evt.target.classList.contains('sqr'))) return;
  const sqIdx = parseInt(evt.target.id.replace('sq','')); //id of sq4 becomes 4
  if(board[sqIdx]) {
    invalidMove(evt); //function to do a shake animation
    return;
  }
  if(winner) {
    invalidMove(evt);
    return;
  }
  placePiece(sqIdx);
  checkWinner();
  checkTie();
  switchPlayerTurn();
  render();
}

function invalidMove(evt){
  //animates the current letter, then sets a timeout to remove the class.
  const target = document.getElementById(evt.target.id)
  target.classList.add('animate__headShake');
  setTimeout(function(){target.classList.remove('animate__headShake')}, 500)
  ;
}

function placePiece(idx){
  squareEls[idx].classList.add('invalidMove');
  board[idx] = turn;
}

function checkTie(){
  if(winner) return;
  (board.some(idx => idx === null)) ? tie=false : tie=true; //if no moves left, game ties.
}

function checkWinner(){
//board may look like [1, 1, 1, -1, null, -1, null, -1, null]
winningCombos.forEach(combo =>{
  let sum =0;
  combo.forEach(idx =>{
    sum += board[idx];
  })
  if(Math.abs(sum) === 3){
    winner = true;
    animateWinCombo(combo);
    for(sqr of squareEls){sqr.classList.add('invalidMove')};
  }
})
}

function animateWinCombo(idxArray){
  /* This function takes in the winning combo, in an array of indicies, then animates them. */
  idxArray.forEach(idx => {
    squareEls[idx].classList.add('animate__flip');
    setTimeout(function(){
      squareEls[idx].classList.remove('animate__flip');
    }, 1500)
  });
}

function switchPlayerTurn(){
  if(winner) return;
  turn *= -1;
}

function render(){
  updateBoard();
  updateMessage();
}

function updateBoard(){
  //runs through the board array, setting the matching squareEls values appropriately.
  //null = '', -1 gets an x, and 1 gets an o
  board.forEach((sqr, idx) => {
    if(sqr){
      sqr < 0 ? squareEls[idx].textContent = 'X' : squareEls[idx].textContent = 'O'
    }else squareEls[idx].textContent = '';
  });
}

function updateMessage(){
  //Nested ternaries are not fun. this first checks for a win condition, 
  // then checks for a tie, if not the win. then defaults to ongoing
  (winner && !tie) ? msgEl.textContent = `The winner is ${getCurPlayer()}!` 
    : ((!winner && tie) ? msgEl.textContent = `The game tied on ${getCurPlayer()}'s turn.`
      : msgEl.textContent = `${getCurPlayer()}, it's your turn!`); 
}

function getCurPlayer(){
  return turn < 0 ? "Player 1" : "Player 2";
}

function animateCars(stop = false){
  /* This function animates the cars on screen. Takes a boolean as a parameter.
  If stop is passed in true, it pauses all of the cars where they are. 
  If they are stopped when this function is called, they resume their movement.
  */

  const delEls = document.querySelectorAll('.delorean');

  if(stop){
    //Timeouts are sequential, so get a new one, then iterate backwards removing them.
    let id = setTimeout(function() {}, 0);
    while (id--) {
      clearTimeout(id); // will do nothing if no timeout with id is present
      timeoutIds.pop();
    }
    return;
  }

  //The below iterates through each delorean, setting a timeout for each, moving it 1px to the right.
  //timeoutIDs array stores each car's timeout id, so it can be accessed.
  delEls.forEach((car, idx) => {
    let pos = car.style.left.slice(0,-2);//This lets me keep them where they are when paused.
    const speed = [40, 30, 20, 15, 10, 5, 1] //N2S-> come back and make this dynamic when you're better. also fix the responsiveness.
    clearInterval(timeoutIds[idx]);//clear the current timeout
    timeoutIds[idx] = setInterval(frame, ((speed[idx]))); //set a new one
    function frame(){
      if(pos === window.innerWidth){
        pos = -150; //wrap back to the left if we're outside the window
      }else{
        pos ++;
        car.style.left = `${pos}px`;
      }
    }
  });
}

function pauseAnims(evt){
  /* Pauses the moving cars, or starts them again.
  the button's class is how we determine whether things are currently running, and 
  calls the animate function with TRUE to stop them. Or without TRUE to start them.
  */
  let targetClass = evt.target.className;

  switch(targetClass){
    case('running'):
      evt.target.classList.remove('running');
      evt.target.classList.add('stopped');
      animateCars(true);
      for(car of deloreans){
        car.classList.remove('animate__fadeIn');
        car.classList.add('animate__fadeOut');}
      break;
    case('stopped'):
      evt.target.classList.remove('stopped');
      evt.target.classList.add('running');
      for(car of deloreans){
        car.classList.remove('animate__fadeOut');
        car.classList.add('animate__fadeIn');}
      animateCars();
      break;
  }  
}