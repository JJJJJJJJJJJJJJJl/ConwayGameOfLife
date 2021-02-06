const ROWS = 25;
const COLS = 50;
var on = 0;
var dirx = [0,0,1,-1,-1,-1,1,1]
var diry = [-1,1,0,0,-1,1,-1,1]

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
            for(var k=0; k<dirx.length; k++){
                var row = i + diry[k];
                var col = j + dirx[k];
                if(row > -1 && row < ROWS && col > -1 && col < COLS && petridish[row][col] == 1) neighbours++;
            }
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

//Switch button innerHTML
function buttonHTML(){
    var state = document.getElementById("run");
    if(state.innerHTML == "Run") state.innerHTML = "Stop";
    else state.innerHTML = "Run";
}

//Switch 'on' 0/1
function onSwitch(){
    if(on == 1) on = 0;
    else on = 1;
}

//Starts/Stop reproduction
async function run(){
    buttonHTML();
    onSwitch();
    while(on == 1){
        calculate_nextgen();
        await sleep(50);
        apply();
        await sleep(50);
    }
}

//Resets everything
function reset(){
    if(on == 0){ 
        for(var i=0; i<petridish.length; i++){
            for(var j=0; j<petridish[i].length; j++){
                petridish[i][j] = 0;
                document.getElementById(""+i+","+j).className = "dead";
            }
        }
    }
}

//Generate random living cells
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

//Gosper Glider Gun
var gosperglidergun = () =>{
    reset();
                                                                                                                                                set("5,31")
                                                                                                                            set("6,29");    set("6,31");
                                            set("7,19");set("7,20");                                        set("7,27");set("7,28");                                 set("7,41");set("7,42");
                                        set("8,18");             set("8,22");                               set("8,27");set("8,28");                                 set("8,41");set("8,42");
    set("9,7");set("9,8");          set("9,17");                          set("9,23");                      set("9,27");set("9,28");
    set("10,7");set("10,8");        set("10,17");            set("10,21");set("10,23");set("10,24");                        set("10,29");   set("10,31");
                                    set("11,17");                         set("11,23");                                                         set("11,31");
                                        set("12,18");            set("12,22");
                                            set("13,19");set("13,20");
}

memset();
createTable();