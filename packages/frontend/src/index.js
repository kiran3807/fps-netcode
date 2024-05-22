const PADDLE_LENGTH = 100;
const PADDLE_WIDTH = 10;

class Game { 

    constructor(ctx, gameCanvasWidth, gameCanvasHeight) {
        this.playerOnePaddleX = 0;
        this.playerTwoPaddleX = 0;
        this.gameCanvasWidth = gameCanvasWidth;
        this.gameCanvasHeight = gameCanvasHeight;
        this.ctx = ctx;
    }

    movePlayer1Paddle(curX) {

        this.ctx.fillStyle = "rgb(0 0 0)";
        this.ctx.fillRect(this.playerOnePaddleX, 0, PADDLE_LENGTH, PADDLE_WIDTH);

        if(curX - (PADDLE_LENGTH/2) <= 0) {
            this.ctx.fillStyle = "rgb(255 0 0)";
            this.ctx.fillRect(0, 0, PADDLE_LENGTH, PADDLE_WIDTH);
            this.playerOnePaddleX = 0;
        } else if(curX + (PADDLE_LENGTH/2) >= this.gameCanvasWidth){
            this.ctx.fillStyle = "rgb(255 0 0)";
            this.ctx.fillRect(this.gameCanvasWidth-PADDLE_LENGTH, 0, PADDLE_LENGTH, PADDLE_WIDTH);
            this.playerOnePaddleX = this.gameCanvasWidth-PADDLE_LENGTH;
        } else {
            this.ctx.fillStyle = "rgb(255 0 0)";
            this.ctx.fillRect(curX-(PADDLE_LENGTH/2), 0, PADDLE_LENGTH, PADDLE_WIDTH);
            this.playerOnePaddleX = curX - (PADDLE_LENGTH/2);
        }
    }
}

window.addEventListener('load', function() {

    const canvas = document.querySelector("#game-canvas");
    const ctx = canvas.getContext("2d");

    const gameCanvasWidth = (canvas.width = window.innerWidth);
    const gameCanvasHeight = (canvas.height = window.innerHeight);

    ctx.fillStyle = "rgb(0 0 0)";
    ctx.fillRect(0, 0, gameCanvasWidth, gameCanvasHeight);
    const game = new Game(ctx, gameCanvasWidth, gameCanvasHeight);

    document.addEventListener("mousemove", (e) => {
        game.movePlayer1Paddle(e.pageX);   
    });

    // ctx.fillStyle = "rgb(0 255 0)";
    // ctx.fillRect(75, 75, 100, 100);

    // ctx.lineWidth = 5;
    // ctx.strokeStyle = "rgb(255 255 255)";
    // ctx.strokeRect(25, 25, 175, 200);

    // ctx.fillStyle = "red";
    // ctx.font = "48px georgia";
    // ctx.fillText("Wilcommen", 50, 150);


});