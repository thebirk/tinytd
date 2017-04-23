class Monster {
	constructor(x, y, type, spx, spy, speed, attack, value) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.spx = spx;
		this.spy = spy;
		this.speed = speed;
		this.attack = attack;
		this.value = value;

		this.node = -1;
		this.target_node = -1;

		this.remove = false;
	}

	render(game) {
		draw_sprite(game, this.x, this.y, this.spx, this.spy);
	}

	update(game) {
		if(this.remove) return;

		if(this.node == -1) {
			this.x = game.map.nodes[0].x;
			this.y = game.map.nodes[0].y;
			this.node = 0;
			this.target_node = 1;
		} else {
			var lx = Math.abs(game.map.nodes[this.target_node].x - this.x);
			var ly = Math.abs(game.map.nodes[this.target_node].y - this.y);
			
			if(
				lx < 0.5 && ly < 0.5
			) {
				this.x = game.map.nodes[this.target_node].x;
				this.y = game.map.nodes[this.target_node].y;

				this.node = this.target_node;
				this.target_node++;
				if(this.node == game.map.nodes.length-1) {
					// reached the finish
					console.log("ouch!");
					game.hittimer = 5;
					if(!game.mute) game.hurt_sound.play();

					game.map.hp -= this.attack;
					this.remove = true;
				}
			} else {
				var dx = game.map.nodes[this.target_node].x - this.x;
				var dy = game.map.nodes[this.target_node].y - this.y;

				if(dx > 0) {
					this.x += this.speed;
				} else if(dx < 0) {
					this.x -= this.speed;
				}

				if(dy > 0) {
					this.y += this.speed;
				} else if(dy < 0) {
					this.y -= this.speed;
				}
			}
		}
	}
}

const WalkerMonster = 0;

class Walker extends Monster {
	constructor(x, y) {
		super(x, y, WalkerMonster, 0, 3, 1, 25, 1);
	}
}