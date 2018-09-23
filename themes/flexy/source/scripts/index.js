console.log("script")
var transitionSpeed = {"x":0,"y":0}

var c = document.getElementById("canvas")
var canvas = {"width":window.innerWidth,"height":window.innerHeight,"context":null}

c.width = canvas.width;
c.height = canvas.height;
window.addEventListener('resize', function(){
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	c.width = canvas.width;
	c.height = canvas.height;
}, false);

canvas.context = c.getContext('2d');
canvas.context.fillStyle = '#00cfbb'
canvas.context.fillRect(0,0,canvas.width,canvas.height);
var points = [{"x":100,"y":100,"velX":0,"velY":0,"speed":1,"radius":4}];
var mousePos = {"x":canvas.width/2,"y":canvas.height/2};

var time = {"sinceLastStep":0,"lastStep":Date.now(),"startDate":Date.now()}
var stepTimer = 0;


for(var i = 0; i<240; i++){
		points.push({"x":Math.random()*canvas.width,"y":Math.random()*canvas.width,"velX":0,"velY":0,"speed":1,"radius":4+ Math.random()})
}

function updateCoords(event){
	mousePos.x = event.clientX;
	mousePos.y = event.clientY;
}

function step(){

	doPhysics();
	renderScene();
	stepTimer++;
	window.requestAnimationFrame(step)
}

function updateSize(){
	//console.log(window.innerWidth)
	canvas.width = window.innerWidth
}

function doPhysics(){
	var speed = 200
	var now = Date.now();
	time.sinceLastStep = (now-time.lastStep)/1;
	if(time.sinceLastStep > 50){
		time.sinceLastStep = 0
	}
	if(inTransition != "none" ){

		if(inTransition == "left"){
			transitionSpeed.x = -speed;

		}
		else if(inTransition == "right"){
			transitionSpeed.x = speed;

		}
		else if(inTransition == "up"){
			transitionSpeed.y = -speed;

		}
		else if(inTransition == "down"){
			transitionSpeed.y = speed;

		}
	}

	for(var p = 0; p< points.length; p++){
		var dx = -mousePos.x +points[p].x;
		var dy = -mousePos.y + points[p].y;
		if(dx == 0){dx = .01;}
		if(dy == 0){dy = .01;}

		var unitX = dy
		var unitY = -dx;
		var rad = Math.sqrt(dx*dx+dy*dy)


		points[p].radius = rad/100// 800/(rad+40)

		if(rad < 3000){
			if( points[p].speed <= 1 || transitionSpeed.x + transitionSpeed.y != 0){
				points[p].velX = unitX/rad*20 - dx/Math.abs(dx) ;
				points[p].velY = unitY/rad*20 - dy/Math.abs(dy) ;
			}

		}
		else{
			points[p].velX = 0;
			points[p].velY = 0;
		}


		if(rad < 30){
			points[p].speed=1.5
		}
		else if(points[p].speed > 1){
			points[p].speed -=.01
		}
		else{
			points[p].speed = 1
		}
		points[p].velX += transitionSpeed.x
		points[p].velY += transitionSpeed.y



		points[p].x += points[p].velX * time.sinceLastStep/1000 * points[p].speed*2 ;
		points[p].y += points[p].velY * time.sinceLastStep/1000 * points[p].speed*2;
		if(points[p].x > canvas.width+20){points[p].x = (points[p].x - canvas.width)*-1}
		else if(points[p].x < -20){points[p].x = canvas.width + points[p].x*-1}
		if(points[p].y > canvas.height+20){points[p].y = (points[p].y - canvas.height)*-1}
		else if(points[p].y < -20){points[p].y = canvas.height + points[p].y*-1}

	}

	var deccelerationSpeed = speed/50;



	// if(transitionSpeed.x != 0 && transitionSpeed.x > deccelerationSpeed){
	// 	transitionSpeed.x-=deccelerationSpeed;
	// }
	// else if(transitionSpeed.x != 0 && transitionSpeed.x < -deccelerationSpeed){
	// 	transitionSpeed.x+=deccelerationSpeed;
	// }
	// else if(transitionSpeed.x != 0){
	// 	
	// }
	// if(transitionSpeed.y != 0 && transitionSpeed.y > deccelerationSpeed){
	// 	transitionSpeed.y-=deccelerationSpeed;
	// }
	// else if(transitionSpeed.y != 0 && transitionSpeed.y < -deccelerationSpeed){
	// 	transitionSpeed.y+=deccelerationSpeed;
	// }
	// else if(transitionSpeed.y != 0){
	// 	
	// }


	transitionSpeed.y = 0;
	transitionSpeed.x = 0;


	time.lastStep = now;


}


function renderScene(){
	canvas.context.fillStyle = '#fefefe'//'white'//'#00cfbb'//'#00bbbb'
	canvas.context.fillRect(0,0,canvas.width,canvas.height);
	canvas.context.fillStyle = 'black'
	canvas.context.globalAlpha = 0.6 ;
	var prevPoint={"x":0,"y":0}
	for(var p = 0; p<points.length; p++){
		canvas.context.beginPath();
		canvas.context.globalAlpha = 1/points[p].radius ;
		if(points[p].radius < 1){
			canvas.context.globalAlpha = 1
		}
		canvas.context.arc(points[p].x,points[p].y,points[p].radius+1,0,Math.PI*2,false);
		canvas.context.fill();



	}
	canvas.context.globalAlpha = 1



}


inTransition = "none"
step();