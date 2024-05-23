const SURFACE_NORMALS = {
    TOP : [0,-1],
    BOTTOM : [0,1],
    LEFT : [1,0],
    RIGHT : [-1,0]
}

class CanvasView {

    // PADDLE_LENGTH = 100;
    // PADDLE_WIDTH = 10;

    constructor(canvasSelector, canvasWidth, canvasHeight) {
        this.canvasSelector = canvasSelector
        this.canvasContext = canvasSelector.getContext("2d");
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.canvasSelector.width = canvasWidth;
        this.canvasSelector.height = canvasHeight;

        this.playerOnePaddleX = 0;
        this.playerTwoPaddleX = 0;

        this.playerOnePaddleView = new PaddleView(this.canvasContext, canvasWidth);

        this.canvasContext.fillStyle = "rgb(0 0 0)";
        this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);        
    }

    // _renderPaddle(paddleX, mouseX) {

    //     this.canvasContext.fillStyle = "rgb(0 0 0)";
    //     this.canvasContext.fillRect(
    //         paddleX, 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH
    //     );

    //     if(mouseX - (this.PADDLE_LENGTH/2) <= 0) {
    //         this.canvasContext.fillStyle = "rgb(255 0 0)";
    //         this.canvasContext.fillRect(0, 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH);
    //         paddleX = 0;
    //     } else if(mouseX + (this.PADDLE_LENGTH/2) >= this.canvasWidth){
    //         this.canvasContext.fillStyle = "rgb(255 0 0)";
    //         this.canvasContext.fillRect(
    //             this.canvasWidth-this.PADDLE_LENGTH, 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH
    //         );
    //         paddleX = this.canvasWidth-this.PADDLE_LENGTH;
    //     } else {
    //         this.canvasContext.fillStyle = "rgb(255 0 0)";
    //         this.canvasContext.fillRect(
    //             mouseX-(this.PADDLE_LENGTH/2), 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH
    //         );
    //         paddleX = mouseX - (this.PADDLE_LENGTH/2);
    //     }

    //     return paddleX;
    // }

    renderPlayerOnePaddle(mouseX) {
        this.playerOnePaddleX = this.playerOnePaddleView.renderPaddle(this.playerOnePaddleX, mouseX);
    }

    renderPlayerTwoPaddle() {

    }
}

class PaddleView {

    PADDLE_LENGTH = 100;
    PADDLE_WIDTH = 10;
    constructor(canvasContext, canvasWidth) {
        this.canvasContext = canvasContext;
        this.canvasWidth = canvasWidth;
    }

    renderPaddle(paddleX, mouseX) {

        this.canvasContext.fillStyle = "rgb(0 0 0)";
        this.canvasContext.fillRect(
            paddleX, 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH
        );

        if(mouseX - (this.PADDLE_LENGTH/2) <= 0) {
            this.canvasContext.fillStyle = "rgb(255 0 0)";
            this.canvasContext.fillRect(0, 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH);
            paddleX = 0;
        } else if(mouseX + (this.PADDLE_LENGTH/2) >= this.canvasWidth){
            this.canvasContext.fillStyle = "rgb(255 0 0)";
            this.canvasContext.fillRect(
                this.canvasWidth-this.PADDLE_LENGTH, 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH
            );
            paddleX = this.canvasWidth-this.PADDLE_LENGTH;
        } else {
            this.canvasContext.fillStyle = "rgb(255 0 0)";
            this.canvasContext.fillRect(
                mouseX-(this.PADDLE_LENGTH/2), 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH
            );
            paddleX = mouseX - (this.PADDLE_LENGTH/2);
        }

        return paddleX;
    }
}

class Ball {
    
    constructor(initX, initY, initialSpeed, initialUnitVector) {

        this.currentX = initX;
        this.currentY = initY;
        this.speed = speed;
        this.unitVector = unitVector;

        window.requestAnimationFrame(()=> {

        });
    }

    setBallPosition(time) {
        this.currentX = this.currentX + this.unitVector[0]*time;
        this.currentY = this.currentY + this.unitVector[1]*time;
    }

    setUnitVectorAfterCollision(surfaceNormal) {
        
        const constant = 
        -2 * (this.unitVector[0]*surfaceNormal[0] + this.unitVector[1] * surfaceNormal[1]);

        this.unitVector = [
            this.unitVector[0]-(constant * surfaceNormal[0]), 
            this.unitVector[1]-(constant * surfaceNormal[1])
        ];
    }
}

window.addEventListener('load', function() {

    const canvas = document.querySelector("#game-canvas");
    // const ctx = canvas.getContext("2d");

    // const gameCanvasWidth = (canvas.width = window.innerWidth);
    // const gameCanvasHeight = (canvas.height = window.innerHeight);

    // ctx.fillStyle = "rgb(0 0 0)";
    // ctx.fillRect(0, 0, gameCanvasWidth, gameCanvasHeight);
    //const game = new Game(ctx, gameCanvasWidth, gameCanvasHeight);

    // document.addEventListener("mousemove", (e) => {
    //     game.movePlayer1Paddle(e.pageX);   
    // });


    // ctx.fillStyle = "rgb(0 0 255)";
    // ctx.beginPath();
    // ctx.arc(150, 106, 50, 0, 2*Math.PI, false);
    // ctx.fill();

    const view = new CanvasView(canvas, window.innerWidth, window.innerHeight);

    document.addEventListener("mousemove", (e) => {
        view.renderPlayerOnePaddle(e.pageX);   
    });
});