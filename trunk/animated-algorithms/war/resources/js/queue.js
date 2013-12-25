function Queue() {
    this.array = [];
}


Queue.prototype.enqueue = function (element) {
    this.array.push(element);
};

Queue.prototype.dequeue = function () {
    var element = this.array[0];
    return this.array.splice(0, 1)[0];
};

Queue.prototype.IsEmpty = function () {
    if (this.array.length === 0)
        return true;
    return false;
};