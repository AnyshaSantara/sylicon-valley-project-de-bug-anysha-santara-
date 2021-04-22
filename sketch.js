var PLAY = 1;
var END = 0;
var gameState = PLAY; 
var trex, trex_running, trex_collided;
var hat, hat_running, hat_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score = 0;
var jumpSound, collidedSound;
var gameOver, restart;
var ratio = window.devicePixelRatio || 1;
var w = screen.width * ratio;
var h = screen.height * ratio;
function preload() {
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  backgroundImg = loadImage("assets/backgroundImg.png")
  sunAnimation = loadImage("assets/sun.png");
  trex_running = loadAnimation("assets/trex_2.png", "assets/trex_1.png", "assets/trex_3.png");
  hat_running = loadAnimation("assets/hat1.png","assets/hat1.png");
  trex_collided = loadAnimation("assets/trex_collided.png");
  hat_collided = loadAnimation("assets/hat1.png","assets/hat1.png");
  groundImage = loadImage("assets/ground.png");
  cloudImage = loadImage("assets/cloud.png");
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  hat1 = loadImage("assets/hat1.png");
  hat2 = loadImage("assets/hat2.png");
  hat3 = loadImage("assets/hat3.png");
  hat4 = loadImage("assets/hat4.png");
  hat5 = loadImage("assets/hat5.png");
  hat6 = loadImage("assets/hat6.png");
  hat7 = loadImage("assets/hat7.png");
  hat8 = loadImage("assets/hat8.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(w, h);
  //createCanvas(document.body.clientWidth, document.body.clientHeight);
  //createCanvas(displayWidth, displayHeight);
  sun = createSprite(width - 50, 100, 10, 10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  trex = createSprite(50, height-70, 20, 50);
  hat = createSprite(80, height-75, 20, 50);
  
  trex.addAnimation("running", trex_running);   
  hat.addAnimation("running", hat_running);

  trex.addAnimation("collided", trex_collided);
  hat.addAnimation("collided", hat_collided);

  trex.setCollider('circle', 0, 0, 350);
  hat.setCollider('circle', 0, 0, 350);

  hat.scale = 0.20
  trex.scale = 0.20
  // trex.debug=true
  invisibleGround = createSprite(width / 2, height - 10, width, 125);
  invisibleGround1 = createSprite(width / 2, height - 25, width, 125);
  invisibleGround.shapeColor = "#f4cbaa";
  ground = createSprite(width / 2, height-40, width, 2);
  ground.addImage("ground", groundImage);
  ground.x = width / 2
  ground.velocityX = -(6 + 3 * score / 100);
  gameOver = createSprite(width / 2, height / 2 - 50);
  gameOver.addImage(gameOverImg);
  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  gameOver.visible = false;
  restart.visible = false;
  // invisibleGround.visible =false
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  score = 0;
}
function draw() {
  //trex.debug = true;
  background(backgroundImg);
  //background("grey");
  textSize(20);
  fill("black")
  text("Score: " + score, 30, 50);
  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    //score = score + 5;
    ground.velocityX = -(6 + 3 * score / 100);
    if (touches.length > 0 && trex.y >= height - 120) {
      //  if (touches.length > 0) {
      jumpSound.play()
      trex.velocityY = -10;
      hat.velocityY = -10;

      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8
    hat.velocityY = hat.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    trex.collide(invisibleGround);
    hat.collide(invisibleGround);

    spawnClouds();
    spawnObstacles();
    if (obstaclesGroup.isTouching(trex)) {
      collidedSound.play()
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    hat.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    hat.changeAnimation("collided", hat_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if (touches.length > 0) {
      if (restart.overlapPoint(touches[0].x, touches[0].y)) {
        reset();
        touches = []
      }
    }
    if (mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width + 20, height - 300, 40, 10);
    cloud.y = Math.round(random(100, 220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    //assign lifetime to the variable
    cloud.lifetime = 300;
    //adjust the depth
    cloud.depth = trex.depth;
    cloud.depth = hat.depth;

    trex.depth = trex.depth + 1;
    hat.depth = hat.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, height - 135, 20, 30);
    obstacle.setCollider('circle', 0, 0, 45)
    // obstacle.debug = true
    obstacle.velocityX = -(6 + 3 * score / 100);
    //generate random obstacles
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      default: break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth += 1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  hat.changeAnimation("running", hat_running);
  score = 0;
}
// function windowResized() {
//   //resizeCanvas(windowWidth, windowHeight);
//   //resizeCanvas(displayWidth, displayHeight)
//   resizeCanvas(w, h)
// }    