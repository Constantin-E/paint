var paintingWidth = 500;
var paintingHeight = 690;
var numberOfDots = 0;
var drawColor = "black";
var globalRed = 170;
var globalSize = 5;
var paintingNum = 1;
basicStyling();
createFeaturesContainer();
createRedScale();
addColorPanel();
createSizeScale();
createPicSizer();
createPaintingSpace();

function basicStyling() {
    document.body.style = "padding: 0; margin: 0; font-size: 0;"
}
function createFeaturesContainer() {
    var featuresContainer = document.createElement('div');
    featuresContainer.id = "features-container";
    featuresContainer.style = "display: inline-block; width: 300px; background-color: grey; text-align: center;";
    document.body.appendChild(featuresContainer);
    for (var i = 1; i < 6; i++) {
        var functionalityContainer = document.createElement('div');
        functionalityContainer.id = "functionality-container-" + i;
        functionalityContainer.style.backgroundColor = "rgb(224, 222, 217)";
        functionalityContainer.style.padding = "10px";
        functionalityContainer.style.margin = "10px";
        functionalityContainer.style.width = "230px";
        functionalityContainer.style.textAlign = "center";
        functionalityContainer.style.display = "inline-block";
        featuresContainer.appendChild(functionalityContainer);
    }
}
function createPaintingSpace() {
    var spaceForPainting = document.createElement('div');
    spaceForPainting.id = "space-for-painting";
    spaceForPainting.style = `display: inline-block; width: calc(100vw-300px); min-width: ${paintingWidth}; min-height: 718px; text-align: center; background-color: dimgrey; padding: 10px;
    vertical-align: top;`;
    document.body.appendChild(spaceForPainting);
    createPaintingContainer(paintingWidth, paintingHeight);
}
function createPaintingContainer(width, height) {
    var paintingContainer = document.createElement('div');
    paintingContainer.id = "painting-container";
    var widthWithBorder = parseInt(width) + 2;
    var heightWithBorder = parseInt(height) + 2;
    paintingContainer.addEventListener('mousemove', makeDots);
    paintingContainer.style = `height: ${heightWithBorder}px; width: ${widthWithBorder}px; border: solid black 1px; background-color: white; position: relative;`;
    document.getElementById('space-for-painting').appendChild(paintingContainer);
}
// --------------Draw---------------------
function makeDots(event) {
    if (event.buttons == 1) {
        var paintedDot = document.createElement('div');
        paintedDot.className = "painted-dot";
        paintedDot.style.position = `absolute`;
        paintedDot.style.top = event.layerY + "px";
        paintedDot.style.left = event.layerX + "px";
        paintedDot.style.height = globalSize + "px";
        paintedDot.style.width = globalSize + "px";
        paintedDot.style.borderRadius = globalSize + "px";
        paintedDot.style.backgroundColor = drawColor;
        document.getElementById('painting-container').appendChild(paintedDot);
        numberOfDots += 1;
    }
}
// --------------Clear---------------------
createClearButton();
function createClearButton() {
    var clearButton = document.createElement('button');
    clearButton.id = "clear-button";
    clearButton.style = "font-size:15px;";
    clearButton.innerHTML = "Clear";
    clearButton.addEventListener('click', clearPainting);
    document.getElementById('functionality-container-5').appendChild(clearButton);
}

function clearPainting() {
    var paintingContainer = document.getElementById("painting-container");
    while (paintingContainer.firstChild) {
        paintingContainer.removeChild(paintingContainer.firstChild);
    }
    numberOfDots = 0;
}
// --------------Save---------------------
createSavingButton();
function createSavingButton() {
    var saveButton = document.createElement('button');
    saveButton.id = "save-button";
    saveButton.style = "font-size:15px;";
    saveButton.innerHTML = "Save";
    saveButton.addEventListener('click', safeToLocal);
    document.getElementById('functionality-container-4').appendChild(saveButton);
}
function makePaintingObject() {
    var mainObject = {};
    mainObject.frame = {};
    mainObject.frame.width = paintingWidth;
    mainObject.frame.height = paintingHeight;
    mainObject.dots = [];
    for (var i = 0; i < numberOfDots; i++) {
        mainObject.dots[i] = {};
        mainObject.dots[i].style= {};
        var currentDot = document.getElementsByClassName("painted-dot")[i];
        mainObject.dots[i].style.backgroundColor = currentDot.style.backgroundColor;
        mainObject.dots[i].style.top = currentDot.style.top;
        mainObject.dots[i].style.left = currentDot.style.left;
        mainObject.dots[i].style.size = currentDot.style.height;
    }
    return mainObject;
}
function safeToLocal() {
    var stringMainObject = JSON.stringify(makePaintingObject());
    var objectName = "userPainting" + paintingNum;
    localStorage.setItem(objectName, stringMainObject);
    var savedPainting = document.createElement('button');
    savedPainting.innerHTML = "My Saved Painting " + paintingNum;
    savedPainting.style = "font-size: 15px; background-color: grey; margin: 20px;";
    savedPainting.addEventListener('click', loadFromLocal);
    document.getElementById('functionality-container-4').appendChild(savedPainting);
    paintingNum += 1;
}
function loadFromLocal(event) {
    paintingName = "userPainting" + event.srcElement.innerHTML.split("My Saved Painting ")[1];
    var loadedPainting = localStorage.getItem(paintingName);
    var userPaintingObject = JSON.parse(loadedPainting);
    clearPainting();
    var spaceForPainting = document.getElementById('space-for-painting');
    spaceForPainting.removeChild(spaceForPainting.firstChild);
    paintingWidth = userPaintingObject.frame.width;
    paintingHeight = userPaintingObject.frame.height;
    createPaintingContainer(paintingWidth, paintingHeight);
    for (var i =0; i<userPaintingObject.dots.length; i++){
    var paintedDot = document.createElement('div');
        paintedDot.className = "painted-dot";
        paintedDot.style.position = `absolute`;
        paintedDot.style.top = userPaintingObject.dots[i].style.top;
        paintedDot.style.left = userPaintingObject.dots[i].style.left;
        paintedDot.style.height = userPaintingObject.dots[i].style.size;
        paintedDot.style.width = userPaintingObject.dots[i].style.size;
        paintedDot.style.borderRadius = userPaintingObject.dots[i].style.size;
        paintedDot.style.backgroundColor = userPaintingObject.dots[i].style.backgroundColor;
        document.getElementById('painting-container').appendChild(paintedDot);
        numberOfDots += 1;
    }
}
// --------------Color Panel---------------------

