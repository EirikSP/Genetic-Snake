let snake = [[4,2],[3,2],[3,3], [3,4],[3,5]];


let m = 20;

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
    let fruit = [Math.round(Math.random()*(m-1)), Math.round(Math.random()*(m-1))]
    let fruitCheck = true;
    while (fruitCheck) {
        fruit = [Math.round(Math.random()*(m-1)), Math.round(Math.random()*(m-1))]
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
    
    let bias = [(Math.random()-0.5)*50]*4
    
    let params = [];
    for (let k = 0; k < 4; k++) {
        let paramsCoords2D = new Array(10)
        for (let i = 0; i < m; i++) {
            paramsCoords2D[i] = new Array(0)
            for (let j = 0; j < m; j++) {
                paramsCoords2D[i].push((Math.random()-0.5)*50);
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
        choice[k] = sum + params[4][k];
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



updateBoard();





function updateBoard(){
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            board[i][j] = 0;
        }
    }
    
    

    snake.forEach(element => {
        board[element[0]][element[1]] = 1;    
    });

    board[fruit[0]][fruit[1]] = -1
}



function drawBoard(board){
    
    
    

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] == 1 || board[i][j] == 3) {
                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.fillRect(i*1000/m, j*1000/m, 1000/m, 1000/m)
            }else if (board[i][j] == -1){
                ctx.fillStyle = 'rgb(0, 255, 0)';
                ctx.fillRect(i*1000/m, j*1000/m, 1000/m, 1000/m)
            }else {
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(i*1000/m, j*1000/m, 1000/m, 1000/m)
            }
            
            
        }
    }

    ctx.fillStyle = 'rgb(0, 0, 255)';
    ctx.fillRect(snake[0][0]*1000/m, snake[0][1]*1000/m, 1000/m, 1000/m);


};






drawBoard(board);
document.addEventListener('keydown', function(event) {
    if(event.code == "ArrowUp") {
        snakeMove(0, 1);
    }
    else if(event.code == "ArrowDown") {
        snakeMove(2, 1);
    }
    else if(event.code == "ArrowRight") {
        snakeMove(1, 1);
    }
    else if(event.code == "ArrowLeft") {
        snakeMove(3, 1)
    }
});

function snakeMove(direction, show){
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
        if (element[0] > m-1) {
            element[0] = element[0] - m
        }
        if (element[0] < 0) {
            element[0] =  m + element[0]
        }
        if (element[1] > m-1) {
            element[1] = element[1] - m
        }
        if (element[1] < 0) {
            element[1] =  m + element[1]
        }
    });
    updateBoard();
    if (show) {
        drawBoard(board);
    }
    
    return deathCheck;
}


params = generateSolution();
console.log(params[2][3][2]);




function gameFitness(solution) {
    snake = [[4,2],[3,2],[3,3], [3,4],[3,5]];
    fruit = spawnFruit();
    let alive = true;
    let i = 0;
    let fitness = 0;
    while(alive && i < 200){
        dir = predict(solution);
        if (snakeMove(dir, 0)){
            alive = false;
            fitness = (snake.length - 5)**2;
        }
        i += 1;
    }
    return fitness
}


document.addEventListener('keydown', function(event) {
    if(event.key == "c") {
        dir = predict(exSolution);
        if (snakeMove(dir, 1)){
            snake = [[4,2],[3,2],[3,3], [3,4],[3,5]];
            fruit = spawnFruit();
            updateBoard();
        }
    }
});


function mutateGenes(solution){
    let mutatedSolution = JSON.parse(JSON.stringify(solution))
    for (let k = 0; k < 4; k++) {
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < m; j++) {
                if (Math.random()<0.4) {
                    mutatedSolution[k][i][j] = mutatedSolution[k][i][j]*(1 + (Math.random()-0.5)/5) + (Math.random()-0.5)*2;
                }
                
            }
        }
        mutatedSolution[4][k] = mutatedSolution[4][k]*(1 + (Math.random()-0.5)/5);
    }
    
    return mutatedSolution
}


function generationPass(solutions){
    let solutionRank = [];
    let nextGeneration = [];
    for (let sol = 0; sol < solutions.length; sol++) {
        let avgFitness = 0;
        avgFitness = (gameFitness(solutions[sol]) + gameFitness(solutions[sol]) + gameFitness(solutions[sol]) +gameFitness(solutions[sol]) + gameFitness(solutions[sol]))/5
        solutionRank.push([avgFitness, sol]);
    }
    solutionRank.sort((a,b)=>{return b[0]-a[0]})
    for (let i = 0; i < 6; i++) {
        nextGeneration.push(solutions[solutionRank[i][1]]);
        for (let k = i; k <14; k++) {
            nextGeneration.push(mutateGenes(solutions[solutionRank[i][1]]));
        }
    }
    nextGeneration.push(solutions[solutionRank[50][1]]);
    return nextGeneration;
}


let goodEnough = false;
solutions = []

for (let i = 0; i < 100; i++) {
    solutions.push(generateSolution());
}


let scoreTrack = 0;
for (let gen = 0; gen < 200; gen++) {
    solutions = generationPass(solutions);
    scoreTrack += (gameFitness(solutions[0])+ gameFitness(solutions[0])+ gameFitness(solutions[0])+ gameFitness(solutions[0])+ gameFitness(solutions[0]))/5;
    if (gen%20==0) {
        console.log(scoreTrack/20);
        scoreTrack = 0;
    }
}

exSolution = solutions[0];

console.log(solutions);



