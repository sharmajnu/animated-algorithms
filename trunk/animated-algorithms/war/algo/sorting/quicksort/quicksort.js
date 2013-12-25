function partition(array, left, right, pivotIndex) {
	pivotValue = array[pivotIndex]

	// swap array[pivotIndex] and array[right] // Move pivot to end
	var temp = array[pivotIndex];
	array[pivotIndex] = array[right];
	array[right] = temp;

	storeIndex = left
	for (var i = left; i < right; i++)
		// left <= i <= right
		if (array[i] <= pivotValue) {
			// swap array[i] and array[storeIndex]
			temp = array[i];
			array[i] = array[storeIndex];
			array[storeIndex] = temp;

			storeIndex = storeIndex + 1; // only increment storeIndex if
			// swapped
		}
	// swap array[storeIndex] and array[right] // Move pivot to its final place
	temp = array[right];
	array[right] = array[storeIndex];
	array[storeIndex] = temp;
	insertRow(array);
	return storeIndex;
}

function quicksort(array, start, end) {
	if (end > start) {
		// an array of zero or one elements is already sorted
		// select and remove a pivot element pivot from 'array'
		var partitionIndex = partition(array, start, end, start);
		quicksort(array, start, partitionIndex - 1);
		quicksort(array, partitionIndex + 1, end);

	}
	return array;
}

Sort.run = function() {
	clear();
	var input = document.querySelector("input#array-data");
	var values = input.value.split(",");

	for (var i = 0; i < values.length; i++) {
		values[i] = parseInt(values[i]);

	}

	console.log(quicksort(values, 0, values.length - 1));
}
// var a = [ 3, 7, 8, 5, 12, 1, 9, 5, 4 ];
// console.log(quicksort(a, 0, a.length-1));
//
// function printArray(array, left, right) {
// console.log(array.join("").substring(left, right - left).split(""))
// }
