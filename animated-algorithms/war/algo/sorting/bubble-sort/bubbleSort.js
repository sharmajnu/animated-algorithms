function clearContents() {
    var mainDiv = document.getElementById('content');
    mainDiv.innerHTML = "";
}

var inputArray;

function parseArray() {
    inputArray = [];
    var input = document.getElementById('numberInput');
    var items = input.value.split(',');
    for (var i in items)
        inputArray.push(items[i]);
}

function showArrayContents() {

    parseArray();
    generateArrayContents();
}

function generateArrayContents(number) {
    var mainContent = document.getElementById('content');

    var inputArrayHtml = "<div class='mainArray' id='ArrayContents" +number+"'>";

    for (var i in inputArray) {
        inputArrayHtml += "<div class='num'>" + inputArray[i] + "</div>";
        }
   
    mainContent.innerHTML += inputArrayHtml + "</div>";
}

function generateSwappedArray(number, start, end) {
    var mainContent = document.getElementById('content');

    var inputArrayHtml = "<div class='mainArray' id='ArrayContents" + number + "'>";;

    for (var i in inputArray) 
    {
        if (parseInt(i) === start || parseInt(i) === end) {
            inputArrayHtml += "<div class='swapped'>" + inputArray[i] + "</div>";
        }
        else
        {
            inputArrayHtml += "<div class='num'>" + inputArray[i] + "</div>";
        }
    }
    mainContent.innerHTML += inputArrayHtml + "</div>";
}

function bubbleSort() {

    for (var i = 0; i < inputArray.length; i++) {
        for (var j = 0; j < inputArray.length - i - 1; j++) {
            if (parseInt(inputArray[j + 1]) < parseInt(inputArray[j])) {

                generateSwappedArray(j, j, j + 1);
                var temp = inputArray[j];
                inputArray[j] = inputArray[j + 1];
                inputArray[j + 1] = temp;

               // generateSwappedArray(j, j, j + 1);
            }
        }
       
    }
    generateArrayContents(19090);
}