function selectedColor(event) {
    var color = event.srcElement.id.split("-");
    drawColor = `rgb(${color[0]},${color[1]},${color[2]})`;
}
function addColorPanel() {
    var colorContainer = document.createElement('div');
    colorContainer.id = 'color-container';
    colorContainer.style.width = "192px";
    colorContainer.style.height = "192px";
    colorContainer.style.margin = "20px 0px";
    colorContainer.style.display = "inline-block";
    document.getElementById('functionality-container-1').appendChild(colorContainer);
    createColorButtons();
}
function createColorButtons() {
    removeOldColorButtons();
    colorCode = "";
    var colorContainer = document.getElementById('color-container');
    for (var j = 0; j <= 255; j += 8) {
        for (var k = 0; k <= 255; k += 8) {
            colorCode = `rgb(${globalRed},${j},${k})`;
            colorButton = document.createElement('div');
            colorButton.id = `${globalRed}-${j}-${k}`;
            colorButton.style = `margin: 0px; height: 6px; width: 6px; display: inline-block; background-color: ${colorCode};`;
            colorButton.style.cursor = "pointer";
            colorButton.addEventListener('click', selectedColor);
            colorContainer.appendChild(colorButton);
        }
    }
}
function createRedScale() {
    var redRange = document.createElement('input');
    redRange.type = 'range';
    redRange.id = 'red-range';
    redRange.addEventListener('change', updateRedValue);
    var colorDescription = document.createElement('h6');
    colorDescription.innerHTML = "Color";
    document.getElementById('functionality-container-1').appendChild(colorDescription);
    document.getElementById('functionality-container-1').appendChild(redRange);
}
function updateRedValue() {
    var redValue = parseInt(parseInt(document.getElementById("red-range").value) * 2.55);
    globalRed = redValue;
    createColorButtons();
}
function removeOldColorButtons() {
    var colorContainer = document.getElementById("color-container");
    while (colorContainer.firstChild) {
        colorContainer.removeChild(colorContainer.firstChild);
    }
}
// --------------Pen-Sizing---------------------
function createSizeScale() {
    var penSize = document.createElement('input');
    penSize.type = 'range';
    penSize.id = 'size-range';
    penSize.addEventListener('change', updatePenSize);
    var sizingDescription = document.createElement('h6');
    sizingDescription.innerHTML = "Pen Size";
    document.getElementById('functionality-container-2').appendChild(sizingDescription);
    document.getElementById('functionality-container-2').appendChild(penSize);
}
function updatePenSize() {
    var sizeValue = parseInt(parseInt(document.getElementById("size-range").value) / 5);
    globalSize = sizeValue;
}
//--------------Painting-Sizing---------------------
function createPicSizer() {
    var picSizeDescription = document.createElement('h6');
    picSizeDescription.innerHTML = "Painting Size";
    document.getElementById('functionality-container-3').appendChild(picSizeDescription);
    var picWidth = document.createElement('input');
    picWidth.type = 'text';
    picWidth.id = 'pic-width';
    picWidth.style = "font-size: 15px; margin: 10px;";
    picWidth.placeholder = "Enter width in px";
    document.getElementById('functionality-container-3').appendChild(picWidth);
    var picHeight = document.createElement('input');
    picHeight.type = 'text';
    picHeight.id = 'pic-height';
    picHeight.style = "font-size:15px;";
    picHeight.placeholder = "Enter height in px";
    document.getElementById('functionality-container-3').appendChild(picHeight);
    var changeSizeButton = document.createElement('button');
    changeSizeButton.id = 'change-size-button';
    changeSizeButton.style = "font-size:15px; margin: 10px;";
    changeSizeButton.innerHTML = "Clear and Refresh";
    changeSizeButton.addEventListener('click', updatePicSize);
    document.getElementById('functionality-container-3').appendChild(changeSizeButton);

}
function updatePicSize() {
    clearPainting();
    var spaceForPainting = document.getElementById('space-for-painting');
    spaceForPainting.removeChild(spaceForPainting.firstChild);
    paintingWidth = document.getElementById('pic-width').value;
    paintingHeight = document.getElementById('pic-height').value;
    createPaintingContainer(paintingWidth, paintingHeight);

}
//to do: 
//  - save and load
//  - turn 180deg
