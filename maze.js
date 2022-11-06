
export default getMaze;

const VALUE_UNDEF = 0;
const VALUE_WALL = 1;
const VALUE_PATH = 2;

const EAST = 0;
const WEST = 1;
const SOUTH = 2;
const NORTH = 3;

function setWall(greed, map_size){
    var i, row, col;
    for(i=0; i<map_size; i++){
        greed[0][i] = VALUE_WALL; // left line
        greed[map_size-1][i] = VALUE_WALL; // right line
        greed[i][0] = VALUE_WALL; // top line
        greed[i][map_size-1] = VALUE_WALL; // bottom line
    }
    for(row=0; row<map_size; row+=2){
        for(col=0; col<map_size; col+=2){
            greed[row][col] = VALUE_WALL; //모서리 초기화
        }
    }
}

function makePath(greed, myX, myY, pathDirection, map_size){
    var directions = new Array(3);

    // Find new direction for each direction (except path direction it was from)
    for(var k=0; k<3; k++){
        var n = -1;
        while(n == -1){  
            n = Math.round(Math.random()*10) % 4;
            for(var j=0; j<3; j++){
                if(n==directions[j] || n==pathDirection){
                    n = -1;
                    break;
                }
            }
        }
        directions[k] = n;
    }

    var checkX, checkY;
	var wallX, wallY;
	var nextDir;

	for(var i=0; i<3; i++){
		checkX = myX;
		checkY = myY;
	    wallX = myX;
		wallY = myY;

		switch(directions[i]){
			case EAST:
				checkX = myX + 2;
				wallX = myX + 1;
				nextDir = WEST;
				break;
			case WEST:
				checkX = myX - 2;
				wallX = myX - 1;
				nextDir = EAST;
				break;
			case SOUTH:
				checkY = myY - 2;
				wallY = myY - 1;
				nextDir = NORTH;
				break;
			case NORTH:
				checkY = myY + 2;
				wallY = myY + 1;
				nextDir = SOUTH;
				break;
		}

		if(0 < checkX && checkX < map_size && 0 < checkY && checkY < map_size){
			if(greed[checkX][checkY]==VALUE_UNDEF){ // if next direction was undefined, construct new path
				greed[checkX][checkY] = VALUE_PATH;
				makePath(greed, checkX, checkY, nextDir, map_size);
			}else{ // if next direction was pre-defined, construct wall there 
				greed[wallX][wallY] = VALUE_WALL;
			}
		}
	}
}

function getMaze(map_size){
    // Initialize greed
    var greed = new Array();
    for (var i=0; i<map_size; i++) {
        greed[i] = new Array(map_size);
        for (var j=0; j<map_size; j++){
            greed[i][j] = 0;
        }
    }
    // Construct Wall
    setWall(greed, map_size);

    // Make Path
    makePath(greed, 1, 1, SOUTH, map_size); // Start from 1, 1
    greed[2][1] = 0; // Destroy only one direction from 1, 1
    greed[0][1] = 0; // Destroy one wall on outer barrier
    
    // Mark path as 0
    for(var row=0; row<map_size; row++){
        for(var col=0; col<map_size; col++){
            if (greed[col][row] == 2) greed[col][row] = 0;
        }
    }
    return greed;
}