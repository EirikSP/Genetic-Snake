

let m = 10;

let board = new Array(m);


let fruit = [3, 2];



for (let i = 0; i < m; i++) {
    board[i] = new Array(0)
    for (let k = 0; k < m; k++) {
        board[i].push(0);
    }
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



function drawBoard(){
    
    updateBoard();
    

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
};




let snake = new Array(0);
snake.push([4,2])
snake.push([3,2])
snake.push([3,3])
snake.push([3,4])
snake.push([3,5])

drawBoard();
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
        snake.splice(snake.length- 1, 1);
        snake.splice(0, 0, [snake[0][0], snake[0][1] - 1])  
    }
    if(direction == 1){
        snake.splice(snake.length- 1, 1);
        snake.splice(0, 0, [snake[0][0] + 1, snake[0][1]])  
    }
    if(direction == 2){
        snake.splice(snake.length- 1, 1);
        snake.splice(0, 0, [snake[0][0], snake[0][1] + 1])  
    }
    if(direction == 3){
        snake.splice(snake.length- 1, 1);
        snake.splice(0, 0, [snake[0][0] - 1, snake[0][1]])  
    }
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
    drawBoard();
}

drawBoard();

params = generateSolution();
console.log(params[2][3][2]);


i=0


while (i < 1000) {
    dir = predict(generateSolution());
    snakeMove(dir)
    i +=1
}
