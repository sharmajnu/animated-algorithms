(function() {
	AnimatedAlgo.AnimationSequenceQueue = AnimationSequenceQueue;
	function AnimationSequenceQueue() {
		this.array = [];
	}

	AnimationSequenceQueue.prototype.appendQueue = function(q) {
		this.array.push.apply(this.array, q.array);
	}
	AnimationSequenceQueue.prototype.enqueue = function(step) {
		this.array.push(step);
	};

	AnimationSequenceQueue.prototype.dequeue = function() {
		return this.array.splice(0, 1)[0];
	};

	AnimationSequenceQueue.prototype.isEmpty = function() {
		if (this.array.length === 0)
			return true;
		return false;
	};

	AnimationSequenceQueue.prototype.play = function() {
		if (!this.isEmpty()) {
			var step = this.dequeue();
			var that = this;
			step.run(function() {
				that.play();
			});
		}
	}
})();
