// useful to have them as global variables
var canvas, ctx, w, h;
var mousePos;

// an empty array!
var balls = [];
var initialNumberOfBalls;
var globalSpeedMutiplier = 1;
var colorToEat = 'red';
var colorFriend = 'blue';
var colorEnemy = 'purple';
var wrongBallsEaten = goodBallsEaten = friendBallsEaten = enemyBallsEaten =0;
var numberOfGoodBalls;
var numberOfBadBalls;
var numberOfFriendBalls;
var numberOfEnemyBalls;
var niveau = 2;
var leftLives = 3;
var score = 0;


let gameState = "welcomeScreen";
var player = {
  x: 10,
  y: 10,
  width: 20,
  height: 20,
  color: 'red'
}





window.onload = function init() {
  // called AFTER the page has been loaded
  canvas = document.querySelector("#myCanvas");

  // often useful
  w = canvas.width;
  h = canvas.height;
  // important, we will draw with this object
  ctx = canvas.getContext('2d');
  document.getElementById("myAudio").loop = true;
  
//game sound
var myAudio = document.getElementById('myAudio');
//when you eat target ball
var myAudio1 = document.getElementById('myAudio1');
//when you eat enemy ball
var myAudio2 = document.getElementById('myAudio2');
//when you lose the game
var myAudio3 = document.getElementById('myAudio3');
  //myAudio.play();
  // start game with 10 balls, balls to eat = red balls
  startGame(niveau);

  // add a mousemove event listener to the canvas
  canvas.addEventListener('mousemove', mouseMoved);

  document.addEventListener("keydown", processKeydown);
  // ready to go !
  mainLoop();
};

function processKeydown(event) {

  if (event.key === " ") {
    myAudio.play();
    switch (gameState) {
      case "welcomeScreen" :
       
        leftLives = 3;
        niveau = 2;
        changeNbBalls(niveau);
        gameState = "gameRunning";
        
        break;
        case "gameContinue" : 
      startGame(niveau);
      gameState = "gameRunning";
      
      break;
      case "gameOver" : 
      leftLives = 3;//réinitialiser le nombre de vie après la perte
      score = 0;
      niveau = 2;
      startGame(niveau);
      gameState = "gameRunning";
     
      break;
      case "gameFinished" : 
      leftLives = 3;//réinitialiser le nombre de vie après la perte
      niveau = 2;
      startGame(niveau);
      gameState = "gameRunning";
      
      break;
    }

   
  }
}

function startGame(nb) {

  balls = createBalls(nb);
  initialNumberOfBalls = nb;
  numberOfGoodBalls = countNumberOfGoodBalls(balls, colorToEat);
  numberOfBadBalls = countNumberOfBadBalls(balls, colorToEat, colorFriend, colorEnemy);
  numberOfFriendBalls =  countNumberOfFriendBalls(balls, colorFriend);
  numberOfEnemyBalls =  countNumberOfEnemyBalls(balls, colorEnemy);
  wrongBallsEaten = goodBallsEaten = friendBallsEaten = enemyBallsEaten =0;
}

function countNumberOfGoodBalls(balls, colorToEat) {
  var nb = 0;

  balls.forEach(function (b) {
    if (b.color === colorToEat)
      nb++;
  });

  return nb;
}
//function that counts the number of friend balls in the game
function countNumberOfFriendBalls(balls, colorFriend) {
  var nb = 0;

  balls.forEach(function (b) {
    if (b.color === colorFriend)
      nb++;
  });

  return nb;
}
//function that counts the number of enemy balls in the game
function countNumberOfEnemyBalls(balls, colorEnemy) {
  var nb = 0;

  balls.forEach(function (b) {
    if (b.color === colorEnemy)
      nb++;
  });

  return nb;
}
//function that counts the number of bad balls in the game
function countNumberOfBadBalls(balls, colorToEat, colorFriend, colorEnemy) {
  var nb = 0;

  balls.forEach(function (b) {
    if (b.color != colorToEat & b.color != colorFriend & b.color != colorEnemy)
      nb++;
  });

  return nb;
}

function changeNbBalls(nb) {
  startGame(nb);
}

function changeColorToEat(color) {
  colorToEat = color;
}

function changePlayerColor(color) {
  player.color = color;
}

function changeBallSpeed(coef) {
  globalSpeedMutiplier = coef;
}

function mouseMoved(evt) {
  mousePos = getMousePos(canvas, evt);
}

