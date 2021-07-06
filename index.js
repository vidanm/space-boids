
// Aliases
let loader = PIXI.Loader.shared;
let resources = loader.resources;
let Sprite = PIXI.Sprite;

// Init rendering window
const app = new PIXI.Application({
	antialias: false,
	width: 512,
	height: 512,
	backgroundColor: 0x0d0d1d,
	resolution: 1
});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);


//Loading Resources
loader
	.add("boid", "https://i.ibb.co/cgvM29P/boid.png")
	.add("background", "https://i.ibb.co/0MKCW8n/bg.jpg")
	.load(setup);

const dist_repulsive = 10;
const dist_orienting = 25;
const dist_attract = 50;
let boids = [], bg;
let num = 150;
let state;
let boid_container = new PIXI.Container();

// Display
function setup(){
	
	let blurFilter = new PIXI.filters.BlurFilter();
	blurFilter.blur = 0;

	bg = new Sprite(resources.background.texture);
	bg.filters = [blurFilter];
	bg.scale.x = 1.5
	bg.scale.y = 2

	for (let i = 0;i<num;i++){
		boid = new Sprite(resources.boid.texture);
		boid.anchor.set(0.5);
		boid.x = Math.random()*app.screen.width;
		boid.y = Math.random()*app.screen.height;
		boid.vx = Math.random()*5;
		boid.vy = Math.random()*5;
		boid.rotation = Math.random()*Math.PI*2;
		boid.scale.x = 0.25;
		boid.scale.y = 0.25;
		boids.push(boid);
		boid_container.addChild(boid);
	}

	app.stage.addChild(boid_container);
	bg.mask = boid;
	state = play;
	app.stage.addChild(bg);
	app.ticker.add(delta => boidLoop(delta));
}

function boidLoop(delta){
	state(delta);
}

function move(object) {
	object.x += object.vx * Math.cos(object.rotation-Math.PI/2);
	object.y += object.vy * Math.sin(object.rotation-Math.PI/2);
	if (object.x > window.innerWidth+2){
		object.x = -1;
	} else if (object.x < -2){
		object.x = window.innerWidth+1;
	} else if (object.y > window.innerHeight+2){
		object.y = -1;
	} else if (object.y < -2){
		object.y = window.innerHeight +1;
	}

}

function play(delta){
	for (let i=0;i<num;i++){
		let boid = boids[i];
		move(boid);
		boidsBehavior(delta);
	}
}

function distanceBetweenTwoBoids(a, b){
	return Math.sqrt(
		Math.pow(b.x - a.x,2) +
		Math.pow(b.y - a.y,2));
}

function boidsBehavior(delta){
	// Calculer l'average heading of local flockmates
	// l'average necessaire a l'evitement
	// puis l'average centre de masse du groupe
	// ensuite ajouter a la rotation
	let a;
	let numMate; //Number of local flockmates
	let sumR; //sum of all the rotation rules
	let sumVx;
	let sumVy;
	let moveSpeed = 0.05;

	for (let i = 0;i < num;i++){
		a = boids[i];
		numMate = 0;
		sumR = 0;
		sumVx = 0;
		sumVy = 0;
		for (let j = 0;j < num; j++){
			let b = boids[j];
			let tan = ((b.x - a.x) != 0 ? Math.atan((b.y - a.y)/(b.x - a.x)) : Math.PI);
			let dist = distanceBetweenTwoBoids(a, b);

			if (dist != 0){
				if (dist <= dist_repulsive){
					sumR += ((tan - Math.PI) - a.rotation)*moveSpeed*0.5*delta*(1/dist);
					numMate++;
				}
				else if ( dist <= dist_orienting ){
					sumR += (b.rotation - a.rotation)*moveSpeed*delta*(1/dist);
					sumVx += (b.vx - a.vx)*moveSpeed*delta*(1/dist);
					sumVy += (b.vy - a.vy)*moveSpeed*delta*(1/dist);
					numMate++;
				}
				else if ( dist <= dist_attract ){
					sumR += (tan - a.rotation)*moveSpeed*delta*(1/dist);
					sumVx += (b.vx - a.vx)*moveSpeed*delta*(1/dist);
					sumVy += (b.vy - a.vy)*moveSpeed*delta*(1/dist);
					numMate++;
				}
			}
		}
		a.rotation += (numMate != 0 ? sumR / numMate : 0);
		a.vx += (numMate != 0 ? sumVx / numMate : 0);
		a.vy += (numMate != 0 ? sumVy / numMate : 0);
		boids[i] = a;
	}

}
