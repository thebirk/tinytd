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
	var font_layout = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!?#$0";

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

}

function keyup(e, game) {

}

function mousemove(e, game) {

}

function mouseclick(e, game) {
	var x = e.offsetX / game.scale;
	var y = e.offsetY / game.scale;
	console.log("x: " + (x|0) + ", y: " + (y|0));
}

function testmap(game) {
	game.map = {
		width: 16,
		height: 14,

		tiles: [
			0, 0, 0, 2, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		],
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

	loop(game);
}

function loop(game) {
	canvas_clear(game);

	//draw_rect(game, 20, 20, 50, 50, "red");
	render_map(game);

	draw_string(game, "100$", 0, 14*8, "yellow");

	window.requestAnimationFrame(function() {
		loop(game);
	});
}