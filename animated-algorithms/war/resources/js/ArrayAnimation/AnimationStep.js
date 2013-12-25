(function() {
	AnimatedAlgo.AnimationStep = AnimationStep;

	function AnimationStep(tweenConfigs) {
		tweenConfigs = [].concat(tweenConfigs);
		this.array = [];
		this.hasFinished = {};

		var that = this;
		(function() {
			for (var i = 0; i < tweenConfigs.length; i++) {
				tweenConfigs[i].onFinish = function() {
					that.hasFinished[this._id] = true;
					console.log(that.hasFinished[this._id], this._id,
							"Finished");

					// if last animation is rover start new one
					if (that.canStartNext()) {
						that.onFinish();
					}
				}
				that.array.push(new Kinetic.Tween(tweenConfigs[i]));
			}
		})();
	}

	AnimationStep.prototype.run = function(onFinish) {
		this.hasFinished = {};
		this.onFinish = onFinish;

		var that = this;
		window.setTimeout(function() {
			for (var i = 0; i < that.array.length; i++) {
				var tween = that.array[i];
				that.hasFinished[tween._id] = false;
				console.log(that.hasFinished);
				tween.play();
			}
		}, 0);
	}

	AnimationStep.prototype.canStartNext = function() {
		for ( var key in this.hasFinished) {
			if (!this.hasFinished[key])
				return false;
		}
		console.log(this.hasFinished);
		return true;
	}
})();