function getMousePos(canvas, evt) {
  // necessary work in the canvas coordinate system
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function movePlayerWithMouse() {
  if (mousePos !== undefined) {
    player.x = mousePos.x;
    player.y = mousePos.y;
  }
}

function mainLoop() {
  // 1 - clear the canvas
  ctx.clearRect(0, 0, w, h);
  switch (gameState) {
    case "welcomeScreen" :
      drawWelcomeScreen();
      break;
    case  "gameRunning" :
      updateGame();
      break;
    case "gameOver" : 
    drawGameOver();
    myAudio.pause();
    myAudio3.play();
   
    break;
    case "gameContinue" : 
    drawGameContinue();
    myAudio.pause();
    myAudio3.play();
  
    break;
    case "gameFinished" : 
    drawGameFinished();
    myAudio.pause();
    break;
  }

  // ask the browser to call mainloop in 1/60 of  for a new animation frame
  requestAnimationFrame(mainLoop);
}
function updateGame(){
  drawFilledRectangle(player);
 
      drawAllBalls(balls);
      drawBallNumbers(balls);
      // animate the ball that is bouncing all over the walls
      moveAllBalls(balls);
      movePlayerWithMouse();
}

function drawWelcomeScreen() {
  ctx.save();
  ctx.font = "50px Verdana";
  ctx.fillText("let's start! ", 350, 250);
  ctx.restore();
  ctx.save();
  ctx.font = "10px Arial";
  ctx.fillText("Press Space To Begin!", 400, 500);
  ctx.restore();
}
function drawGameContinue() {
  ctx.save();
  ctx.font = "50px Verdana";
  ctx.fillText("let's Continue! ", 350, 250);
  ctx.fillText("your score is "+score, 350, 300);
  ctx.restore();
  ctx.save();
  ctx.font = "10px Arial";
  ctx.fillText("Press Space To Continue!", 400, 500);
  ctx.restore();
}
function drawGameOver() {
  ctx.save();
  ctx.font = "50px Verdana";
  ctx.fillText("Game Over!", 350, 250);
  ctx.fillText("your final score is "+score, 350, 300);
  ctx.restore();
  ctx.save();
  ctx.font = "10px Arial";
  ctx.fillText("Press Space To Restart!!!"+score, 400, 500);
  ctx.restore();

}
function drawGameFinished() {
  ctx.save();
  ctx.font = "50px Verdana";
  ctx.fillText("Congrats You Won the Game!", 350, 250);
  ctx.fillText("your final score is "+score, 350, 300);
  ctx.restore();
  ctx.save();
  ctx.font = "10px Arial";
  ctx.fillText("Press Space To Replay!!!", 400, 500);
  ctx.restore();
}

// Collisions between rectangle and circle
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
  var testX = cx;
  var testY = cy;
  if (testX < x0) testX = x0;
  if (testX > (x0 + w0)) testX = (x0 + w0);
  if (testY < y0) testY = y0;
  if (testY > (y0 + h0)) testY = (y0 + h0);
  return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
}

function createBalls(n) {
  // empty array
  var ballArray = [];
  var a1 = {
    x: w / 2,
    y: h / 2,
    radius: 5 + 30 * Math.random(), // between 5 and 35
    speedX: -5 + 10 * Math.random(), // between -5 and + 5
    speedY: -5 + 10 * Math.random(), // between -5 and + 5
    color: 'red',
  }
  ballArray.push(a1);
  var a2 = {
    x: w / 2,
    y: h / 2,
    radius: 5 + 30 * Math.random(), // between 5 and 35
    speedX: -5 + 10 * Math.random(), // between -5 and + 5
    speedY: -5 + 10 * Math.random(), // between -5 and + 5
    color: 'green',
  }
  ballArray.push(a2);
  // create n balls
  for (var i = 2; i < n; i++) {
    var b = {
      x: w / 2,
      y: h / 2,
      radius: 5 + 30 * Math.random(), // between 5 and 35
      speedX: -5 + 10 * Math.random(), // between -5 and + 5
      speedY: -5 + 10 * Math.random(), // between -5 and + 5
      color: getARandomColor(),
    }
    // add ball b to the array
    ballArray.push(b);
  }
  // returns the array full of randomly created balls
  return ballArray;
}

function getARandomColor() {
  var colors = ['red', 'blue', 'cyan', 'purple', 'pink', 'green', 'yellow', 'Black', 'Brown'];
  // a value between 0 and color.length-1
  // Math.round = rounded value
  // Math.random() a value between 0 and 1
  var colorIndex = Math.round((colors.length - 1) * Math.random());
  var c = colors[colorIndex];

  // return the random color
  return c;
}


