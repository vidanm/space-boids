
// Aliases
let loader = PIXI.Loader.shared;
let resources = loader.resources;
let Sprite = PIXI.Sprite;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// Init rendering window
const app = new PIXI.Application({
	antialias: false,
	width: windowWidth,
	height: windowHeight,
	resolution: 1,
	//preserveDrawingBuffer: true,
	//clearBeforeRender: false
});

//app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.view.style.margin = "auto";
//app.renderer.resize(windowWidth, windowHeight);
document.body.appendChild(app.view);


//Loading Resources
loader
	.add("boid", "https://i.ibb.co/cgvM29P/boid.png")
	.add("background", "https://i.ibb.co/Fxh3vG7/blurred-background-5262455-960-720.jpg")
	.load(setup);

const dist_repulsive = 10;
const dist_orienting = 35;
const dist_attract = 50;
let boids = [], bg;
let num = 60;
let state;
let boid_container = new PIXI.Container();

// Display
function setup(){
	
	let refFilter = new PIXI.filters.ReflectionFilter();
	refFilter.mirror = false;
	refFilter.boundary = 0;
	refFilter.waveLength = [50,80];
	refFilter.amplitude = [0,10];
	refFilter.time = 0.1;

	let sepFilter = new PIXI.filters.ColorMatrixFilter;
	sepFilter.sepia(255);
	let lightmapFilter = new PIXI.filters.RGBSplitFilter();

	bg = new Sprite(resources.background.texture);
	bg.scale.x = 5
	bg.scale.y = 5

	for (let i = 0;i<num;i++){
		boid = new Sprite(resources.boid.texture);
		boid.anchor.set(0.5);
		boid.x = Math.random()*app.screen.width;
		boid.y = Math.random()*app.screen.height;
		boid.vx = Math.random()*3;
		boid.vy = Math.random()*3;
		boid.rotation = Math.random()*Math.PI*2;
		boid.tint = "0x" + Math.floor(Math.random()*16777215).toString(16);
		const size = Math.random()+0.2;
		boid.scale.x = size;
		boid.scale.y = size;
		boids.push(boid);
		boid_container.addChild(boid);
	}

	app.stage.filterArea = app.screen;
	app.stage.filters = [sepFilter, refFilter];
	app.stage.addChild(boid_container);
	state = play;
	app.ticker.add(delta => boidLoop(delta));
}

function boidLoop(delta){
	state(delta);
}

function move(object) {
	object.x += object.vx * Math.cos(object.rotation-Math.PI/2);
	object.y += object.vy * Math.sin(object.rotation-Math.PI/2);
	if (object.x > windowWidth+2){
		object.x = -1;
	} else if (object.x < -2){
		object.x = windowWidth+1;
	} else if (object.y > windowHeight+2){
		object.y = -1;
	} else if (object.y < -2){
		object.y = windowHeight +1;
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
			let tan = Math.atan2((b.y - a.y),(b.x - a.x))
			let dist = distanceBetweenTwoBoids(a, b);

			if (boids[i] != boids[j]){ 
				if (dist <= dist_repulsive){
					sumR += ((tan - Math.PI) - a.rotation)*moveSpeed*delta*(1/dist);
					numMate++;
				}
				else if ( dist <= dist_orienting ){
					sumR += (b.rotation - a.rotation)*moveSpeed*delta*(1/dist);
					sumVx += (b.vx - a.vx)*moveSpeed*0.2*delta*(1/dist);
					sumVy += (b.vy - a.vy)*moveSpeed*0.2*delta*(1/dist);
					numMate++;
				}
				else if ( dist <= dist_attract ){
					sumR += (tan - a.rotation)*moveSpeed**delta*(1/dist);
					sumVx += (b.vx - a.vx)*moveSpeed*0.2*delta*(1/dist);
					sumVy += (b.vy - a.vy)*moveSpeed*0.2*delta*(1/dist);
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
