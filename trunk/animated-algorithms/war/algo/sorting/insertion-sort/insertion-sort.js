function Element(data, x, y) {
	this.data = data;
	this.x = x;
	this.y = y;

	this.text = new Kinetic.Text({
		x : 0,
		y : 0,
		text : this.data,
		// width : 60,
		fontSize : 24,
		fontFamily : 'Calibri',
		fill : '#555',
		padding : 10,
		align : 'center'
	});

	this.rect = new Kinetic.Rect({
		x : 0,
		y : 0,
		stroke : '#999',
		strokeWidth : 2,
		fill : '#eee',
		width : this.text.getWidth(),
		height : this.text.getHeight()
	});

	this.group = new Kinetic.Group({
		x : this.x,
		y : this.y
	});
	this.group.add(this.rect);
	this.group.add(this.text);
}

Element.prototype.getCanvasObject = function() {
	return this.group;
}

Element.prototype.getWidth = function() {
	return this.rect.getWidth();
}

function ArrayAnimation(array, posX, posY) {
	this.elements = [];
	this.array = array || [ 3, 4, 6, 6, 8, -8, 0, 12, 2, 65, 7, 8, 9, 10 ];
	this.posX = posX || 0;
	this.posY = posY || 0;

	this.stage = new Kinetic.Stage({
		container : 'animation-wrapper',
		width : 1000,
		height : 300
	});

	this.layer = new Kinetic.Layer();
}

ArrayAnimation.prototype.arrow = function(from, to, up) {
	var fromEl = this.elements[from];
	var toEl = this.elements[to];
	from = fromEl.getCanvasObject();
	to = toEl.getCanvasObject();

	var fromX = from.getX() + fromEl.getWidth() / 2;
	var fromY = from.getY() - 10;
	var toX = to.getX() + toEl.getWidth() / 2;
	var toY = to.getY() - 10;
	var ctlX = (fromX + toX) / 2;
	var ctlY = (fromY + toY) / 2 - 80;

	var spline = new Kinetic.Spline({
		points : [ {
			x : fromX,
			y : fromY
		}, {
			x : ctlX,
			y : ctlY
		// modify this 50 to something that makes it round
		}, {
			x : toX,
			y : toY
		} ],
		stroke : 'silver',
		strokeWidth : 2,
		lineCap : 'round',
		tension : 1
	});

	this.layer.add(spline);

	canvas_arrow(toX, toY, Math.PI / 2, this.layer);
	this.layer.draw();
}

function canvas_arrow(tox, toy, angle, layer) {
	var headlen = 20;

	line = new Kinetic.Line({
		points : [ tox - headlen * Math.cos(angle - Math.PI / 6),
				toy - headlen * Math.sin(angle - Math.PI / 6), tox, toy,
				tox - headlen * Math.cos(angle + Math.PI / 6),
				toy - headlen * Math.sin(angle + Math.PI / 6) ],
		stroke : "silver"
	});
	layer.add(line);
}

ArrayAnimation.prototype.swap = function(a, b) {
	var that = this;
	var obj = that.elements[a].getCanvasObject();
	obj.setY(obj.getPosition().y - 10);
	return;

	var anim = new Kinetic.Animation(function(frame) {
		var time = frame.time;
		var timeDiff = frame.timeDiff;
		var frameRate = frame.frameRate;
		var obj = that.elements[a].getCanvasObject();
		obj.setY(obj.getPosition().y - 10);
	}, this.layer);
	anim.start();
}

ArrayAnimation.prototype.highlight = function(i) {
	this.elements[i].rect.setFill("#5bc0de");
	this.elements[i].text.setStroke("#FFFFFF");
	this.layer.draw();
}

ArrayAnimation.prototype.popup = function(index) {
	var that = this;
	var obj = that.elements[index].getCanvasObject();

	var tween = new Kinetic.Tween({
		node : obj,
		easing : Kinetic.Easings["BounceEaseOut"],
		duration : .4,
		x : obj.getX(),
		y : obj.getY() - 20
	});

	// obj.setY(obj.getPosition().y - 10);
	// this.layer.draw();
	setTimeout(function() {
		tween.play();
	}, 0);
}

ArrayAnimation.prototype.showArray = function() {
	var x, y;
	for (var i = 0; i < this.array.length; i++) {
		if (i > 0) {
			var group = this.elements[i - 1].getCanvasObject();
			var pos = group.getAbsolutePosition();
			x = pos.x + this.elements[i - 1].getWidth();// + 10;
			y = pos.y;
		} else {
			x = this.posX;
			y = this.posY;
		}
		this.elements.push(new Element(this.array[i], x, y));

		// add the shapes to the layer
		this.layer.add(this.elements[i].getCanvasObject());
	}

	this.stage.add(this.layer);
}


// test code
var a = new ArrayAnimation(null, 10, 100);
a.showArray();
a.swap(3, 1);
a.highlight(3);
a.arrow(10, 1);
a.popup(7);