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
	.add("background", "https://unsplash.com/random")
	.load(setup);

let boid, bg;
let state;

// Display
function setup(){

	bg = new Sprite(resources.background.texture);


	boid = new Sprite(resources.boid.texture);
	boid.anchor.set(0.5);
	boid.x = app.screen.width / 2;
	boid.y = app.screen.height / 2;
	boid.scale.x = 0.5;
	boid.scale.y = 0.5;

	state = play;
	app.stage.addChild(bg);
	app.stage.addChild(boid);
	app.ticker.add(delta => boidLoop(delta));
}

function boidLoop(delta){
	state(delta);
}

function play(delta){
	boid.vx = 1*delta;
	boid.vy = 1*delta;

	boid.x += boid.vx;
	boid.y += boid.vy;
}
