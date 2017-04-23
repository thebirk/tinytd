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

function outline_rect(game, x, y, w, h, lw, color) {
	var c = game.c;
	c.fillStyle = color;
	c.lineWidth = lw;
	c.strokeRect(x, y, w, h);
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
	var font_layout = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!?#$0:-h<>";

	for(var i = 0; i < str.length; i++) {
		if(str[i] == ' ') continue;

		var c = font_layout.indexOf(str[i]);

		var xx = (c % 16) | 0;
		var yy = (c / 16) | 0;

		game.c.drawImage(
			game.fonts[color],
			xx*8, yy*8, 8, 8,
			x + 8*i, y, 8, 8
		);
	}
}

function pad_int(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
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
	if(e.key == "b") {
		if(game.state != StateShop) {
			game.state = StateShop;
		} else {
			game.state = StateGame;
		}
	}
}

function mousemove(e, game) {
	game.mouse_x = (e.offsetX / game.scale) | 0;
	game.mouse_y = (e.offsetY / game.scale) | 0;
}

function mouseup(e, game) {
	if(e.button == 0) {
		game.mouse_down = false;	
	}
}

function mousedown(e, game) {
	if(e.button == 0) {
		game.mouse_down = true;	
	}
}

function mouseclick(e, game) {
	switch(game.state) {
		case StateGame: {
			if(aabb(game.mouse_x, game.mouse_y, 12*8, 15*8, 8*4, 8)) {
				game.state = StateShop;
			}
		} break;
		
		case StateShop: {
			if(aabb(game.mouse_x, game.mouse_y, 12*8, 15*8, 8*4, 8)) {
				game.state = StateGame;
			}

			if(aabb(game.mouse_x, game.mouse_y, 8, 8*2, 8, 8*11)) {
				console.log("left");
			}
			if(aabb(game.mouse_x, game.mouse_y, 14*8, 8*2, 8, 8*11)) {
				console.log("right");
			}
		} break;
	}
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

const StateGame = 0;
const StateShop = 1;

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

function set_scale(game, scale) {
	game.scale = scale;
	game.canvas.width = game.width*game.scale;
	game.canvas.height = game.height*game.scale;

	game.c.scale(game.scale, game.scale);
	game.c.imageSmoothingEnabled = false;
}

function setup_scales(game) {
	document.getElementById("scale1").addEventListener("click", function() {
		set_scale(game, 1);
	});
	document.getElementById("scale2").addEventListener("click", function() {
		set_scale(game, 2);
	});
	document.getElementById("scale3").addEventListener("click", function() {
		set_scale(game, 3);
	});
	document.getElementById("scale4").addEventListener("click", function() {
		set_scale(game, 4);
	});
	document.getElementById("scale5").addEventListener("click", function() {
		set_scale(game, 5);
	});
}

const shop_button_id = 1;

function main() {
	var game = {
		canvas: document.getElementById("game_canvas"),
		c: null,
		width: 128,
		height: 128,
		scale: 4,

		mute: true,

		mouse_down: false,
		mouse_x: 0,
		mouse_y: 0,
		
		state: StateGame,

		shop_page: 0,

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

	game.canvas.addEventListener("mouseup", function(e) {
		mouseup(e, game);
	});
	game.canvas.addEventListener("mousedown", function(e) {
		mousedown(e, game);
	});

	setup_scales(game);
	testmap(game);

	game.c.imageSmoothingEnabled = false;
	add_font_color(game, "yellow", 0xFFFF00);
	add_font_color(game, "red", 0xFF0000);

	game.shop_list = [
		new Walker(0, 0),
		new Walker(0, 0),
		new Walker(0, 0),
		new Walker(0, 0),
	];

	game.canvas.focus();

	setInterval(function() {
		loop(game);
	}, 1000/60)
}

function update(game) {
	switch(game.state) {
		case StateGame: {
			for(var i = 0; i < game.map.monsters.length; i++) {
				var m = game.map.monsters[i];
				m.update(game);
			}
		} break;
		
		case StateShop: {

		} break;
	}
}

function aabb(x0, y0, x1, y1, w, h) {
	if(
        x0 < x1 ||
        x0 >= x1 + w ||
        y0 < y1 ||
        y0 >= y1 + h
    ) {
        return false;
    }
    
	return true;
}

function render_game(game) {
	render_map(game);

	draw_rect(game, 0, 14*8, 8*16, 16, "black");
	draw_string(game, "$" + pad_int(game.map.money, 3), 0, 14*8, "yellow");
	draw_string(game, "h" + pad_int(game.map.hp, 3), 0, 15*8, "red");

	if(aabb(game.mouse_x, game.mouse_y, 12*8, 15*8, 8*4, 8)) {
		draw_string(game, "SHOP", 12*8, 15*8, "yellow");
	} else {
		draw_string(game, "SHOP", 12*8, 15*8, "white");
	}

	if(game.hittimer > 0) {
		game.c.globalAlpha = 0.5;
		draw_rect(game, 0, 0, game.width, game.height-16, "red");
		game.c.globalAlpha = 1;
		game.hittimer--;
	}
}

function draw_shop(game) {
	draw_rect(game, 8, 8, game.width-16, game.height-8*4, "#aaa");
	
	// title
	draw_rect(game, 8, 8, game.width-16, 8, "#222");
	draw_string(game, "SHOP", 16, 8, "white");

	// arrows
	if(aabb(game.mouse_x, game.mouse_y, 8, 8*2, 8, 8*11)) {
		draw_string(game, "<", 8, 7*8, "yellow");
	} else {
		draw_string(game, "<", 8, 7*8, "white");
	}

	if(aabb(game.mouse_x, game.mouse_y, 14*8, 8*2, 8, 8*11)) {
		draw_string(game, ">", 14*8, 7*8, "yellow");
	} else {
		draw_string(game, ">", 14*8, 7*8, "white");
	}

	var offset = game.shop_page * 2;

}

function render(game) {
	switch(game.state) {
		case StateGame: {
			render_game(game);
		} break;

		case StateShop: {
			render_game(game);
			draw_shop(game);
		} break;
	}
}

function loop(game) {
	canvas_clear(game);

	update(game);

	render(game);
}