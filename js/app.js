// Array of all player characters
var CHAR = ['images/char-boy.png',
            'images/char-horn-girl.png',
            'images/char-cat-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'];

/* -- ENEMY CLASS -- */

// Enemies our player must avoid
var Enemy = function(row, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = -80;
    this.y = 68 + (row * 83);
    this.speed = speed;

    this.width = 101;
    this.height = 60;
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    
    
    var playerX = player.getX() + 20;
    var playerY = player.getY() + 60;
    var playerWidth = player.getWidth();
    var playerHeight = player.getHeight();

    //detect whether player and enemy overlap
    if (this.x < playerX + playerWidth && 
        this.x + this.width > playerX && 
        this.y + 80 < playerY + playerHeight &&
        this.y + this.height + 80 > playerY) {
        
        // if so, trigger a loss and move Player to starting position
        player.reset("lose");
    }
    
};


// Create Enemy Spawns every 3 seconds. 
// Store interval in var so we can manipulate on each 'win' 
var enemyInterval = 3000;
setInterval(createSpawns, enemyInterval);

function createSpawns(){
    var row = getRandomNum(0,2);
    var speed = getRandomNum(150,250);
    allEnemies.push(new Enemy(row, speed));
}

// Get Randome number including both min and max
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* -- PLAYER CLASS -- */

// Player Class
var Player = function() {
    this.sprite = CHAR[0];
    this.x = 201;
    this.y = 400;
    this.direction = "none";
    this.points = 0;


    this.width = 60;
    this.height = 80;
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Store key listeners in player's direction
Player.prototype.handleInput = function(keyCode) {
    this.direction = keyCode;
};

Player.prototype.getX = function() {
    return this.x;
};

// returns player's y coordinate
// for use in collision detection by Enemy instances
Player.prototype.getY = function() {
    return this.y;
};

// returns player's width property,
// for use in collision detection by Enemy instances
Player.prototype.getWidth = function() {
    return this.width;
};

// returns plater's height property,
// for use in collision detection by Enemy instances
Player.prototype.getHeight = function() {
    return this.height;
};

// Update the player's position from key listeners. 
Player.prototype.update = function() {
    switch(this.direction){
        case 'left': 
        if(this.x>=101){this.x-= 100;}
        break;

        case 'right':
        if(this.x<=301){this.x+= 100;}
        break;

        case 'up': this.y-= 83;
        break;

        case 'down': 
         if(this.y<=317){this.y+= 83;}
        break;
    }

    this.direction = "none";

    //play has hit water and safely dodged enemies, rest game with a win
    if(this.y <=-15){
        this.reset('win');
    }
};

// Reset game to inital x & y and do something depending on the outcome.
Player.prototype.reset = function(outcome){
    this.x = 201;
    this.y = 400;
    
    if(outcome == 'win'){
       this.sprite = newCharacter(); 
       this.points += 1;
       enemyInterval--;
       setInterval(createSpawns, enemyInterval);
       document.getElementById('score').innerHTML = "Score: " + this.points; 
    }
    if(outcome == 'lose'){
        $("#lose").fadeIn(1000).text("  ouch!");
        $("#lose").fadeOut(2000);
    }    
}

// Cycles through CHAR array to update a new player each win.
var charNum = 0;
function newCharacter (){
    charNum++;
    if(charNum == CHAR.length){
        charNum = 0;
    }
    return CHAR[charNum] 
}

// Instantiate objects. enemy objects in array & player object in variable
var allEnemies = [];
var player = new Player();
var enemy = new Enemy();
allEnemies.push(enemy)


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});