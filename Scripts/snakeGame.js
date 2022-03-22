let snake = [[4,2],[3,2],[3,3]];


let m = 10;

let board = new Array(m);


let fruit = spawnFruit();

let exSolution = generateSolution();

for (let i = 0; i < m; i++) {
    board[i] = new Array(0)
    for (let k = 0; k < m; k++) {
        board[i].push(0);
    }
}


function spawnFruit(){
    let fruit = [Math.round(Math.random()*9), Math.round(Math.random()*9)]
    let fruitCheck = true;
    while (fruitCheck) {
        fruit = [Math.round(Math.random()*9), Math.round(Math.random()*9)]
        fruitCheck = false;
        snake.forEach(element => {
            if (element[0] == fruit[0] && element[1] == fruit[1]) {
                fruitCheck = true
                
            }
        });
    }
    return fruit
}



function generateSolution(){
    
    let bias = (Math.random()-0.5)*5
    
    let params = [];
    for (let k = 0; k < 4; k++) {
        let paramsCoords2D = new Array(10)
        for (let i = 0; i < m; i++) {
            paramsCoords2D[i] = new Array(0)
            for (let j = 0; j < m; j++) {
                paramsCoords2D[i].push((Math.random()-0.5)*5);
            }
        }
        params.push(paramsCoords2D);
    }
        
    params.push(bias)

    
    return params;
}



let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');



function predict(params){
    let choice = new Array(4)
    for (let k = 0; k < 4; k++) {
        let sum = 0;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < m; j++) {
                sum += board[i][j]*params[k][i][j];
            }
        }
        choice[k] = sum + params[4];
    }


    let big = choice[0]
    let index=0
    for (let c = 1; c < 4; c++) {
        if (choice[c]>big) {
            index = c;
            big = choice[c];
        }
    }
    return index;
}









function updateBoard(){
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            board[i][j] = 0;
        }
    }
    
    

    snake.forEach(element => {
        board[element[0]][element[1]] = 1;    
    });

    board[snake[0][0]][snake[0][1]] = 3;

    board[fruit[0]][fruit[1]] = -1
}



function drawBoard(board){
    
    
    

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] == 1 || board[i][j] == 3) {
                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.fillRect(i*100, j*100, 100, 100)
            }else if (board[i][j] == -1){
                ctx.fillStyle = 'rgb(0, 255, 0)';
                ctx.fillRect(i*100, j*100, 100, 100)
            }else {
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(i*100, j*100, 100, 100)
            }
            
            
        }
    }

    ctx.fillStyle = 'rgb(0, 0, 255)';
    ctx.fillRect(snake[0][0]*100, snake[0][1]*100, 100, 100);


};






drawBoard(board);
document.addEventListener('keydown', function(event) {
    if(event.code == "ArrowUp") {
        snakeMove(0);
    }
    else if(event.code == "ArrowDown") {
        snakeMove(2);
    }
    else if(event.code == "ArrowRight") {
        snakeMove(1);
    }
    else if(event.code == "ArrowLeft") {
        snakeMove(3)
    }
});

function snakeMove(direction){
    if(direction == 0){
        snake.splice(0, 0, [snake[0][0], snake[0][1] - 1])  
    }
    if(direction == 1){
        snake.splice(0, 0, [snake[0][0] + 1, snake[0][1]])
    }
    if(direction == 2){
        snake.splice(0, 0, [snake[0][0], snake[0][1] + 1])
    }
    if(direction == 3){
        
        snake.splice(0, 0, [snake[0][0] - 1, snake[0][1]])
    }
    
    if(snake[0][0] == fruit[0] && snake[0][1] == fruit[1]){
        fruit = spawnFruit();
    } else{
        snake.splice(snake.length - 1, 1);
    }

    let deathCheck = false;
    snake.slice(1).forEach(element => {
        if (element[0] == snake[0][0] && element[1] == snake[0][1]) {
            deathCheck = true;
        }
    })
    
    

    snake.forEach(element => {
        if (element[0] > 9) {
            element[0] = element[0] - 10
        }
        if (element[0] < 0) {
            element[0] =  10 + element[0]
        }
        if (element[1] > 9) {
            element[1] = element[1] - 10
        }
        if (element[1] < 0) {
            element[1] =  10 + element[1]
        }
    });
    updateBoard();
    //drawBoard(board);
    return deathCheck;
}

drawBoard(board);

params = generateSolution();
console.log(params[2][3][2]);




function gameFitness(solution) {
    snake = [[4,2],[3,2],[3,3]];
    fruit = spawnFruit();
    let alive = true;
    let i = 0;
    let fitness = 0;
    while(alive && i < 500){
        dir = predict(solution);
        if (snakeMove(dir)){
            alive = false;
            fitness = (snake.length - 3)**2;
        }
        i += 1;
    }
    return fitness
}


document.addEventListener('keydown', function(event) {
    if(event.key == "c") {
        dir = predict(exSolution);
        if (snakeMove(dir)){
            snake = [[4,2],[3,2],[3,3]];
            fruit = spawnFruit();
        }
    }
});


function mutateGenes(solution){
    for (let k = 0; k < 4; k++) {
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < m; j++) {
                solution[k][i][j] += solution[k][i][j]*(1 + Math.random()/50);
            }
        }
    }
    solution[5] += solution[5]*(1 + Math.random()/50);
    return solution
}


function generationPass(solutions){
    let solutionRank = [];
    for (let sol = 0; sol < solutions.length; sol++) {
        let avgFitness = 0;
        avgFitness = (gameFitness(solutions[sol]) + gameFitness(solutions[sol]) + gameFitness(solutions[sol]) +gameFitness(solutions[sol]) + gameFitness(solutions[sol]))/5
        solutionRank.push([avgFitness, sol]);
    }
    solutionRank.sort((a,b)=>{return b[0]-a[0]})
    console.log(solutionRank);
    
}



solutions = []

for (let i = 0; i < 100; i++) {
    solutions.push(generateSolution());
}



generationPass(solutions);
