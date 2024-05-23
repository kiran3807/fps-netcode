const SURFACE_NORMALS = {
    TOP : [0,-1],
    BOTTOM : [0,1],
    LEFT : [1,0],
    RIGHT : [-1,0]
}

class CanvasView {

    constructor(canvasSelector, canvasWidth, canvasHeight) {
        this.canvasSelector = canvasSelector
        this.canvasContext = canvasSelector.getContext("2d");
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.canvasSelector.width = canvasWidth;
        this.canvasSelector.height = canvasHeight;

        this.playerOnePaddleView = new PaddleView(this.canvasContext, canvasWidth, 0);

        this.canvasContext.fillStyle = "rgb(0 0 0)";
        this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);        
    }

    renderPlayerOnePaddle(mouseX) {
        this.playerOnePaddleView.renderPaddle(mouseX);
    }

    renderPlayerTwoPaddle() {

    }
}

class PaddleView {

    PADDLE_LENGTH = 100;
    PADDLE_WIDTH = 10;

    constructor(canvasContext, canvasWidth, paddleX) {
        this.canvasContext = canvasContext;
        this.canvasWidth = canvasWidth;
        this.paddleX = paddleX;
    }

    renderPaddle(mouseX) {

        this.canvasContext.fillStyle = "rgb(0 0 0)";
        this.canvasContext.fillRect(
            this.paddleX, 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH
        );

        if(mouseX - (this.PADDLE_LENGTH/2) <= 0) {
            this.canvasContext.fillStyle = "rgb(255 0 0)";
            this.canvasContext.fillRect(0, 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH);
            this.paddleX = 0;
        } else if(mouseX + (this.PADDLE_LENGTH/2) >= this.canvasWidth){
            this.canvasContext.fillStyle = "rgb(255 0 0)";
            this.canvasContext.fillRect(
                this.canvasWidth-this.PADDLE_LENGTH, 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH
            );
            this.paddleX = this.canvasWidth-this.PADDLE_LENGTH;
        } else {
            this.canvasContext.fillStyle = "rgb(255 0 0)";
            this.canvasContext.fillRect(
                mouseX-(this.PADDLE_LENGTH/2), 0, this.PADDLE_LENGTH, this.PADDLE_WIDTH
            );
            this.paddleX = mouseX - (this.PADDLE_LENGTH/2);
        }
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

    // ctx.fillStyle = "rgb(0 0 255)";
    // ctx.beginPath();
    // ctx.arc(150, 106, 50, 0, 2*Math.PI, false);
    // ctx.fill();

    const view = new CanvasView(canvas, window.innerWidth, window.innerHeight);

    document.addEventListener("mousemove", (e) => {
        view.renderPlayerOnePaddle(e.pageX);   
    });
});