
function clearContents() {
    var mainDiv = document.getElementById('content');
    mainDiv.innerHTML = "";

    showArrayContents();
    bubbleSort();
}

var inputArray;
var passesArrays;

function parseArray() {
    inputArray = [];
    var input = document.getElementById('numberInput');
    var items = input.value.split(',');
    for (var i in items)
        inputArray.push(items[i]);
}

function showArrayContents() {

    parseArray();
    generateArrayContents("Input Array:");
}

var top1 = 150;
var left = 100;

function generateArrayContentsForPass(number) {
    var mainContent = document.getElementById('content');

    var inputArrayHtml = "<div class='mainArray' id='ArrayContents" + number + "'>";

    var label;
    if (!number)
        label = "Input Array";
    else
        label = "Pass: " + number;

    var rowTop = top1 + number * 50;
    var inlineStyleForSpan = "\"left: " + left + "px; top: " + parseInt(rowTop) + "px\"";

    inputArrayHtml += "<span class=\"header\" style=" + inlineStyleForSpan + ">" + label + "</span>";

    
    var leftPos;
    for (var i in inputArray) {
        var id = "div" + number + "-" + i;
        leftPos = left + i * 80 + 120;

        var inlineStyle = "\"left: " + leftPos + "px; top: " + rowTop + "px\"";
        inputArrayHtml += "<div id='" + id + "' class='abs-num' style=" + inlineStyle + ">" + inputArray[i] + "</div>";
    }

    var leftPosForButton = leftPos + 80;
    var inlineStyleForButton = "\"left: " + leftPosForButton + "px; top: " + rowTop + "px\"";
    mainContent.innerHTML += inputArrayHtml;
    mainContent.innerHTML += "<input type=\"hidden\" id=\"playbutton-" + number + "-row\" value=\"" +number+ "\" />";
    mainContent.innerHTML += "<input id='playbutton-"+ number +"' class=\"play-button\" type=\"submit\" value=\"Play\" onclick=\"javascript:sortPass(this);\" style=" + inlineStyleForButton + "/>" + "</div>";

}

function sortPass(sender)
{
    var rowNumberId = sender.id + "-row";
    var rowNumberControl = document.getElementById(rowNumberId);

    if (rowNumberControl) {
        runBubbleSortPass(rowNumberControl.value);
    }
    else
        alert('rowNumberControl is null');


}

var currentElementDivForPass;
function runBubbleSortPass(number)
{
    
    var currentArray = passesArrays[number-1];
    var divArray = [];
    for (var i in currentArray)
    {
        var divId = "div" + number + "-" + i;
        divArray.push(divId);
    }
    var currentElementDiv = divArray[number];
    currentElementDivForPass = currentElementDiv;

    $("#" + currentElementDiv).addClass("swapped");

    moveUp(currentElementDiv)
    var j = number - 1;
    var temp = currentArray[number];
    var tempDiv = divArray[number];

    var count = 0;
    while (parseInt(currentArray[j]) > parseInt(temp) && j >= 0)
    {
        currentArray[j + 1] = currentArray[j];
        moveRight(divArray[j]);
        divArray[j + 1] = divArray[j];
        j--;
        count++;
        
    }

    currentArray[j + 1] = temp;
    divArray[j + 1] = tempDiv;

    moveLeft(currentElementDiv, count);
    moveDown(currentElementDiv);
}

function changeColor(element)
{
    $("#" + element).animate({ backgroundColor: "red" }, "fast");
}
function moveLeft(element, count)
{
    var left = 80 * parseInt(count);
    $("#" + element).animate({ "left": "-="+ left + "px" }, { duration: 500 * count });
}
function moveRight(element)
{
    $("#" + element).animate({ "left": "+=80px" }, { duration: 1000 });
}

function moveUp(element)
{
    $("#" + element).animate({ "top": "-=50px" }, { duration: 1000 });
}

function moveDown(element)
{
    $("#" + element).animate({ "top": "+=50px" },
                                {
                                    duration: 1000,
                                    complete: function ()
                                    {
                                        //alert(element);
                                        $("#" + element).removeClass("swapped");
                                    }
                                });
}

function generateArrayContents(message) {
    var mainContent = document.getElementById('content');

    var inputArrayHtml = "<div class='mainArray' id='ArrayContents'>";
    inputArrayHtml += "<span class=\"fixed-header\">" + message + "</span>";

    for (var i in inputArray) {
        var id = "inputdiv" + "-" + i;
        inputArrayHtml += "<div id=" + id + " class='num'>" + inputArray[i] + "</div>";
    }


    mainContent.innerHTML += inputArrayHtml + "</div>";
}


function bubbleSort()
{
    passesArrays = [];
    for (var i = 1; i < inputArray.length; i++)
    {
        passesArrays.push(inputArray.slice(0))
        generateArrayContentsForPass(i);

        
        var temp = inputArray[i];
        var j = i - 1;
        while (parseInt(inputArray[j] )> parseInt(temp) && j >= 0)
        {
            inputArray[j + 1] = inputArray[j];
            j--;
        }
        inputArray[j + 1] = temp;
        
    }

    generateArrayContents("Final Array");
}