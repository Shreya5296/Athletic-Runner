var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var ground, invisibleGround, groundImage;
var otherGround;

var cloudsGroup, cloudImage;
var obstaclesGroup;
var bird1, birdGroup;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
 
  boy_running =   loadAnimation("boy1.png","boy2.png","boy3.png");
  boy_collided = loadAnimation("boy_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  backgroundImg = loadImage("bg.png");

  
  obstacle1 = loadImage("obstacle1.png");

  bird1 = loadImage("bird1.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  song = loadSound('hit.mp3');
  song2 = loadSound('points.mp3');
  song3 = loadSound('click.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight-10);
 
  boy = createSprite(width/2-400,0,0,0);  
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  boy.scale = 0.5;
  boy.setCollider("rectangle",0,0,100,100);
    
  ground = createSprite(0,width-500,height,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.setCollider("rectangle",0,0,400,50);
  ground.visible=false;
  
  gameOver = createSprite(width/2+50,height-420);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2+50,height-370);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(500,height-50,6040,70);
  invisibleGround.visible = false;

  otherGround = createSprite(500,height-30,6040,70);
  otherGround.isStatic = true;
  otherGround.shapeColor = "green"
  
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdGroup = new Group();
  //obstacle2.debug=true;
  
  score = 0;
}

function draw() {
  background(backgroundImg);
  strokeWeight(2);
  stroke("red");
  fill("white");
  textFont("Georgia");
  textSize(20)
  text("Score: "+ score, width-150,height-570);

  strokeWeight(3);
  stroke("white");
  fill("red");
  textFont("Georgia");
  textSize(40)
  text("ATHLETIC RACE", width/2-100,height-570);
  textSize(20)
  text("Keep running, running and running to earn points.", width/2-150,height-520);
  
  if (gameState===PLAY){
    song.pause();
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((touches.length > 0 || keyDown("space")) && boy.y >= 420) {
      boy.velocityY = -6;
      touches = [];
    }

    if (score>0 && score%100 === 0){
      song2.play();
    }
  
    boy.velocityY = boy.velocityY + 0.7
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    boy.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnBirds();
  
    if(obstaclesGroup.isTouching(boy)){
        gameState = END;
        song.play();
    }
    if(birdGroup.isTouching(boy)){
      gameState = END;
      song.play();
  }
    }
    else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    boy.velocityY = 0;
    //boy.x = 10;
    obstaclesGroup.setVelocityXEach(0);
    birdGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the boy animation
    boy.changeAnimation("collided",boy_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    birdGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      song3.play();
      reset();
    }
    strokeWeight(2);
    stroke("red");
    fill("white");
    textFont("Georgia");
    textSize(40)
    text("Total points earned: "+ score, width/2-150,height-270);
    textSize(20)
    text("Tap reset button to replay ", width/2-70,height-230);
   
  }
  
 // obstacle1.debug=true;
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
    var cloud = createSprite(width-200,height-100,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = boy.depth;
    boy.depth = boy.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(width-200,height-110,30,40);
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100);        
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.setCollider("rectangle",0,0,60,160);
    obstaclesGroup.add(obstacle);
  }
}

function spawnBirds() {
  if(frameCount % 350 === 0) {
    var bird = createSprite(width-200,height-140,30,40);
    bird.addImage(bird1);
    bird.velocityX = -(6 + 3*score/100);          
    bird.scale = 0.2;
    bird.lifetime = 300;
    bird.setCollider("rectangle",0,0,60,160);
    birdGroup.add(bird);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  birdGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  boy.changeAnimation("running",boy_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  //console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}