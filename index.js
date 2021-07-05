// Aliases
let loader = PIXI.Loader.shared;
let resources = loader.resources;
let Sprite = PIXI.Sprite;

// Init rendering window
const app = new PIXI.Application({
	antialias: false,
	width: 512,
	height: 512,
	backgroundColor: 0x1d1d1d,
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

let boids = [], bg;
let num = 500;
let state;

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
		app.stage.addChild(boid);
	}
	
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
}

function play(delta){
	for (let i=0;i<num;i++){
		let boid = boids[i];
		move(boid);
		boid.rotation += delta * 0.01;
	}
}
