(function() {
	$('#myTab a').click(function(e) {
		e.preventDefault()
		$(this).tab('show')
	});

	$("#run").click(run);
})();

function insertRow(table, values, pos) {
	var row = table.tBodies[0].insertRow(pos);
	for (var i = 0; i < values.length; i++) {
		if (values[i] !== "") {
			var cell = row.insertCell(-1);
			cell.innerHTML = "<div class='element'>" + values[i] + "</div>";
		}
	}

}

function deleteAllRows(table) {
	var len = table.tBodies[0].rows.length;
	for (var i = 0; i < len; i++) {
		table.deleteRow(0);
	}

}

function run() {
	/* init dry run */
	var table = document.querySelector("#dry-run-table");
	var input = document.querySelector("input#array-data");
	var values = input.value.split(",");
	deleteAllRows(table);
	insertRow(table, values, -1);
	insertRow(table, values, -1);
}