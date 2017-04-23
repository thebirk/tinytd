class Turret {
	constructor(x, y, id, placed_on, cost) {
		this.x = x;
		this.y = y;
		this.placed_on = placed_on;
	}
}

const BasicTurret = 0;

class Basic extends Turret {
	constructor(x, y) {
		super(x, y, BasicTurret, [0], 10)
	}
}