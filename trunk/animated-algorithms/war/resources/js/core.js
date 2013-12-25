var Sort = {
	run : function() {

	}
}

window.onload = function() {
	$('#myTab a').click(function(e) {
		e.preventDefault()
		$(this).tab('show')
	});
	$("#dry-run-table-wrapper").on("click", ".table-row", function() {
		$(this).addClass("selected");
	});

	$("#run").click(Sort.run());

	Sort.run();
};

function highlightRange(table, left, right) {
	var rows = table.rows;
	for (var i = left; i < right; i++) {
		
	}
}

function insertRow(values) {
	var tableWrapper = document.createElement("div");
	tableWrapper.className = "table-row";
	$(tableWrapper).appendTo(document.getElementById("dry-run-table-wrapper"));
	var table = document.createElement("table");
	table.className = "table";
	$(table).appendTo(tableWrapper);

	var row = table.insertRow(-1);
	for (var i = 0; i < values.length; i++) {
		if (values[i] !== "") {
			var cell = row.insertCell(-1);
			cell.innerHTML = "<div class='element'>" + values[i] + "</div>";
		}
	}

}

function clear() {
	$(".table-row").remove();

}

function deleteAllRows(table) {
	var len = table.tBodies[0].rows.length;
	for (var i = 0; i < len; i++) {
		table.deleteRow(0);
	}
}
