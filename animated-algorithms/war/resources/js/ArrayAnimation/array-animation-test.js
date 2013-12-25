// test code
var a = new AnimatedAlgo.ArrayAnimation(null, 80, 200);
a.showArray();

var sequence = a.getSwapSequence(1, 7);
//var sequence = new AnimatedAlgo.AnimationSequenceQueue();
//sequence.enqueue(new AnimatedAlgo.AnimationStep([ a.popupTweenConfig(7) ]));

// sequence.play();

// var tweens = a.swap(1, 12);
// q.enqueue([ a.rightShiftTweenConfig(3) ]);
// q.enqueue([ a.popupTweenConfig(7) ]);

// var tweens = a.swapTweenConfig(1, 7);
// q.enqueue(tweens[0]);
// q.enqueue(tweens[1]);

function startAnimation() {
	sequence.play();
}



// a.highlight(3);
// a.arrow(10, 1);
// a.popup(7);

// var queue = [];
// queue.push(function() {
// a.showArray();
// });
//
// queue.push(function() {
// a.rightShift(3);
// });
//
// queue.push(function() {
// a.swap(1, 12);
// });
//
// queue.push(function() {
// a.highlight(3);
// });
//
// queue.push(function() {
// a.arrow(10, 1);
// });
//
// queue.push(function() {
// a.popup(7);
// });

