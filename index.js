const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

// create a new Sprite from an image path
const boid = PIXI.Sprite.from('boid.png');
//
// // center the sprite's anchor point
boid.anchor.set(0.5);
//
// // move the sprite to the center of the screen
boid.x = app.screen.width / 2;
boid.y = app.screen.height / 2;
//
app.stage.addChild(boid);
//
// // Listen for animate update
app.ticker.add((delta) => {
	boid.rotation += 0.1 * delta;
});