function drawBallNumbers(balls) {
  ctx.save();
  ctx.font = "20px Arial";
  var a = numberOfGoodBalls + numberOfBadBalls + numberOfFriendBalls + numberOfEnemyBalls;
 /* if (balls.length === 0) {
    gameState = "gameOver"
  }*/
  
  //du niveau 1 au niveau 3
  //si tu manges une mauvaise balle tu perds

  if (a <= 4 &  wrongBallsEaten === 1  ) {
    
      leftLives--;
      if(leftLives > 0){
        gameState = "gameContinue"
      }else {
        gameState = "gameOver"
      }
  } 
  //du niveau 4 au niveau 9
  //si tu manges deux mauvaises balles tu perds
  else if( a>4 & a<=10 &  wrongBallsEaten === 2 ) {
    leftLives--;
    if(leftLives > 0){
      gameState = "gameContinue"
    }else {
      gameState = "gameOver"
    }
  } 
  //à partir du niveau 10
  //si tu manges trois mauvaises balles tu perds
  else if( a>10  &  wrongBallsEaten === 3 ) {
    leftLives--;
    if(leftLives > 0){
      gameState = "gameContinue"
    }else {
      gameState = "gameOver"
    }
  }  
  //si tu manges toutes les bonnes balles tu passes au prochain niveau
  else if (goodBallsEaten === numberOfGoodBalls) {
    niveau++;
    if (niveau <= 51){
      //le jeu est constitué de 50 niveaux 
      startGame(niveau);
    }else {
      
      gameState = "gameFinished"
    }
    

    /*
    ctx.fillText("You Win! Final score : " + (initialNumberOfBalls - wrongBallsEaten), 
                 20, 30);
      */

  } else {
    ctx.fillText("Balls still alive: " + balls.length, 10, 30);
    ctx.fillText("Good Balls eaten: " + goodBallsEaten, 10, 50);
    ctx.fillText("score: " + score, 10, 70);
    ctx.fillText(" you ate " + wrongBallsEaten + " Wrong Balls", 250, 50);
    ctx.fillText("niveau: " + (niveau-1), 710, 30);
    ctx.fillText("Left Lives: " + leftLives, 710, 50);
    
  }
  
 if (a <= 4){
  ctx.fillText("if you eat 1 wrong ball you lose!! " , 250, 30);
 }else if (a>4 & a<=10){
  ctx.fillText("if you eat 2 wrong balls you lose!! " , 250, 30);
 }else if(a>10){
  ctx.fillText("if you eat 3 wrong balls you lose!! " , 250, 30);
 }

  ctx.restore();
}



function drawAllBalls(ballArray) {
  ballArray.forEach(function (b) {
    drawFilledCircle(b);
  });
}

function moveAllBalls(ballArray) {
  
  // iterate on all balls in array
  balls.forEach(function (b, index) {
    // b is the current ball in the array
    // the enemy balls are moving faster than other balls
    if(b.color === 'purple'){
      b.x += (b.speedX * globalSpeedMutiplier * 2);
      b.y += (b.speedY * globalSpeedMutiplier * 2);
    }else {
      b.x += (b.speedX * globalSpeedMutiplier);
      b.y += (b.speedY * globalSpeedMutiplier);
    }
    


    testCollisionBallWithWalls(b);

    testCollisionWithPlayer(b, index);

    
  });
}

function testCollisionWithPlayer(b, index) {
 
  if (circRectsOverlap(player.x, player.y,
    player.width, player.height,
    b.x, b.y, b.radius)) {
    // we remove the element located at index
    // from the balls array
    // splice: first parameter = starting index
    //         second parameter = number of elements to remove
   
        
    if (b.color === colorToEat) {
      myAudio1.play();
      // Yes, we remove it and increment the score
      goodBallsEaten += 1;
      score++;
    } else if(b.color === colorFriend) {
      friendBallsEaten += 1;
      //if you eat 2 friend balls you win one life
      if (friendBallsEaten === 2){
        leftLives++;
      }
    } else if(b.color === colorEnemy) {
      myAudio2.play();
      enemyBallsEaten += 1;
      //if you eat an enemy you lose one point from your global score
      score--;
      //if you eat 3 enemy balls you lose one life
      if (enemyBallsEaten === 1){
        leftLives--;
        if (leftLives === 0){
          gameState = "gameOver";
        }
      }
    }else {
      wrongBallsEaten +=1;
    }

    balls.splice(index, 1);

  }
}

function testCollisionBallWithWalls(b) {
  // COLLISION WITH VERTICAL WALLS ?
  if ((b.x + b.radius) > w) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedX = -b.speedX;

    // put the ball at the collision point
    b.x = w - b.radius;
  } else if ((b.x - b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedX = -b.speedX;

    // put the ball at the collision point
    b.x = b.radius;
  }

  // COLLISIONS WTH HORIZONTAL WALLS ?
  // Not in the else as the ball can touch both
  // vertical and horizontal walls in corners
  if ((b.y + b.radius) > h) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedY = -b.speedY;

    // put the ball at the collision point
    b.y = h - b.radius;
  } else if ((b.y - b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedY = -b.speedY;

    // put the ball at the collision point
    b.Y = b.radius;
  }
}

function drawFilledRectangle(r) {
  // GOOD practice: save the context, use 2D trasnformations
  ctx.save();

  // translate the coordinate system, draw relative to it
  ctx.translate(r.x, r.y);

  ctx.fillStyle = r.color;
  // (0, 0) is the top left corner of the monster.
  ctx.fillRect(0, 0, r.width, r.height);

  // GOOD practice: restore the context
  ctx.restore();
}

function drawFilledCircle(c) {
  // GOOD practice: save the context, use 2D trasnformations
  ctx.save();

  // translate the coordinate system, draw relative to it
  ctx.translate(c.x, c.y);

  ctx.fillStyle = c.color;
  // (0, 0) is the top left corner of the monster.
  ctx.beginPath();
  ctx.arc(0, 0, c.radius, 0, 2 * Math.PI);
  ctx.fill();

  // GOOD practice: restore the context
  ctx.restore();
}