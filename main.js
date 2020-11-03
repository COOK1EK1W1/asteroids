var canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var height = window.innerHeight;
var width = window.innerWidth;

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

ctx.fillStyle = "black";
ctx.fillRect(0,0,width, height);

var asteroids = [];

const G = 0.1;

class Asteroid{

    constructor(x,y,mass){
        this.x = x;
        this.y = y;
        this.mass = mass;
		this.radius = Math.sqrt(this.mass / Math.PI);
        this.xv = 0;
        this.yv = 0;
        this.colour = '#'+Math.floor(Math.random()*16777215).toString(16);
		this.has_bouced = false;
    }

    draw(){
        ctx.fillStyle = this.colour;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    stepa(){
        this.x += this.xv;
        this.y += this.yv;
        this.xv *= 0.99999;
        this.yv *= 0.99999;

        if (this.x > width){this.x = 2 * width - this.x; this.xv = -this.xv}
        if (this.y > height){this.y = 2 * height - this.y; this.yv = -this.yv}
        if (this.x < 0){this.x = -this.x; this.xv = -this.xv}
        if (this.y < 0){this.y = -this.y; this.yv = -this.yv}
    }

}

function setup(){
    for (var i = 0; i < 2;i++){
        asteroids.push(new Asteroid(Math.floor(Math.random() * width), Math.floor(Math.random() * height), Math.floor(Math.random() * 1000 + 300)));
        asteroids[i].draw();
    }
}

function step(){
    
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width, height);
    for (var i = 0; i < asteroids.length; i++){
        var vector = [0,0];
        for (var x = 0; x < asteroids.length; x++){
            if (x != i){
                var a = (asteroids[i].x - asteroids[x].x);
                var b = (asteroids[i].y - asteroids[x].y);
                var c = Math.sqrt(Math.abs(a * a + b * b));
                if (c < asteroids[i].radius + asteroids[x].radius){
					if (asteroids[i].has_bouced == false){
						asteroids[i].has_bouced = true;
						asteroids[x].has_bouced = true;
						var rx = asteroids[x].x - asteroids[i].x;
						var ry = asteroids[x].y - asteroids[i].y;
						var rlen = Math.sqrt(rx*rx+ry*ry);
						var scale = rlen / asteroids[i].radius;
						
						ctx.fillStyle = "red";
						ctx.strokeStyle = "white";
						ctx.beginPath();
						ctx.arc(asteroids[i].x + rx / scale, asteroids[i].y + ry / scale, 200, 0, 2*Math.PI);
						ctx.fill();
						ctx.stroke();
						console.log(rx * scale, ry * scale);
						//var rxv = asteroids[x].xv - asteroids[i].xv;
						//var ryv = asteroids[x].yv - asteroids[i].yv;
					}
                }else{
                var FORCE = -G * ((asteroids[i].mass * asteroids[x].mass) / (c * c));
                var ACCELERATION = FORCE / asteroids[i].mass;
                var scale = c / ACCELERATION;
                vector[0] += a / scale;
                vector[1] += b / scale;
                
            }
            }
            
        }
        asteroids[i].xv += vector[0];
        asteroids[i].yv += vector[1];
        
    }
    for (var i = 0; i < asteroids.length; i++){
        asteroids[i].stepa();
        asteroids[i].draw();
		asteroids[i].has_bouced = false;
    }
}
setup();
var lolz = setInterval(step, 10);
