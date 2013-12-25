(function() {
	var top = 0;
	var left = 0;
	var arrayWidth = 0;
	var elementSize = {
		height : 40,
		width : 80
	};
	var gapBetweenRows = 10;
	var inputArray;
	var passesArrays;

	var animationInterval = 3000;
	var waitInterval = 2000;

	var numberToFind;

	function parseArray() {
		inputArray = [];
		var input = document.getElementById('array-data');
		var items = input.value.split(',');
		for ( var i in items)
			inputArray.push(items[i]);

		arrayWidth = inputArray.length * elementSize.width;
		left = ($("#dry-run-table-wrapper").width() - arrayWidth) / 2;

	}

	function showArrayContents() {

		parseArray();
		numberToFind = document.getElementById('searchNumber').value;

		// clear the contents on the content div
		$('#content').html("");

		doBinarySearch(0, inputArray.length - 1, numberToFind);
	}

	function generateArrayContentsForPass(start, end, number) {

		var mainContent = document.getElementById('content');

		var top2 = top + 20;

		var inlineStyle = "'left: " + left + "px; top: " + top2 + "px'";

		mainContent.innerHTML += "<div id='numberToFind' class='abs-num' style="
				+ inlineStyle + ">" + numberToFind + "</div>";

		var inputArrayHtml = "<div class='mainArray' id='ArrayContents"
				+ number + "'>";
		// debugger;

		var rowTop = top2 + elementSize.height + gapBetweenRows;

		var leftPos;
		for (var i = start; i <= end; i++) {
			var id = "div" + number + "-" + i;
			leftPos = left + (i - start) * elementSize.width;

			var inlineStyle = "\"left: " + leftPos + "px; top: " + rowTop
					+ "px\"";
			inputArrayHtml += "<div id='" + id + "' class='abs-num' style="
					+ inlineStyle + "><span class='array-element'>"
					+ inputArray[i] + "</span><span class='array-index'>[" + i
					+ "]</span></div>";
		}

		var leftPosForButton = leftPos + elementSize.width;
		var inlineStyleForButton = "\"left: " + leftPosForButton + "px; top: "
				+ rowTop + "px\"";
		mainContent.innerHTML += inputArrayHtml;
		mainContent.innerHTML += "<input type=\"hidden\" id=\"playbutton-"
				+ number + "-row\" value=\"" + number + "\" />";
		mainContent.innerHTML += "</div>";

		var infoLeft = left + (leftPos + elementSize.width - left) / 2;

		infoLeft -= 150;

	}

	function doBinarySearch(start, end, number) {
		var numberToFind = parseInt(number);
		generateArrayContentsForPass(start, end, 0);

		var mid = 0;
		var previousMid = 0;
		addMessageToQueue(start, end, null, "Binary search started for: "
				+ numberToFind)
		while (start <= end) {
			addActiveArrayAnimation(start, end);

			previousMid = mid;
			mid = Math.floor((parseInt(start) + parseInt(end)) / 2);

			var distance = (mid - previousMid) * elementSize.width;

			addMoveToQueue(distance);

			var divId = "div0" + "-" + mid;
			addComparisonToQueue(divId);

			if (parseInt(inputArray[mid]) === parseInt(numberToFind)) {
				addFoundToQueue(divId, mid);
				processAnimation();
				return mid;
			}

			if (numberToFind < parseInt(inputArray[mid])) {
				end = mid - 1;
				addMessageToQueue(start, end, mid, numberToFind + " <  "
						+ inputArray[mid]
						+ "(middle element), search in left sub-array.");

			} else {
				start = mid + 1;
				addMessageToQueue(start, end, mid, numberToFind + " > "
						+ inputArray[mid]
						+ "(middle element), search in right sub-array.");

			}
		}

		if (parseInt(inputArray[0]) > numberToFind) {
			addMoveToQueue(elementSize.width * -1);
		} else if (parseInt(inputArray[inputArray.length - 1]) < numberToFind) {
			addMoveToQueue(elementSize.width);
		}

		addNotFoundToQueue();
		addMessageToQueue(-1, -1, -1, "Element " + numberToFind
				+ " does not exists in array.");

		processAnimation();
		return -1;
	}

	var activeArray = [];

	function markNotActiveArray(start, end) {
		for (var i = 0; i < inputArray.length; i++) {
			if (i < start || i > end) {
				var divId = "div0" + "-" + i;
				if (!$('#' + divId).hasClass("not-active"))
					$('#' + divId).addClass("not-active");
			}
		}

		processAnimation();
	}

	var queue = new Queue();

	function addActiveArrayAnimation(start, end) {
		var add = {
			type : "active",
			start : start,
			end : end
		};
		queue.enqueue(add);
	}
	function addFoundToQueue(divId, mid) {
		var add = {
			type : "found",
			divId : divId,
			position : mid
		};
		queue.enqueue(add);
	}

	function addNotFoundToQueue() {
		addMessageToQueue(-1, -1, -1, "Element not found.");
		var add = {
			type : "not-found"
		};
		queue.enqueue(add);
	}

	function addMoveToQueue(distance) {
		var add = {
			type : "move",
			direction : distance > 0 ? "right" : "left",
			distance : Math.abs(distance)
		}
		queue.enqueue(add);
	}

	function addComparisonToQueue(divId) {

		var add = {
			type : "comparison",
			divId : divId
		};

		queue.enqueue(add);
	}

	function addMessageToQueue(start, end, mid, message) {
		var add = {
			type : "message",
			start : start,
			end : end,
			mid : mid,
			message : message
		};

		queue.enqueue(add);
	}

	function processAnimation() {
		if (!queue.IsEmpty()) {
			var element = queue.dequeue();
			if (element.type === "active") {
				markNotActiveArray(element.start, element.end);
			}
			if (element.type === "move") {
				processMoveAnimation(element.distance, element.direction);
			} else if (element.type === "comparison") {
				processComparisonAnimation("numberToFind", element.divId);
			}

			else if (element.type === "message") {
				processMessage(element.start, element.end, element.mid,
						element.message);
				// $("#infoSection").html(element.message);
			} else if (element.type === "found") {
				$("#numberToFind").addClass("found");
				$("#" + element.divId).addClass("found");
				$("#infoSection").html(
						numberToFind + " is found at position '"
								+ element.position + "'");
			} else if (element.type === "not-found") {
				markNotActiveArray(inputArray.length, inputArray.length);
				$("#numberToFind").addClass("not-found");
			}
		}
	}
	function processMessage(start, end, mid, message) {
		if (!(start == "-1" && end == "-1")) {
			var html = "Active Array[" + start + "....." + end
					+ "], <br/><br/>" + message;
			$("#infoSection").html(html);
		} else
			$("#infoSection").html(message);

		processAnimation();
	}
	function processMoveAnimation(distance, direction) {
		if (direction === "right") {
			$("#numberToFind").animate({
				"left" : "+=" + distance + "px"
			}, {
				duration : animationInterval,
				complete : function() {
					waitAndExecuteNextAnimation();
				}
			});
		} else if (direction === "left") {
			$("#numberToFind").animate({
				"left" : "-=" + distance + "px"
			}, {
				duration : animationInterval,
				complete : function() {
					waitAndExecuteNextAnimation();
				}
			});
		}
	}

	function waitAndExecuteNextAnimation() {
		processAnimation();
		// window.setTimeout(processAnimation, waitInterval);
	}

	function processComparisonAnimation(first, second) {
		$("#" + first).addClass("compared");
		$("#" + second).addClass("compared");

		window.setTimeout(function() {
			removeComparedAndCallProcessAnimation(first, second);
		}, waitInterval);
	}

	function removeComparedAndCallProcessAnimation(first, second) {
		removeComparedClass(first, second);
		processAnimation();

	}

	function removeComparedClass(first, second) {
		$("#" + first).removeClass("compared");
		$("#" + second).removeClass("compared");
	}

	Sort.run = function() {
		showArrayContents();
	}
})();