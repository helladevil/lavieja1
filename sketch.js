var PLAY = 1;
var END = 0;
var gameState = PLAY;

var abuela, abuela_running;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;

var gameOver, restart;


function preload(){

   
  backgroundImg = loadImage("backgroundImg.png")
  
  sunAnimation = loadImage("sun.png");
  
  abuela_running = loadImage("abuela1.png","abuela2.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.8
  
  
  abuela = createSprite(50,height-570,20,50);
  abuela.addAnimation("abuela", abuela_running);
  abuela.scale = 0.5;
  
     
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#a10000";
  
  
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
   cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
 drawSprites();

  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Puntuación: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && abuela.y  >= height-280) {
         abuela.velocityY = -10;
       touches = [];
    }
    
    abuela.velocityY = abuela.velocityY + 0.8;
        //evita que la abuela caiga
        abuela.collide(invisibleGround);
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(abuela)){
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    abuela.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,140,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 1.8;
    cloud.velocityX = -3;
    
    
    cloud.lifetime = 300;
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,10);
    obstacle.setCollider('circle',0,0,45)
    
    obstacle.velocityX = -(6 + 3*score/100);
    
    
    var rand = Math.round(random(1,2,3,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    
         
    obstacle.scale = 0.28;
    obstacle.lifetime = 300;
    obstacle.depth = abuela.depth;
    abuela.depth +=1;
    
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();


  
   score = 0;
  
}
