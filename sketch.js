var player1, database;
var position,position2;
var player2;
var p1animation,p2animation;
var gameState;
var player1Score;
var player2Score;

function preload(){
  player1animation =loadAnimation("assests/player1a.png","assests/player1b.png","assests/player1a.png");
  player2animation =loadAnimation("assests/player2a.png","assests/player2b.png","assests/player2a.png");
}

function setup(){
  database = firebase.database();
  createCanvas(600,600);

  player1 = createSprite(300,250,10,10);
 
  player1.addAnimation("walking",player1animation);
  player1animation.frameDelay = 200
  player1.scale = 0.5
  player1.setCollider("circle", 0,0,60)
 
  
  var player1Position = database.ref('player1/position');
  player1Position.on("value", readPosition1); 

  player2 = createSprite(300,250,10,10);

  player2.addAnimation("walkin2",player2animation);
  player2animation.frameDelay = 200
  player2.scale = -0.5
  player2.setCollider("circle", 0,0,60)


  var player2Position = database.ref('player2/position');
  player2Position.on("value", readPosition2);


  gameState = database.ref('gameState/');
  gameState.on("value", readGameState);

  player1Score = database.ref('player1Score/');
  player1Score.on("value", readScore1);

  player2Score = database.ref('player2Score/');
  player2Score.on("value", readScore2);
}

function draw(){
  background("darkgreen");

  if(gameState === 0){
    fill("black")
    text("Press space to start the toss",230,160);

//space is pressed to start the game
    if(keyDown("space")){
      //toss
      rand = Math.round(random(1,2));
      //if toss=1
      if(rand === 1){
        database.ref('/').update({
          'gameState': 1  
        })
        alert("RED")
      }
      //if toss=2
      if(rand === 2){
        database.ref('/').update({
          'gameState': 2  
        })
        alert("YELLOW")
      }
      //update the initial position of player1
      database.ref('player1/position').update({
        'x': 150,
        'y': 300  
      })
       //update the initial position of player2
      database.ref('player2/position').update({
        'x': 450,
        'y': 300  
      })

    }
    
  }

  //if red one gets a chance
  if (gameState === 1){
     

    if(keyDown(LEFT_ARROW)){
      writePosition(-5,0);
    }
    else if(keyDown(RIGHT_ARROW)){
      writePosition(5,0);
    }
    else if(keyDown(UP_ARROW)){
      writePosition(0,-5);
    }
    else if(keyDown(DOWN_ARROW)){
      writePosition(0,+5);
    }
    else if(keyDown("w")){
      writePosition2(0,-5);
    }
    else if(keyDown("s")){
      writePosition2(0,+5);
    }

    if(player1.x > 500){
      database.ref('/').update({
        'player1Score': player1Score - 5 ,
        'player2Score': player2Score + 5 ,
        'gameState': 0  

      })
    
      
    }

    if(player1.isTouching(player2)){
      database.ref('/').update({
        'gameState': 0  ,
        'player1Score': player1Score + 5 ,
        'player2Score': player2Score - 5 
      })
      
      alert("RED LOST")
    }
  }

  if(gameState === 2){

     
    if(keyDown("a")){
      writePosition2(-5,0);
    }
    else if(keyDown("s")){
      writePosition2(0,5);
    }
    else if(keyDown("w")){
      writePosition2(0,-5);
    }
    else if(keyDown("d")){
      writePosition2(5,0);
    }
    else if(keyDown(UP_ARROW)){
      writePosition(0,-5);
    }
    else if(keyDown(DOWN_ARROW)){
      writePosition(0,+5);
    }

    if(player2.x < 150){
      database.ref('/').update({
        'player1Score': player1Score + 5, 
        'gameState': 0,
        'player2Score': player2Score - 5   
      })
    
    }

    if(player1.isTouching(player2)){
      database.ref('/').update({
        'gameState': 0  ,
        'player1Score': player1Score - 5,
        'player2Score': player2Score + 5  
      })
      
      alert("YELLOW LOST")
    }
  }
  // text to display score of both the players
    textSize(15)
    stroke("white");
    fill("white");
    text("RED: "+player1Score,350,15);
    text("YELLOW: "+player2Score,150,15);

    if(player1Score===20 || player2Score===20){
      alert("Game Over");
    database.ref('/').update({
     'player1Score':0,
     'player2Score':0
    })
    
    }

    drawlineMid();
    drawlineLeft();
    drawlineRight();

    drawSprites();
  
}
//to update the position of player1
function writePosition(x,y){
  database.ref('player1/position').set({
    'x': position.x + x ,
    'y': position.y + y
  })
}
//to update the position of player2
function writePosition2(x,y){
  database.ref('player2/position').set({
    'x': position2.x + x ,
    'y': position2.y + y
  })
}
//to read position of player1
function readPosition1(data){
  position = data.val();
  player1.x = position.x;
  player1.y = position.y;
}
//to read position of player2
function readPosition2(data){
  position2 = data.val();
  player2.x = position2.x;
  player2.y = position2.y;
}
//to read gameState
function readGameState(data){
  gameState = data.val();
}
//to read score of player1
function readScore1(data1){
  player1Score = data1.val();
}
//to read score of player2
function readScore2(data2){
  player2Score = data2.val();
}

//to draw the left line
function drawlineLeft(){
  for(var i = 0; i<600; i=i+20){
    stroke("yellow");
    strokeWeight(4)
    line (100,i,100,i+10)
  }
}
//to draw the middle line
function drawlineMid(){
  for(var i = 0; i<600; i=i+20){
    strokeWeight(4)
    line (310,i,320,i+10)
  }
}
// to draw the right line
function drawlineRight(){
  for(var i = 0; i<600; i=i+20){
    stroke("red");
    strokeWeight(4);
    line (500,i,500,i+10)
  }
}