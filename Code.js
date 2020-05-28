//Declaration of global variables
var totalSnakes = []; //using a list was the best option for our snake since it is easy to append a new block to the snake with this data structure
var grid_size = 20; //We will split the artboard into a grid (with each axis incrementing by 20) of squares with the dimensions 20, 20. This will allow the snake and food to be perfectly aligned
var snake = new Rectangle(grid_size, grid_size);
var num_snakes = 0;
var score = 0;
var scoreBoard = new Text("Score: " + score, "24pt Arial");
var topBar = new Rectangle(getWidth(), 30); //purely for design - the 30 is used to give extra space for the 24pt Arial Score Font
var gameOvertxt = new Text("GAME OVER: " + score, "24pt Arial");
var end = new Rectangle(1000,1000);
end.setColor(Color.white);
var direction = undefined;
var foodSpawn = false;
var food = new Rectangle(20,20);
food.setColor(Color.green);
var test = false;
//we can use the above false statements as conditions for functions

function start(){ 
//Instead of using while loops, we took the approach of timers. snakeMovement is the only function needing a timer since we are trying to constantly animate the snake's movement. The other timers are set to low values so that as soon as the function’s condition is true, which is checked every few milliseconds, it will carry out its function.
	createSnake();
	keyDownMethod(playerMovement);
	setTimer(getFood, 10);
	setTimer(snakeHit, 1);
	setTimer(snakeWall, 1);
	
	topBar.setPosition(0, 0);
	add(topBar);
	scoreBoard.setPosition(getWidth() / 3, 24);
	scoreBoard.setColor(Color.white);
	add(scoreBoard);
	setTimer(getScore, 1);
	
	setTimer(selfHit, 10);
	setTimer(snakeMovement, 100);
}

function createSnake(){ //this plots where the snake should be at the beginning of the game and pushes it to the total snake’s list
	snake.setPosition(getWidth()/2 - snake.width, getHeight()/2); //starts in the middle
	add(snake);
	totalSnakes.push(snake);
}

function snakeWall(){ //if the snake’s head bumps into a wall, these conditions will be true and the game will end
	if(snake.getX() > getWidth() - snake.width){ //the head of the snake is past the getWidth() - used for when the snake hits the right wall
    	gameOver();
	}
	else if(snake.getX() < 0){ //the head of the snake is on the negative side of the x-axis - used for when the snake hits the left wall
    	gameOver();
	}
	else if(snake.getY() < topBar.height()){ //the head of the snake is past the topBar - used for when the snake hits the top wall
    	gameOver();
	}
	else if(snake.getY() > getHeight() - snake.width){ //the head of the snake is past the getHeight() - used for when the snake hits the bottom wall
    	gameOver();
	}
}

function selfHit(){ //this function will end the game if the snake hits itself (when two of it’s blocks intersect)
	for(var i = 0; i < totalSnakes.length; i++){ //looks through all the snake’s blocks
    	if(i = > 1){ //it will only check this when there is more than one block, otherwise, an intersection is not possible
        	if(snake.getX() == totalSnakes[i].getX() && snake.getY() == totalSnakes[i].getY()){ //checks if one snake block in the program is at the same position as another block
            	gameOver();
        	}
    	}
	}
}


function snakeHit(){ //this function describes what to do when the snake consumes a block of food
	if(snake.getX() == food.getX() && snake.getY() == food.getY()){ //checks if the position of the snake’s head and the food are the same
    	remove(food);
    	foodSpawn = false; //triggers the respawn of another block of food
    	score+=100;
    	num_snakes++;
    	var newSnake = new Rectangle(20,20); 
    	newSnake.setPosition(-200,-200); //will always go behind the last snake block, therefore it’s negative
    	add(newSnake);
    	totalSnakes.push(newSnake);
	}

}


function getFood(){ // this function will spawn the food at a random position that follow the grid axis
	if(foodSpawn == false){ //When the food has been eaten by the snake
    	var x = Randomizer.nextInt(0, getWidth() / 20 - 1) * 20; //We need to multiply all values by 20 to align with the grid axis of 20, otherwise, the snake and food blocks would not be aligned. Since rectangles are plotted based on the left coroner, we need to subtract 1 from the with, otherwise, the food would appear off the canvas.
    	var y = Randomizer.nextInt(topBar.height / 20 + 1, getHeight() / 20) * 20; //Same as stated above. Here, the first value prevents food from being spawned in the topBar section and we use + 1 since the y-axis is downwards
    	food.setPosition(x, y);
    	add(food);
    	foodSpawn = true;
	}
}

function getScore(){ //Displays the score on the screen, which is updated every time the snake consumes a piece of food
	scoreBoard.setText("Score: " + score);
}

function gameOver(){ //Displays “GAME OVER” once the snake has hit a wall or itself, also causing all the timers to stop
	gameOvertxt.setPosition(getWidth()/5, getHeight()/2);
	gameOvertxt.setText("GAME OVER: " + score);
	remove(scoreBoard);
	add(end);
	remove(food);
	add(gameOvertxt);
	stopTimer(getFood);
	stopTimer(snakeHit);
	stopTimer(selfHit);
	stopTimer(snakeMovement);
	stopTimer(speedBoost);
}

function snakeMovement(){ //depending on what key is pressed, the snake will move accordingly
	switch(direction){
    	case "left":
        	snake.move(snake.width*-1, 0); //by moving left, the snake is moving closer to the origin, creating a negative value
        	break;
    	case "right":
        	snake.move(snake.width, 0); //when moving right, we just need to move the snake forward which is done by the Timer (animation).
        	break;
    	case "up":
        	snake.move(0, snake.height*-1); //the y-axis starts at 0 (top corner of the canvas) and the farther  down you go, the more positive it becomes. Therefore, by moving up and closer to the origin, the shape will be moved to negatively increase
        	break;
    	case "down":
        	snake.move(0, snake.height); //moving down means that the position is positively increasing, and therefore the shape’s height must be a positive value
        	break;
	}
	if(test == false){
    	setTimer(speedBoost, 100); //once the snake has moved in a direction, the rest of its blocks will follow it, at the same animation speed as regular movement
    	test = true;
	}
}


function speedBoost(){ //when we switch directions, this function will cause all the other blocks to also switch direction, allowing the snake’s blocks move to the same positions as its predecessor
	for(var i = totalSnakes.length - 1; i >= 0; i--){
    	if(i>0){
        	totalSnakes[i].setPosition(totalSnakes[i-1].getX(), totalSnakes[i-1].getY()); // i represents all off the snake blocks and by taking i - 1, we are looking at a previous block’s X and Y value. Therefore, by moving the snake’s head, like a ripple effect, when the snake consumes a food that new block will take the place of the block before it. Essentially allowing each block to follow the other. Without this function, no new blocks would ever be added to the snake.
        	}
    	}
	}
  
  
function playerMovement(e){ //This function takes in a user input (the argument, e) in the form of an arrow key, we match the inputs to a variable which can be used to perform a task if that variable satisfies the condition. 	
if(e.keyCode == Keyboard.LEFT){
    	direction = "left";
	}
	else if(e.keyCode == Keyboard.RIGHT){
    	direction = "right";
	}
	else if(e.keyCode == Keyboard.UP){
    	direction = "up";
	}
	else if(e.keyCode == Keyboard.DOWN){
    	direction = "down";
	}
}
