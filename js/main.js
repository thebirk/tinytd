function canvas_clear(game) {
	var c = game.c;
	//c.clearRect(0, 0, game.width, game.height);
	c.fillStyle = "black";
	c.fillRect(0, 0, game.width, game.height)
}

function draw_rect(game, x, y, w, h, color) {
	var c = game.c;
	c.fillStyle = color;
	c.fillRect(x, y, w, h);
}

function draw_sprite(game, x, y, spx, spy) {
	game.c.drawImage(
		game.art,
		spx*8, spy*8,
		8, 8,
		x, y,
		8, 8
	);
}

function add_font_color(game, color, color_val) {
	var font = document.createElement("canvas");
	font.width = game.art.width;
	font.height = game.art.height;

	var c = font.getContext("2d");
	c.drawImage(game.art, 0, 0);

	var imagedata = c.getImageData(0, 0, font.width, font.height);
	var data = imagedata.data;
	for(var i = 0; i < data.length; i += 4) {
		if(data[i] == 255 && data[i+1] == 255 && data[i+2] == 255) {
			data[i] = (color_val >> 16) & 0xFF;
			data[i+1] = (color_val >> 8) & 0xFF;
			data[i+2] = (color_val) & 0xFF;
		}
	}
	c.putImageData(imagedata, 0, 0);

	game.fonts[color] = font;
}

function draw_string(game, str, x, y, color) {
	var font_layout = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!?#$0:";

	for(var i = 0; i < str.length; i++) {
		var c = font_layout.indexOf(str[i]);
		if(c == ' ') continue;

		var xx = (c % 16) | 0;
		var yy = (c / 16) | 0;
		game.c.drawImage(
			game.fonts[color],
			xx*8, yy*8, 8, 8,
			x + 8*i, y, 8, 8
		);
	}
}

function keydown(e, game) {
	if(e.defaulPrevented) return;

	if(e.key == "d") {
		game.map.monsters.push(new Walker());
	}
}

function keyup(e, game) {
	if(e.defaulPrevented) return;

	if(e.key == "s") {
		game.map.monsters.push(new Walker());
	}
}

function mousemove(e, game) {

}

function mouseclick(e, game) {
	var x = e.offsetX / game.scale / 8;
	var y = e.offsetY / game.scale / 8;
	console.log("x: " + (x|0) + ", y: "+ (y|0));
}

function testmap(game) {
	game.map = {
		width: 16,
		height: 14,
		hp: 100,
		money: 50,

		tiles: [
			0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,
			0,0,0,0,0,0,0,0,0,0,1,1,1,0,2,0,
			0,0,0,0,0,0,0,0,0,0,1,1,1,0,2,0,
			0,0,0,2,2,2,2,2,2,0,1,1,1,0,2,0,
			0,0,0,2,0,0,0,0,2,0,0,0,0,0,2,0,
			0,0,0,2,0,0,0,0,2,0,0,0,0,0,2,0,
			0,0,0,2,0,0,0,0,2,2,2,2,2,2,2,0,
			0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,
		],

		nodes: [
			{x:1*8,y:-1*8},
			{x:1*8,y:2*8},
			{x:14*8,y:2*8},
			{x:14*8,y:9*8},
			{x:8*8,y:9*8},
			{x:8*8,y:6*8},
			{x:3*8,y:6*8},
			{x:3*8,y:14*8},
		],

		monsters: [new Walker()],
	};
}

function render_map(game) {
	var map = game.map;

	var x, y;
	for(y = 0; y < map.height; y++) {
		for(x = 0; x < map.width; x++) {
			var color = "magenta";

			switch(map.tiles[x+y*map.width]) {
				case 0: {
					color = "green";
				} break;
				case 1: {
					color = "blue";
				} break;
				case 2: {
					color = "#EDC9AF";
				} break;

				default: {
					color = "magenta";
				} break;
			}

			draw_rect(game, x*8, y*8, 8, 8, color);
		}
	}

	for(var i = 0; i < game.map.monsters.length; i++) {
		var m = game.map.monsters[i];
		m.render(game);
	}
}

function main() {
	var game = {
		canvas: document.getElementById("game_canvas"),
		c: null,
		width: 128,
		height: 128,
		scale: 4,

		art: document.getElementById("art"),
		fonts: {
			"white": art,
		},

		hurt_sound: document.getElementById("hurt"),

		map: null,
	};
	game.canvas.width = game.width*game.scale;
	game.canvas.height = game.height*game.scale;

	game.c = game.canvas.getContext("2d");
	game.c.scale(game.scale, game.scale);

	game.canvas.addEventListener("keydown", function(e) {
		keydown(e, game);
	});
	game.canvas.addEventListener("keyup", function(e) {
		keyup(e, game);
	});

	game.canvas.addEventListener("mousemove", function(e) {
		mousemove(e, game);
	});
	game.canvas.addEventListener("click", function(e) {
		mouseclick(e, game);
	});

	testmap(game);

	game.c.imageSmoothingEnabled = false;
	add_font_color(game, "yellow", 0xFFFF00);
	add_font_color(game, "red", 0xFF0000);

	loop(game);
}

function update(game) {
	for(var i = 0; i < game.map.monsters.length; i++) {
		var m = game.map.monsters[i];
		m.update(game);
	}
}

function loop(game) {
	canvas_clear(game);

	update(game);

	//draw_rect(game, 20, 20, 50, 50, "red");
	render_map(game);

	draw_rect(game, 0, 14*8, 8*16, 16, "black");
	draw_string(game, game.map.money + "$", 0, 14*8, "yellow");
	draw_string(game, "HP:" + game.map.hp, 0, 15*8, "red");

	if(game.hittimer > 0) {
		game.c.globalAlpha = 0.5;
		draw_rect(game, 0, 0, game.width, game.height-16, "red");
		game.c.globalAlpha = 1;
		game.hittimer--;
	}

	window.requestAnimationFrame(function() {
		loop(game);
	});
}