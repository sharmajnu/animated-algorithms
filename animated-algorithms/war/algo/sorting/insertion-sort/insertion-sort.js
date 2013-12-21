function Element(data, x, y) {
	this.data = data;
	this.x = x;
	this.y = y;

	var width = 50;

	this.text = new Kinetic.Text({
		x : 0,
		y : 0,
		text : this.data,
		width : width,
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
		width : width,// this.text.getWidth(),
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

Element.prototype.getHeight = function() {
	return this.rect.getHeight();
}

function ArrayAnimation(array, posX, posY) {
	this.elements = [];
	this.array = array || [ 3, 4, 6, 6, 8, -8, 0, 12, 2, 65, 7, 8, 9, 10 ];
	this.posX = posX || 0;
	this.posY = posY || 0;

	this.stage = new Kinetic.Stage({
		container : 'animation-wrapper',
		width : 1000,
		height : 400
	});

	this.layer = new Kinetic.Layer();
}

ArrayAnimation.prototype.rightShift = function(index, n) {
	var obj = this.elements[index].getCanvasObject();

	var tween = new Kinetic.Tween({
		node : obj,
		easing : Kinetic.Easings["BounceEaseOut"],
		duration : 0.5,
		x : obj.getX() + this.elements[index].getWidth(),
	});

	setTimeout(function() {
		tween.play();
	}, 0);

}

ArrayAnimation.prototype.arrowUnder = function(from, to) {
	var fromEl = this.elements[from];
	var toEl = this.elements[to];
	from = fromEl.getCanvasObject();
	to = toEl.getCanvasObject();

	var fromX = from.getX() + fromEl.getWidth() / 2;
	var fromY = from.getY() + fromEl.getHeight() + 30;
	var toX = to.getX() + toEl.getWidth() / 2;
	var toY = to.getY() + fromEl.getHeight() + 30;
	var ctlX = (fromX + toX) / 2;
	var ctlY = (fromY + toY) / 2 + 80;

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
		stroke : '#5bc0de',
		strokeWidth : 2,
		lineCap : 'round',
		tension : 1
	});

	this.layer.add(spline);

	canvas_arrow(toX, toY, -Math.PI / 2, this.layer);
	this.layer.draw();

}

ArrayAnimation.prototype.arrowOver = function(from, to) {
	var diff = from - to;
	var fromEl = this.elements[from];
	var toEl = this.elements[to];
	from = fromEl.getCanvasObject();
	to = toEl.getCanvasObject();

	var fromX = from.getX() + fromEl.getWidth() / 2;
	var fromY = from.getY() - 30;
	var toX = to.getX() + toEl.getWidth() / 2;
	var toY = to.getY() - 30;
	var ctlX = (fromX + toX) / 2;
	var ctlY = (fromY + toY) / 2 - 80;

	var spline = new Kinetic.Spline({
		points : [ {
			x : fromX,
			y : fromY
		}, {
			x : ctlX,
			y : ctlY
		}, {
			x : toX,
			y : toY
		} ],
		stroke : '#5bc0de',
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
		stroke : "#5bc0de"
	});
	layer.add(line);
}

ArrayAnimation.prototype.swap = function(a, b) {
	// highlight
	this.highlight(a);
	this.highlight(b);
	this.popup(a);
	this.popdown(b);

	this.arrowOver(a, b);
	this.arrowUnder(b, a);

	// swap animation
	var objA = this.elements[a].getCanvasObject();
	var objB = this.elements[b].getCanvasObject();

	var tween1 = new Kinetic.Tween({
		node : objA,
		easing : Kinetic.Easings["BounceEaseOut"],
		duration : 1,
		x : objB.getX(),
		y : objB.getY() - 20
	});

	var tween2 = new Kinetic.Tween({
		node : objB,
		easing : Kinetic.Easings["BounceEaseOut"],
		duration : 1,
		x : objA.getX(),
		y : objA.getY() + 20
	});

	setTimeout(function() {
		tween1.play();
		tween2.play();
	}, 0);

	return;
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

ArrayAnimation.prototype.popdown = function(index) {
	var obj = this.elements[index].getCanvasObject();

	var tween = new Kinetic.Tween({
		node : obj,
		easing : Kinetic.Easings["BounceEaseOut"],
		duration : .4,
		x : obj.getX(),
		y : obj.getY() + 20
	});

	setTimeout(function() {
		tween.play();
	}, 0);
}

ArrayAnimation.prototype.popup = function(index) {

	var obj = this.elements[index].getCanvasObject();

	var tween = new Kinetic.Tween({
		node : obj,
		easing : Kinetic.Easings["BounceEaseOut"],
		duration : .4,
		x : obj.getX(),
		y : obj.getY() - 20
	});

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
var a = new ArrayAnimation(null, 80, 200);
a.showArray();
a.rightShift(3);
// a.swap(1, 12);
// a.highlight(3);
// a.arrow(10, 1);
// a.popup(7);

