const SURFACES = {
    TOP : [[0,1],[window.innerWidth/2,0]],
    BOTTOM : [[0,-1],[window.innerWidth/2, window.innerHeight]],
    LEFT : [[1,0], [0, window.innerHeight/2]],
    RIGHT : [[-1,0], [window.innerWidth, window.innerHeight/2]]
}
const EMPTY_COLOR = "rgb(0 0 0)"
const PONG_RADIUS = 10;

class CanvasView {

    constructor(canvasSelector, canvasWidth, canvasHeight) {
        this.canvasSelector = canvasSelector
        this.canvasContext = canvasSelector.getContext("2d");
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.canvasSelector.width = canvasWidth;
        this.canvasSelector.height = canvasHeight;

        this.canvasContext.fillStyle = EMPTY_COLOR;
        this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);        
    }

    // use DI for better testability, can may be mention paddle positions in arguments later
    initialisePaddleViews() {
        this.playerOnePaddleView = new PaddleView(this.canvasContext, this.canvasWidth, 0, 0);
    }

    // use DI for better testability
    initialisePongView(radius) {
        this.pongView = new PongView(this.canvasContext, radius);
    }

    renderPlayerOnePaddle(mouseX) {
        if(this.playerOnePaddleView) {
            this.playerOnePaddleView.renderPaddle(mouseX);
        }
    }

    // renderPlayerTwoPaddle() {

    // }
    renderPong(center) {
        if(this.pongView) {
            this.pongView.renderPong(center);
        }
    }

}

class PaddleView {

    PADDLE_LENGTH = 100;
    PADDLE_WIDTH = 10;
    PADDLE_COLOR = "rgb(255 0 0)"

    constructor(canvasContext, canvasWidth, paddleX, paddleY) {
        this.canvasContext = canvasContext;
        this.canvasWidth = canvasWidth;
        this.paddleX = paddleX;
        this.paddleY = paddleY;
    }

    renderPaddle(mouseX) {

        this.canvasContext.fillStyle = EMPTY_COLOR;
        this.canvasContext.fillRect(
            this.paddleX, this.paddleY, this.PADDLE_LENGTH, this.PADDLE_WIDTH
        );

        if(mouseX - (this.PADDLE_LENGTH/2) <= 0) {

            this.canvasContext.fillStyle = this.PADDLE_COLOR;
            this.canvasContext.fillRect(0, this.paddleY, this.PADDLE_LENGTH, this.PADDLE_WIDTH);
            this.paddleX = 0;

        } else if(mouseX + (this.PADDLE_LENGTH/2) >= this.canvasWidth){

            this.canvasContext.fillStyle = this.PADDLE_COLOR;
            this.canvasContext.fillRect(
                this.canvasWidth-this.PADDLE_LENGTH, this.paddleY, this.PADDLE_LENGTH, this.PADDLE_WIDTH
            );
            this.paddleX = this.canvasWidth-this.PADDLE_LENGTH;

        } else {

            this.canvasContext.fillStyle = this.PADDLE_COLOR;
            this.canvasContext.fillRect(
                mouseX-(this.PADDLE_LENGTH/2), this.paddleY, this.PADDLE_LENGTH, this.PADDLE_WIDTH
            );
            this.paddleX = mouseX - (this.PADDLE_LENGTH/2);
        }
    }
}
class PongView {
    
    PONG_COLOR = "rgb(0 0 255)";
    animationFrameReference = null;
    previousCenter = null;

    constructor(canvasContext, radius) {
        this.PONG_RADIUS = radius;
        this.canvasContext = canvasContext;
    }

    renderPong(center) {

        if(this.previousCenter) {
            this.canvasContext.fillStyle = EMPTY_COLOR;
            this.canvasContext.beginPath();
            this.canvasContext.arc(this.previousCenter[0], this.previousCenter[1], this.PONG_RADIUS, 0, 2*Math.PI, false);
            this.canvasContext.fill();
        }

        this.canvasContext.fillStyle = this.PONG_COLOR;
        this.canvasContext.beginPath();
        this.canvasContext.arc(center[0], center[1], this.PONG_RADIUS, 0, 2*Math.PI, false);
        this.canvasContext.fill();
        this.previousCenter = center;
    }

}
// a surface in general can be described by a normal vector and a point on the surface.
// this representation at the very least can ensure you can calculate how close a given
// point is to a surface by the formula : (point-plane_point) dot-product (plane_normal_vector)
class Surface {

