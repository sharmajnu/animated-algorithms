(function() {
	AnimatedAlgo.SimpleStep = SimpleStep;

	function SimpleStep(fn, scope, arguments) {
		this.fn = fn;
		this.scope = scope;
		this.arguments = arguments;
	}

	SimpleStep.prototype.run = function(onFinish) {
		var that = this;
		window.setTimeout(function() {
			that.fn.apply(that.scope, that.arguments);
			onFinish && onFinish();
		}, 0);
	}
})();