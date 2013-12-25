(function() {

	AnimatedAlgo.ArrayAnimation = ArrayAnimation;
	var AnimationSequenceQueue = AnimatedAlgo.AnimationSequenceQueue;
	var SimpleStep = AnimatedAlgo.SimpleStep;
	var AnimationStep = AnimatedAlgo.AnimationStep;

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
		}

		this.layer = new Kinetic.Layer();
		this.stage.add(this.layer);
	}

	/* Simple Visualizations, returns Simple Steps */
	ArrayAnimation.prototype.showArray = function() {
		for (var i = 0; i < this.array.length; i++) {
			// add the shapes to the layer
			this.layer.add(this.elements[i].getCanvasObject());
		}

		this.layer.draw();
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

	ArrayAnimation.prototype.highlight = function(i) {
		this.elements[i].rect.setFill("#5bc0de");
		this.elements[i].text.setStroke("#FFFFFF");
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

	/* Animation visualizations, returns Animation Steps */

	ArrayAnimation.prototype.moveTweenConfig = function(obj, toX, toY) {
		return {
			node : obj,
			easing : Kinetic.Easings["BounceEaseOut"],
			duration : 1,
			x : toX,
			y : toY
		};
	}

	ArrayAnimation.prototype.getSwapSequence = function(a, b) {
		var q = new AnimationSequenceQueue();
		// highlight
		q.enqueue(new SimpleStep(this.highlight, this, [ a ]));
		q.enqueue(new SimpleStep(this.highlight, this, [ b ]));

		q.enqueue(new AnimationStep([ this.popupTweenConfig(a),
				this.popdownTweenConfig(b) ]));

		q.enqueue(new SimpleStep(this.arrowOver, this, [ a, b ]));
		q.enqueue(new SimpleStep(this.arrowUnder, this, [ b, a ]));
		
		//return q;
		
		// swap animation
		var objA = this.elements[a].getCanvasObject();
		var objB = this.elements[b].getCanvasObject();

		var tweenConfig1 = this.moveTweenConfig(objB, objA.getX(),
				objA.getY() + 20);
		var tweenConfig2 = this.moveTweenConfig(objA, objB.getX(),
				objB.getY() + 20);

		q.enqueue(new AnimationStep([ tweenConfig1, tweenConfig2 ]));
		q.enqueue(new AnimationStep([ tweenConfig1, tweenConfig2 ]));

		q.enqueue(new AnimationStep([ this.popupTweenConfig(b),
				this.popdownTweenConfig(a) ]));

		return q;
	}

	ArrayAnimation.prototype.swapTweenConfig = function(a, b) {
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

		var tweenConfig1 = this.moveTweenConfig(objB, objA.getX(),
				objA.getY() + 20, null);
		var tweenConfig2 = this.moveTweenConfig(objA, objB.getX(),
				objB.getY() + 20, null);

		return tweenConfigQueue = [ [ tweenConfig1, tweenConfig2 ],
				[ that.popdownTweenConfig(a), that.popupTweenConfig(b) ] ];
	}

	ArrayAnimation.prototype.popdownTweenConfig = function(index) {
		var obj = this.elements[index].getCanvasObject();

		var tweenConfig = {
			node : obj,
			easing : Kinetic.Easings["BounceEaseOut"],
			duration : .4,
			x : obj.getX(),
			y : obj.getY() + 20
		};

		return tweenConfig;
	}

	ArrayAnimation.prototype.popupTweenConfig = function(index) {

		var obj = this.elements[index].getCanvasObject();

		var tweenConfig = {
			node : obj,
			easing : Kinetic.Easings["BounceEaseOut"],
			duration : .4,
			x : obj.getX(),
			y : obj.getY() - 20
		};

		return tweenConfig;
	}

	ArrayAnimation.prototype.rightShiftTweenConfig = function(index, n) {
		var obj = this.elements[index].getCanvasObject();

		var tweenConfig = {
			node : obj,
			easing : Kinetic.Easings["BounceEaseOut"],
			duration : 0.5,
			x : obj.getX() + this.elements[index].getWidth()
		};

		return tweenConfig;
	}

	/** ************ ELEMENT ****************** */
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
})();