    constructor(normalVector, point) {
        this.normalVector = normalVector;
        this.point = point;
    }

    getDistanceFromSurface(point) {
        const a = [point[0]-this.point[0], point[1]-this.point[1]];
        return a[0]*this.normalVector[0] + a[1]*this.normalVector[1];
    }

    getNormalVector() {
        return this.normalVector;
    }

}
class Pong {
    
    constructor(position, radius, initialSpeed, initialUnitVector) {
        this.position = position;
        this.radius = radius;
        this.currentTimeStamp = null;
        this.speed = initialSpeed;
        this.directionUnitVector = initialUnitVector;
    }

    setCurrentTimeStamp(timeStamp) {
        this.currentTimeStamp = timeStamp;
    }

    setUnitVectorAfterCollision(surface) {
        
        const surfaceNormal = surface.getNormalVector();
        const constant = 
        -2 * (this.directionUnitVector[0]*surfaceNormal[0] + this.directionUnitVector[1] * surfaceNormal[1]);

        this.directionUnitVector = this.directionUnitVector.map((el, index)=> {
            return el + (constant * surfaceNormal[index])
        });
    }

    getPointClosestToSurface(surface) {

        const surfaceNormal = surface.getNormalVector();
        const differenceVector = surfaceNormal.map(el=> {
            return -1 * this.radius * el;
        });
        return this.position.map((el, index)=> {
            return el + differenceVector[index];
        });
    }

    calculateNewPosition() {
        this.position = this.position.map((el, index)=> {
            return Math.round(el + this.directionUnitVector[index]*this.speed);
        });
        return this.position;
    }
}

class Game {

    constructor(surfaces, pong) {
        this.surfaces = surfaces;
        this.pong = pong;
    }

    // LOGIC FOR COLLISION DETECTION :

    // get the point on the circle that is closest to the surface plane/line. 
    // the normal to the plane/line, reversed in direction as the circle is approaching it 
    // and multiplied by the radius can serve as the vector difference between the
    // vector representing the circle center and the vector representing the point we want.
    // Once the point closest to surface is obtained we check the distance between that point
    // and the surface see if it is within the range of 2 to 0 pixels(inclusive)
    // If so, then we determine that a collision has taken place
    detectCollisions() {

        for(let surface of this.surfaces) {
            const point = this.pong.getPointClosestToSurface(surface);
            const pointSurfaceDistance = surface.getDistanceFromSurface(point);
            if(pointSurfaceDistance >=0 && pointSurfaceDistance <=2) {
               this.pong.setUnitVectorAfterCollision(surface); 
               break;
            }
        }
        
    }

    calculateNewPositionOfPong() {
        return this.pong.calculateNewPosition();
    }
}

window.addEventListener('load', async function() {

    const canvas = document.querySelector("#game-canvas");
    const surfaces = [];
    const pong = new Pong([50,50], PONG_RADIUS, 5, [1,1]);

    for(let surface of Object.values(SURFACES)) {
        surfaces.push(new Surface(surface[0], surface[1]));
    }
    const gamePhysics = new Game(surfaces, pong);
    
    const view = new CanvasView(canvas, window.innerWidth, window.innerHeight);
    view.initialisePongView(PONG_RADIUS);
    view.initialisePaddleViews();

    // document.addEventListener("mousemove", (e) => {
    //     view.renderPlayerOnePaddle(e.pageX);   
    // });

    const stopButton = document.querySelector("#animationStopper");
    let animationFrameReference = null;
    stopButton?.addEventListener("click", ()=> {
        if(animationFrameReference) {
            this.window.cancelAnimationFrame(animationFrameReference);
        }
    });

    const animate = (timestamp)=> {
        gamePhysics.detectCollisions();
        const newCenter = gamePhysics.calculateNewPositionOfPong();
        view.renderPong(newCenter);
        animationFrameReference = window.requestAnimationFrame(animate);
    }

    animate(window.performance.now());
});
