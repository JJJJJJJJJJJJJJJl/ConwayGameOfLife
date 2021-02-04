const ROWS = 24;
const COLS = 50;
var on = 0;

//Sleep Function
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Display board
var petridish = new Array(ROWS);
for(var i=0; i<petridish.length; i++){
    petridish[i] = new Array(COLS);
}

//Next Generation board
var petridishhood = new Array(ROWS);
for(var i=0; i<petridishhood.length; i++){
    petridishhood[i] = new Array(COLS);
}

//Resets the board
function memset(){
    for(var i=0; i<petridishhood.length; i++){
        for(var j=0; j<petridishhood[i].length; j++){
            petridish[i][j] = 0;
            petridishhood[i][j] = 0;
        }
    }
}

//Generates HTML table code
function createTable(){
    var table = "";
    for(var i=0; i<ROWS; i++){
        var cur_row = "";
        cur_row += `<tr id="row-${i}">`;
        for(var j=0; j<COLS; j++){
            cur_row += `<td id="${i},${j}" class="dead" onclick="set(id)"></td>`;
        }
        cur_row += `</tr>`
        table += cur_row;
    }
    document.getElementById('petri').innerHTML = table;
}

//Function name is pretty self explainatory
function calculate_nextgen(){
    for(var i=0; i<petridish.length; i++){
        for(var j=0; j<petridish[i].length; j++){
            var neighbours = 0;
            //i KNOW THIS IS PRETTY SPAGHETTI..ARRAY OF DIRECTIONS WOULD BE MUCH CLEANER IK IK.
            if(i - 1 > -1 && petridish[i-1][j] == 1) neighbours++; 
            if(i + 1 < ROWS && petridish[i+1][j] == 1) neighbours++;
            if(j - 1 > -1 && petridish[i][j-1] == 1) neighbours++;
            if(j + 1 < COLS && petridish[i][j+1] == 1) neighbours++;
            if(i - 1 > -1 && j - 1 > -1 && petridish[i-1][j-1] == 1) neighbours++;
            if(i - 1 > -1 && j + 1 < COLS && petridish[i-1][j+1] == 1) neighbours++;
            if(i + 1 < ROWS && j + 1 < COLS && petridish[i+1][j+1] == 1) neighbours++;
            if(i + 1 < ROWS && j - 1 > -1 && petridish[i+1][j-1] == 1) neighbours++;

            if(petridish[i][j] == 1){
                if(neighbours == 2 || neighbours == 3) petridishhood[i][j] = 1;
                else petridishhood[i][j] = 0;
            }
            else{
                if(neighbours == 3) petridishhood[i][j] = 1;
                else petridishhood[i][j] = 0;
            }
        }
    }
}

//This one as well
function apply(){
    for(var i=0; i<petridishhood.length; i++){
        for(var j=0; j<petridishhood[i].length; j++){
            var cell = petridishhood[i][j];
            petridish[i][j] = cell;
            var id = "" + i + "," + j;
            var element = document.getElementById(id);
            if(cell == 1){ 
                element.className = "alive";
            }
            else{ 
                element.className = "dead";
            }
        }
    }
}

//Mouse pressed cell
async function set(id){
    var idd = id.split(",");
    var row = idd[0];
    var col = idd[1];
    var element = document.getElementById(id);
    var state = document.getElementById(id).className;
    if(state == 'dead'){ 
        element.className = "alive";
        petridish[row][col] = 1;
    }
    else{ 
        element.className = "dead";
        petridish[row][col] = 0;
    }
}

//Starts reproduction ('async' must be defined so javascript wont act like javascript)
async function run(){
    on = 1;
    while(on == 1){
        calculate_nextgen();
        await sleep(50);
        apply();
        await sleep(50);
    }
}

//Stop reproduction
function stop(){
    on = 0;
}

//Resets everything
function reset(){
    for(var i=0; i<petridish.length; i++){
        for(var j=0; j<petridish[i].length; j++){
            petridish[i][j] = 0;
            document.getElementById(""+i+","+j).className = "dead";
        }
    }
}

function random(){
    reset();
    for(var i=0; i<petridish.length; i++){
        for(var j=0; j<petridish[i].length; j++){
            rand = Math.random();
            cell = document.getElementById(""+i+","+j);
            if(cell.className == 'alive') continue;
            if(rand > 0.5){
                cell.className = 'alive';
                petridish[i][j] = 1;
            }
        }
    }
}

memset();
createTable();