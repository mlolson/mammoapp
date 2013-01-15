/*******************************************************************************
 * MAMMOAPP - Mammography web simulator: Beta version. Works best with Google
 * Chrome. Results not guaranteed in other browsers. This version is under
 * development: some code is obsolete, I have tried to mark it as such where it
 * has been left in.
 * 
 * Requires HTML5 Canvas compatible browser (No IE8!).
 * 
 * Author: Matt Olson: mattlolson@gmail.com All rights reserved.
 * 
 ******************************************************************************/
var APP = {};

window.addEventListener('load', this.eventWindowLoaded, false);

function eventWindowLoaded() {
	APP = new Mammoapp();
}
function Mammoapp() {
	// DOM handles
	this.description_box;
	this.check1;
	this.check2;
	this.check3;
	this.context_top;
	this.context_bottom;
	this.context_obox1;
	this.context_obox2;

	// Images and meta information
	this.imgC;
	this.imgM;
	this.setNum;
	this.imageNum;
	this.MaxImgNum;
	var imgCLoaded = false;
	var imgMLoaded = false;

	// Information about findings, impressions, answers and user inputs
	this.findings;
	this.answerfindings;
	this.Answer_Impression;
	this.User_Impression;
	this.selectedFinding;
	this.selectedAnswerFinding;
	this.numFoundAnswerFindings;
	this.caseSubmitted;

	this.eventMImgLoaded = eventMImgLoaded;
	this.eventCImgLoaded = eventCImgLoaded;
	this.initialize = initialize;

	function initialize() {
		imgMLoaded = false;
		imgCLoaded = false;

		var cWidth = this.imgC.width;
		var cHeight = this.imgC.height;
		var mWidth = this.imgM.width;
		var mHeight = this.imgM.height;

		var theCanvas_bottom = document.getElementById("canvas_bottom");
		var theCanvas_top = document.getElementById("canvas_top");
		var theCanvas_obox1 = document.getElementById("canvas_obox1");
		var theCanvas_obox2 = document.getElementById("canvas_obox2");

		// Probably will want to get rid of these eventually.
		this.description_box = document.getElementById("description_box");
		this.check1 = document.getElementById("check1");
		this.check2 = document.getElementById("check2");
		this.check3 = document.getElementById("check3");

		this.findings = new Array();
		this.answerfindings = new Array();
		this.Answer_Impression = new AnswerImpression(false, "", "", "", -1);
		this.User_Impression = new AnswerImpression(false, "", "", "", -1);
		this.User_Impression.init();
		this.Answer_Impression.init();
		this.selectedFinding = -1;
		this.selectedAnswerFinding = -1;
		this.numFoundAnswerFindings = 0;
		this.caseSubmitted = false;

		theCanvas_bottom.width = 800;
		theCanvas_top.width = 800;

		WS.windowHeight = cHeight;
		WS.windowWidth = cWidth;
		WS.canvasWidth = theCanvas_bottom.width;
		WS.canvasHeight = theCanvas_bottom.height;

		WS.orientX = WS.canvasWidth - WS.canvasWidth / WS.orientMag;

		theCanvas_obox1.width = Math.round(cWidth / WS.orientMag);
		theCanvas_obox1.height = Math.round(cHeight / WS.orientMag);
		theCanvas_obox2.width = Math.round(mWidth / WS.orientMag);
		theCanvas_obox2.height = Math.round(mHeight / WS.orientMag);

		theCanvas_obox1.style.position = "absolute";
		theCanvas_obox1.style.left = WS.canvasWidth + "px";
		theCanvas_obox1.style.top = 0 + "px";

		theCanvas_obox2.style.position = "absolute";
		theCanvas_obox2.style.left = WS.canvasWidth + "px";
		theCanvas_obox2.style.top = Math.round(cHeight / WS.orientMag) + "px";

		this.context_bottom = theCanvas_bottom.getContext("2d");
		this.context_top = theCanvas_top.getContext("2d");
		this.context_obox1 = theCanvas_obox1.getContext("2d");
		this.context_obox2 = theCanvas_obox2.getContext("2d");

		if (theCanvas_top.addEventListener) {
			// IE9, Chrome, Safari, Opera
			theCanvas_top.addEventListener("mousewheel",
					this.MouseWheelHandler, false);
			theCanvas_top.addEventListener("mousedown", this.MouseDownHandler,
					false);
			theCanvas_top.addEventListener("mousemove", this.MouseMoveHandler,
					false);
			theCanvas_top.addEventListener("mouseup", this.MouseUpHandler,
					false);
			theCanvas_top.addEventListener("mouseout", this.MouseLeaveHandler,
					false);
			// canvas.addEventListener("mouseout", MouseUpHandler, false);
			// Firefox
			theCanvas_top.addEventListener("DOMMouseScroll",
					this.MouseWheelHandler, false);
		}
		if (theCanvas_obox1.addEventListener) {
			theCanvas_obox1.addEventListener("mousedown",
					this.MouseDownHandler, false);
			theCanvas_obox1.addEventListener("mousemove",
					this.MouseMoveHandler, false);
			theCanvas_obox1.addEventListener("mouseup", this.MouseUpHandler,
					false);
			theCanvas_obox1.addEventListener("mouseout",
					this.MouseLeaveHandler, false);
		}
		if (theCanvas_obox2.addEventListener) {
			theCanvas_obox2.addEventListener("mousedown",
					this.MouseDownHandler, false);
			theCanvas_obox2.addEventListener("mousemove",
					this.MouseMoveHandler, false);
			theCanvas_obox2.addEventListener("mouseup", this.MouseUpHandler,
					false);
			theCanvas_obox2.addEventListener("mouseout",
					this.MouseLeaveHandler, false);
		}

		WS.zoomFactor = WS.canvasWidth / WS.windowWidth;
		// minZoom = canvasWidth/windowWidth;
		WS.windowX = 0;
		WS.windowY = 0;
		WS.DisplayAnswers = false;
		WS.viewCM = false;

		APP.context_obox1.lineWidth = 2;
		APP.context_obox2.lineWidth = 2;
		APP.context_top.lineCap = "round";
		// this.closeImpressionForm();
		// Get answer findings from server. Was originally to be performed after
		// user presses button, but now will be done at init.
		Dajaxice.finding.getMaxImageNum(callback_setMaxImgNum, {
			"setNum" : APP.setNum
		})
		Dajaxice.finding.returnAllAnswerFindings(callback_checkFindingAnswers,
				{
					"setNum" : APP.setNum,
					"imageNum" : APP.imageNum
				});
		APP.drawScreen();
	}
	function eventMImgLoaded() {
		imgMLoaded = true;
		if (imgCLoaded) {
			APP.initialize();
		}
	}
	function eventCImgLoaded() {
		imgCLoaded = true;
		if (imgMLoaded) {
			APP.initialize();
		}
	}

	if (!Modernizr.canvas) {
		return;
	} else {
		this.imgC = new Image();
		this.imgM = new Image();
		this.setNum = 1;
		this.imageNum = 1;
		this.imgC.src = window.STATIC_URL + "media/set" + this.setNum + "/"
				+ this.imageNum + "c.jpg";
		this.imgM.src = window.STATIC_URL + "media/set" + this.setNum + "/"
				+ this.imageNum + "m.jpg";
		this.imgC.addEventListener('load', this.eventCImgLoaded, false);
		this.imgM.addEventListener('load', this.eventMImgLoaded, false);
	}
}

/*******************************************************************************
 * 
 * Canvas Event Handler Functions : Fired on top canvas element and orientation
 * boxes
 * 
 ******************************************************************************/
// Handles Zooming via mouse wheel
Mammoapp.prototype.MouseWheelHandler = function(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	if (WS.isROIdrawing) {
		return;
	}
	var evt = window.event || e; // equalize event object
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	WS.zoomFactor = WS.zoomFactor + 0.1 * delta;

	if (WS.zoomFactor > WS.minZoom && WS.zoomFactor < WS.maxZoom) {
		WS.windowX = WS.windowX - delta * (WS.windowWidth / 2) * 0.1;
		WS.windowY = WS.windowY - delta * (WS.windowHeight / 2) * 0.1;
	}
	APP.drawScreen();
}
Mammoapp.prototype.MouseDownHandler = function(e) {
	if (this.id == "canvas_obox1") {
		WS.viewCM = false;
		WS.isDragging = true;
		// Probably can optimize this
		WS.windowHeight = APP.imgC.height;
		WS.windowWidth = APP.imgC.width;
		WS.windowX = (WS.canvasWidth - (WS.zoomFactor * WS.windowWidth))
				+ (((WS.windowWidth / WS.orientMag - (e.layerX)))
						* WS.zoomFactor * WS.orientMag) - WS.canvasWidth / 2;
		WS.windowY = (WS.canvasHeight - (WS.zoomFactor * WS.windowHeight))
				+ ((WS.windowHeight / WS.orientMag - (e.layerY))
						* WS.zoomFactor * WS.orientMag) - WS.canvasHeight / 2;

		WS.dragCoordStart = [ e.screenX, e.screenY ];
		APP.drawScreen();
		return;
	}
	if (this.id == "canvas_obox2") {
		WS.viewCM = true;
		WS.isDragging = true;
		WS.windowHeight = APP.imgM.height;
		WS.windowWidth = APP.imgM.width;
		WS.windowX = (WS.canvasWidth - (WS.zoomFactor * WS.windowWidth))
				+ (((WS.windowWidth / WS.orientMag - (e.layerX)))
						* WS.zoomFactor * WS.orientMag) - WS.canvasWidth / 2;
		WS.windowY = (WS.canvasHeight - (WS.zoomFactor * WS.windowHeight))
				+ ((WS.windowHeight / WS.orientMag - (e.layerY))
						* WS.zoomFactor * WS.orientMag) - WS.canvasHeight / 2;
		WS.dragCoordStart = [ e.screenX, e.screenY ];
		APP.drawScreen();
		return;
	}
	WS.currentMousePos = [ e.layerX, e.layerY ];
	if (WS.isPolyRoiDrawing) {
		WS.isDragging = false;
		WS.isROIdrawing = true;
		if (!APP.findings[APP.selectedFinding].isClosed) {
			APP.findings[APP.selectedFinding].addPoint(e.layerX, e.layerY);
		} else {
			WS.isROIdrawing = false;
			WS.isPolyRoiDrawing = false;
		}
		APP.drawScreen();
		return;
	}

	if (WS.isRectRoiDrawing) {
		WS.isDragging = false;
		WS.isROIdrawing = true;
		APP.findings[APP.selectedFinding].addPoint(e.layerX, e.layerY);
		return;
	}
	if (WS.isSpotMagTool) {
		APP.drawSpotMag(e.layerX, e.layerY);
		return;
	}

	var ret = APP.isFindingClicked(e.layerX, e.layerY);
	// It is now obsolete to check if finding is clicked- highly possible we may
	// want this functionality in the future though.
	if (ret >= 0) {
		APP.selectedFinding = ret;
	}
	ret = APP.isAnswerFindingClicked(e.layerX, e.layerY);
	if (ret >= 0) {
		APP.selectedAnswerFinding = ret;
		APP.displayAnswerFindingBox(ret, true);
	}
	WS.isDragging = true;
	WS.dragCoordStart = [ e.screenX, e.screenY ];
	APP.drawScreen();
}
Mammoapp.prototype.MouseUpHandler = function(e) {
	if (WS.isSpotMagTool) {
		WS.isSpotMagTool = false;
		APP.context_top.clearRect(0, 0, WS.canvasWidth, WS.canvasHeight);
		APP.drawScreen();
	} else if (WS.isRectRoiDrawing) {
		WS.isROIdrawing = false;
		WS.isRectRoiDrawing = false;
		APP.findings[APP.selectedFinding].isClosed = true;
		APP.findings[APP.selectedFinding].wasJustCompleted = true;
		APP.drawScreen();
		// APP.showFindingDialogBox(false,250,200);
	}
	WS.isDragging = false;
	return true;
}
Mammoapp.prototype.MouseMoveHandler = function(e) {
	if (this.id == "canvas_top") {
		WS.currentMousePos = [ e.layerX, e.layerY ];
		if (WS.isSpotMagTool) {
			APP.drawSpotMag(e.layerX, e.layerY);
		} else if (WS.isRectRoiDrawing && WS.isROIdrawing) {
			APP.findings[APP.selectedFinding].addRect(e.layerX, e.layerY);
			APP.drawScreen();
		} else if (WS.isPolyRoiDrawing && WS.isROIdrawing) {
			// this statement possibly not necessary.
			APP.drawScreen_top_only();
		} else {
			// if(APP.isAnswerFindingClicked(e.layerX,e.layerY)){
			APP.drawScreen_top_only();
			// }
		}
	}
	if (WS.isDragging) {
		var x = e.screenX;
		var y = e.screenY;
		if (this.id == "canvas_obox1" || this.id == "canvas_obox2") {
			WS.windowX = WS.windowX - WS.orientMag * (x - WS.dragCoordStart[0])
					* WS.zoomFactor;
			WS.windowY = WS.windowY - WS.orientMag * (y - WS.dragCoordStart[1])
					* WS.zoomFactor;
		} else {
			WS.windowX = WS.windowX + ((x - WS.dragCoordStart[0]));
			WS.windowY = WS.windowY + ((y - WS.dragCoordStart[1]));
		}
		WS.dragCoordStart = [ x, y ];
		APP.drawScreen();
	}
	return true;
}
Mammoapp.prototype.MouseLeaveHandler = function(e) {
	// WS.isROIdrawing=false;
	WS.isRectRoiDrawing = false;
	WS.isDragging = false;
}
// These two functions check if a finding, or answer finding was clicked.
// Seems like they should be included in this section because they are called
// on mousedown events. returns index of clicked finding, or -1 if none.
Mammoapp.prototype.isFindingClicked = function(x, y) {
	var xx = (x - WS.windowX) / WS.zoomFactor;
	var yy = (y - WS.windowY) / WS.zoomFactor;
	var find;
	for ( var i = 0; i < APP.findings.length; i++) {
		find = APP.findings[i];
		if (find.view == WS.viewCM) {
			if (find.roiContainsPoint(xx, yy)) {
				return i;
			}
		}
	}
	return -1;
}
// Returns index of answer finding if x,y is within a 20px box around
// the answer finding location. Otherwise returns -1.
Mammoapp.prototype.isAnswerFindingClicked = function(x, y) {
	var xx = (x - WS.windowX) / WS.zoomFactor;
	var yy = (y - WS.windowY) / WS.zoomFactor;
	var afind;
	for ( var i = 0; i < APP.answerfindings.length; i++) {
		afind = APP.answerfindings[i];
		// var isCC = afind.isCC;
		// var isMLO = afind.isMLO;
		if ((!WS.viewCM && afind.isCC) || (WS.viewCM && afind.isMLO)) {
			var xo;
			var yo;
			if (!WS.viewCM) {
				xo = afind.xCC;
				yo = afind.yCC;
			} else {
				xo = afind.xMLO;
				yo = afind.yMLO;
			}
			var rng = (20 / WS.zoomFactor);
			if (xx > xo - rng && yy > yo - rng && xx < xo + rng
					&& yy < yo + rng) {
				return i;
			}
		}
	}
	return -1;
}

/*******************************************************************************
 * 
 * Methods for drawing on the three canvases.
 * 
 ******************************************************************************/
// Draws image on bottom context
Mammoapp.prototype.drawScreen = function() {
	// Bounds checking
	if (WS.zoomFactor > WS.maxZoom) {
		WS.zoomFactor = WS.maxZoom;
	} else if (WS.zoomFactor < WS.minZoom) {
		WS.zoomFactor = WS.minZoom;
	}
	if (WS.windowX < WS.canvasWidth - (WS.zoomFactor * WS.windowWidth)) {
		WS.windowX = WS.canvasWidth - (WS.zoomFactor * WS.windowWidth);
	}
	if (WS.windowX > 0) {
		WS.windowX = 0;
	}
	if (WS.windowY < WS.canvasHeight - (WS.zoomFactor * WS.windowHeight)) {
		WS.windowY = WS.canvasHeight - (WS.zoomFactor * WS.windowHeight);
	}
	if (WS.windowY > 0) {
		WS.windowY = 0;
	}
	if (WS.isRectRoiDrawing) { // Only draw top screen if we are in draw ROI
								// mode
		APP.drawScreen_top_only();
	} else if (APP.findings.length > 0
			&& APP.findings[APP.selectedFinding].wasJustCompleted) {
		// Work around for bug where ctx stalls while drawing img and shapes...
		// I don't fully understand why.
		APP.findings[APP.selectedFinding].wasJustCompleted = false;
		WS.isPolyRoiDrawing = false;
		WS.isROIdrawing = false;
		APP.drawScreen_top_only();

		if (APP.findings[APP.selectedFinding].corAnswerNums.length > 0) {
			// APP.displayAnswerFindingBox(APP.selectedFinding,);
		}
	} else {// else draw image normally
		APP.context_bottom.clearRect(0, 0, WS.canvasWidth, WS.canvasHeight);

		if (WS.viewCM) {
			APP.context_bottom.drawImage(APP.imgM, 0, 0, WS.windowWidth,
					WS.windowHeight, WS.windowX, WS.windowY, WS.windowWidth
							* WS.zoomFactor, WS.windowHeight * WS.zoomFactor);
		} else {
			APP.context_bottom.drawImage(APP.imgC, 0, 0, WS.windowWidth,
					WS.windowHeight, WS.windowX, WS.windowY, WS.windowWidth
							* WS.zoomFactor, WS.windowHeight * WS.zoomFactor);
		}
		APP.drawScreen_top_only();
	}
}
// Draw the top canvas only - draws all of the labels and shapes
Mammoapp.prototype.drawScreen_top_only = function() {

	APP.context_top.clearRect(0, 0, WS.canvasWidth, WS.canvasHeight);
	// these two properties can probably be set at initialize since they do not
	// change.
	APP.context_top.textBaseline = 'top';
	APP.context_top.font = "16px sans-serif";
	var i;
	var j;
	var xpts;
	var ypts;
	var npts;
	// Don't know how I feel about this little feature. It might be not
	// particularly useful
	// because mammos typically have 1 or two findings tops.
	APP.context_top.fillStyle = "white";
	if (WS.isPolyRoiDrawing) {
		APP.context_top.fillText("Click to define points of polygon ROI...",
				230, 20);
	} else {
		APP.context_top.fillText(
				(APP.answerfindings.length - APP.numFoundAnswerFindings)
						+ " findings left", 10, 10);
		APP.context_top.fillText((APP.findings.length) + " ROIs drawn", 10, 30);
		// APP.context_top.stroke();
	}
	for (i = 0; i < APP.findings.length; i++) {
		var find = APP.findings[i];
		var afnums = find.corAnswerNums;
		if (find.view == WS.viewCM) {
			npts = find.n;
			// console.log("n pts = " + npts);
			APP.context_top.beginPath();
			xpts = find.xArr;
			ypts = find.yArr;
			if (APP.selectedFinding == i) {
				APP.context_top.lineWidth = 2;
			} else {
				APP.context_top.lineWidth = 1;
			}
			if (afnums.length > 0) {
				APP.context_top.strokeStyle = "#7CFC00";
				APP.context_top.fillStyle = "#7CFC00";
			} else {
				APP.context_top.strokeStyle = "red";
				APP.context_top.fillStyle = "red";
			}

			// console.log(npts);
			for (j = 0; j < npts; j++) {
				// console.log("px,py = "+xpts[n] +","+ypts[n]);
				APP.context_top.lineTo((xpts[j] * WS.zoomFactor) + WS.windowX,
						(ypts[j] * WS.zoomFactor) + WS.windowY);
			}
			if (!find.isClosed) {
				APP.context_top.strokeStyle = "white";
				APP.context_top.fillStyle = "white";
				// APP.context_top.arc((xpts[0]*WS.zoomFactor)+WS.windowX,
				// (ypts[0]*WS.zoomFactor)+WS.windowY, 20/WS.zoomFactor, 0 , 2 *
				// Math.PI, false);
				APP.context_top.lineTo(WS.currentMousePos[0],
						WS.currentMousePos[1]);

				// APP.context_top.closePath();
				APP.context_top.stroke();
				// Draw circle at origin
				APP.context_top.beginPath();
				APP.context_top.arc((xpts[0] * WS.zoomFactor) + WS.windowX,
						(ypts[0] * WS.zoomFactor) + WS.windowY, 15, 0,
						2 * Math.PI, false);

				APP.context_top.closePath();
				APP.context_top.stroke();
			} else {
				// APP.context_top.fillText("F"+(find.findingNum+1),(xpts[0]*WS.zoomFactor)+WS.windowX,
				// (ypts[0]*WS.zoomFactor)+WS.windowY);
				APP.context_top.closePath();
				APP.context_top.stroke();
			}
			// APP.context_top.stroke();
		}
		// Draw any answer findings contained in the ROI:
		for ( var k = 0; k < afnums.length; k++) {
			APP.drawAnswerFindingMark(afnums[k]);
		}
	}
	if (WS.DisplayAnswers) {
		for (i = 0; i < APP.answerfindings.length; i++) {
			APP.drawAnswerFindingMark(i);
		}
	}
	APP.drawOBox();
}
// Draw orientation boxes
Mammoapp.prototype.drawOBox = function() {
	APP.context_obox1.clearRect(0, 0, WS.canvasWidth, WS.canvasHeight);

	var iHeight = APP.imgC.height;
	var iWidth = APP.imgC.width;

	APP.context_obox1.drawImage(APP.imgC, 0, 0, iWidth, iHeight, 0, 0, (iWidth)
			/ WS.orientMag, (iHeight) / WS.orientMag);

	iHeight = APP.imgM.height;
	iWidth = APP.imgM.width;

	APP.context_obox2.clearRect(0, 0, WS.canvasWidth, WS.canvasHeight);
	APP.context_obox2.drawImage(APP.imgM, 0, 0, iWidth, iHeight, 0, 0, (iWidth)
			/ WS.orientMag, (iHeight) / WS.orientMag);

	if (!WS.viewCM) {
		APP.context_obox1.strokeStyle = '#f00'; // red
		APP.context_obox1.strokeRect(
				0 - ((WS.windowX / WS.zoomFactor) / WS.orientMag),
				0 - ((WS.windowY / WS.zoomFactor) / WS.orientMag),
				(((WS.canvasWidth / WS.zoomFactor))) / WS.orientMag,
				(((WS.canvasHeight / WS.zoomFactor))) / WS.orientMag);
		APP.context_obox1.font = "10px sans-serif";
	} else {
		APP.context_obox2.strokeStyle = '#f00'; // red
		APP.context_obox2.strokeRect(
				0 - ((WS.windowX / WS.zoomFactor) / WS.orientMag),
				0 - ((WS.windowY / WS.zoomFactor) / WS.orientMag),
				(((WS.canvasWidth / WS.zoomFactor))) / WS.orientMag,
				(((WS.canvasHeight / WS.zoomFactor))) / WS.orientMag);
		APP.context_obox2.font = "10px sans-serif";
	}
	for ( var i = 0; i < APP.findings.length; i++) {
		var xpts = APP.findings[i].xArr;
		var ypts = APP.findings[i].yArr;
		var npts = xpts.length;

		if (!APP.findings[i].isClosed) {
			APP.context_obox1.strokeStyle = 'white';
			APP.context_obox2.strokeStyle = 'white';
		} else if (APP.findings[i].corAnswerNums.length > 0) {
			// Draw little X's on the orientation boxes to mark answer findings.
			var afnums = APP.findings[i].corAnswerNums;
			var af;
			for ( var j = 0; j < afnums.length; j++) {
				af = APP.answerfindings[afnums[j]];
				if (af.wasSubmitted) {
					APP.context_obox1.strokeStyle = '#7CFC00'; // light green
					APP.context_obox2.strokeStyle = '#7CFC00';
				} else {
					APP.context_obox1.strokeStyle = '#FFCC00'; // Darker
																// Orange-yellow
					APP.context_obox2.strokeStyle = '#FFCC00';
				}
				if (af.isCC) {
					APP.context_obox1.beginPath();
					APP.context_obox1.lineTo((af.xCC / WS.orientMag) - 5,
							(af.yCC / WS.orientMag) - 5);
					APP.context_obox1.lineTo((af.xCC / WS.orientMag) + 5,
							(af.yCC / WS.orientMag) + 5);
					APP.context_obox1.closePath();
					APP.context_obox1.stroke();
					APP.context_obox1.beginPath();
					APP.context_obox1.lineTo((af.xCC / WS.orientMag) - 5,
							(af.yCC / WS.orientMag) + 5);
					APP.context_obox1.lineTo((af.xCC / WS.orientMag) + 5,
							(af.yCC / WS.orientMag) - 5);
					APP.context_obox1.closePath();
					APP.context_obox1.stroke();
				}
				if (af.isMLO) {
					APP.context_obox2.beginPath();
					APP.context_obox2.lineTo((af.xMLO / WS.orientMag) - 5,
							(af.yMLO / WS.orientMag) - 5);
					APP.context_obox2.lineTo((af.xMLO / WS.orientMag) + 5,
							(af.yMLO / WS.orientMag) + 5);
					APP.context_obox2.closePath();
					APP.context_obox2.stroke();
					APP.context_obox2.beginPath();
					APP.context_obox2.lineTo((af.xMLO / WS.orientMag) - 5,
							(af.yMLO / WS.orientMag) + 5);
					APP.context_obox2.lineTo((af.xMLO / WS.orientMag) + 5,
							(af.yMLO / WS.orientMag) - 5);
					APP.context_obox2.closePath();
					APP.context_obox2.stroke();
				}
			}
			APP.context_obox1.strokeStyle = '#7CFC00'; // light green
			APP.context_obox2.strokeStyle = '#7CFC00'; // light green
		} else {
			APP.context_obox1.strokeStyle = '#f00'; // red
			APP.context_obox2.strokeStyle = '#f00'; // red
		}
		// No longer nesseccary to highlight selected ROI.
		/*
		 * if(APP.findings[i].findingNum == APP.selectedFinding){
		 * APP.context_obox1.lineWidth = 2; APP.context_obox2.lineWidth = 2;
		 * }else{ APP.context_obox1.lineWidth = 1; APP.context_obox2.lineWidth =
		 * 1; }
		 */
		if (!APP.findings[i].view) {
			APP.context_obox1.beginPath();
			for ( var j = 0; j < npts; j++) {
				APP.context_obox1.lineTo(xpts[j] / WS.orientMag, ypts[j]
						/ WS.orientMag);
			}
			// APP.context_obox1.closePath();
			APP.context_obox1.stroke();
		} else {
			APP.context_obox2.beginPath();
			for ( var j = 0; j < npts; j++) {
				APP.context_obox2.lineTo(xpts[j] / WS.orientMag, ypts[j]
						/ WS.orientMag);
			}
			// APP.context_obox2.closePath();
			APP.context_obox2.stroke();
		}
	}
	// Possibly obsolete
	if (WS.DisplayAnswers) {
		for ( var i = 0; i < APP.answerfindings.length; i++) {
			var afind = APP.answerfindings[i];
			if (afind.isCC) {
				if (afind.corFinding == -1) {
					APP.context_obox1.fillStyle = 'red';
				} else {
					APP.context_obox1.fillStyle = '#7CFC00';
				}
				APP.context_obox1.fillText("A" + (afind.findingNum + 1),
						afind.xCC / WS.orientMag, afind.yCC / WS.orientMag);
			}
			if (afind.isMLO) {
				if (afind.corFinding == -1) {
					APP.context_obox2.fillStyle = 'red';
				} else {
					APP.context_obox2.fillStyle = '#7CFC00';
				}
				APP.context_obox2.fillText("A" + (afind.findingNum + 1),
						afind.xMLO / WS.orientMag, afind.yMLO / WS.orientMag);
			}
		}
	}
}
// Draw X where the answer finding is. Make it green if it is "correct", else
// red.
Mammoapp.prototype.drawAnswerFindingMark = function(n) {
	var af = APP.answerfindings[n];
	var xx, yy;
	if ((af.isCC && !WS.viewCM)) {
		xx = af.xCC;
		yy = af.yCC;
	} else if (af.isMLO && WS.viewCM) {
		xx = af.xMLO;
		yy = af.yMLO;
	} else {
		return;
	}
	var stk, lw, fs;
	if (APP
			.isAnswerFindingClicked(WS.currentMousePos[0],
					WS.currentMousePos[1]) == af.findingNum) {
		lw = 5;
		stk = "#FFFF33"; // Lighter Orange-yellow
		fs = "#FFFF33";
	} else {
		lw = 2;
		stk = "#FFCC00"; // Darker Orange-yellow
		fs = "#FFCC00";
	}
	var lbl = "Click to Submit";
	if (af.corFinding == -1) {
		stk = "red";
		fs = "red";
		lbl = "Not Found";
	} else if (af.wasSubmitted) {
		stk = '#99FF99'; // Light green
		fs = '#99FF99';
		lbl = "Submitted";
	}
	APP.context_top.lineWidth = lw;
	APP.context_top.strokeStyle = stk;
	APP.context_top.fillStyle = fs;

	var xnew = (xx * WS.zoomFactor) + WS.windowX;
	var ynew = (yy * WS.zoomFactor) + WS.windowY;

	APP.context_top.beginPath();
	APP.context_top.lineTo(xnew - 10, ynew - 10);
	APP.context_top.lineTo(xnew + 10, ynew + 10);
	APP.context_top.stroke();
	APP.context_top.closePath();
	APP.context_top.beginPath();
	APP.context_top.lineTo(xnew - 10, ynew + 10);
	APP.context_top.lineTo(xnew + 10, ynew - 10);
	APP.context_top.stroke();
	APP.context_top.closePath();

	// APP.context_top.fillText("A"+(af.findingNum+1),(xx*WS.zoomFactor)+WS.windowX,
	// (yy*WS.zoomFactor)+WS.windowY);
	APP.context_top.fillText(lbl, (xx * WS.zoomFactor) + WS.windowX + 10,
			(yy * WS.zoomFactor) + WS.windowY - 7);
	APP.context_top.stroke();
	APP.context_top.closePath();
}
Mammoapp.prototype.drawSpotMag = function(x, y) {
	APP.context_top.clearRect(0, 0, WS.canvasWidth, WS.canvasHeight);
	var mag = 1.2;
	var xx = ((x - 100) / WS.zoomFactor) - WS.windowX / WS.zoomFactor - 100
			/ (WS.zoomFactor + mag);
	var yy = ((y - 100) / WS.zoomFactor) - WS.windowY / WS.zoomFactor - 100
			/ (WS.zoomFactor + mag);
	if (WS.viewCM) {
		APP.context_top.drawImage(APP.imgM, xx, yy,
				200 / (WS.zoomFactor + mag), 200 / (WS.zoomFactor + mag),
				x - 200, y - 200, 200, 200);
	} else {
		APP.context_top.drawImage(APP.imgC, xx, yy,
				200 / (WS.zoomFactor + mag), 200 / (WS.zoomFactor + mag),
				x - 200, y - 200, 200, 200);
	}
}
/*******************************************************************************
 * 
 * Dialog handling functions.
 * 
 ******************************************************************************/
// New dialog function 1/11/13
Mammoapp.prototype.displayAnswerFindingBox = function(ind, updateLoc) {
	APP.closeAnswerFindingBox();
	var ansDiv = document.getElementById('answerBoxDiv');
	var ansInt = document.getElementById('answerBoxInternal');
	var ansForm = document.getElementById('answerBoxForm');
	// var c1 = document.getElementById('check1');
	var af = APP.answerfindings[ind];
	if (af.wasSubmitted) {
		// ansInt.innerHTML = '<p>Type: '+APP.answerfindings[ind].type + '</p>'+
		// '<p>Description: '+APP.answerfindings[ind].description+'</p>';
		document.getElementById("submitAnswerFindingButton").disabled = true;
		ansInt.innerHTML = "";

		// Append User and answer types.
		var newDiv = document.createElement('div');
		newDiv.className = "answerFTextDivL";
		//newDiv.style.width = '200px';
		newDiv.style.height = '50px';
		//newDiv.style.float = 'left';
		
		var str = "";
		if (af.userType == "calc") {
			str = "Calcifications";
		} else if (af.userType == "mass") {
			str = "Mass";
		} else if (af.userType == "other") {
			str = "Other Suspicious Abnormality";
		} else {
			str = "Undefined";
		}
		newDiv.innerHTML = "<u>You chose type</u>:<br>" + str
		ansInt.appendChild(newDiv);

		newDiv = document.createElement('div');
		newDiv.className = "answerFTextDivR";
		//newDiv.style.width = '200px';
		newDiv.style.height = '50px';
		//newDiv.style.float = 'right';
		
		str = "";
		if (af.type == "calc") {
			str = "Calcifications";
		} else if (af.type == "mass") {
			str = "Mass";
		} else if (af.type == "other") {
			str = "Other Suspicious Abnormality";
		} else {
			str = "Undefined";
		}
		newDiv.innerHTML = "<u>Answer type</u>:<br>" + str
		ansInt.appendChild(newDiv);
		// Append User and answer descriptions
		newDiv = document.createElement('div');
		newDiv.className = "answerFTextDivL";
		//newDiv.style.width = '200px';
		//newDiv.style.float = 'left';
		//newDiv.style.height = 'automatic';
		newDiv.innerHTML = "<u>Your description</u>:<br>";
		var newText = document.createElement('textarea');
		newText.cols = 21;
		newText.rows = 5;
		newText.value = af.userDescription;
		// newText.style.float = 'left';
		newDiv.appendChild(newText);
		ansInt.appendChild(newDiv);

		newDiv = document.createElement('div');
		newDiv.className = "answerFTextDivR";
		//newDiv.style.width = '200px';
		//newDiv.style.float = 'right';
		//newDiv.style.height = 'automatic';
		newDiv.innerHTML = "<u>Answer description</u>:<br>";
		newText = document.createElement('textarea');
		newText.cols = 21;
		newText.rows = 5;
		newText.value = af.description;
		//newText.style.float = 'right';
		newDiv.appendChild(newText);
		ansInt.appendChild(newDiv);

		ansInt.style.visibility = 'visible';
		ansForm.style.visibility = 'hidden';
		ansForm.style.height = '0px';
		ansForm.style.width = '0px';
	} else {
		document.getElementById("submitAnswerFindingButton").disabled = false;
		ansInt.innerHTML = "";
		ansInt.style.visibility = "hidden";
		ansForm.style.visibility = "visible";
		ansForm.style.height = "automatic";
		ansForm.style.width = '350px';
	}
	ansDiv.style.visibility = "visible";
	if (updateLoc) {
		ansDiv.style.left = WS.currentMousePos[0] + "px";
		ansDiv.style.top = WS.currentMousePos[1] + "px";
	}
}
Mammoapp.prototype.closeAnswerFindingBox = function() {
	document.getElementById('answerBoxDiv').style.visibility = "hidden";
	document.getElementById('answerBoxInternal').style.visibility = 'hidden';
	document.getElementById('answerBoxForm').style.visibility = "hidden";
}

Mammoapp.prototype.constructImpressionsForm = function() {
	var fdiv = document.getElementById("findingsList");
	var findingsHeaderDiv = document.getElementById("findingsHeader");
	var str = " finding";
	if (APP.findings.length == 1) {
		str += ".";
	} else {
		str += "s.";
	}
	findingsHeaderDiv.innerHTML = "You have found "
			+ APP.numFoundAnswerFindings + " out of "
			+ APP.answerfindings.length + str + "<br>Number or ROI's: "
			+ APP.findings.length;
	if (APP.numFoundAnswerFindings == APP.answerfindings.length) {
		findingsHeaderDiv.style.color = '#66FF66';// Light green
	} else {
		findingsHeaderDiv.style.color = '#FF3333';// Light red
	}

	fdiv.innerHTML = "";
	for ( var j = 0; j < APP.answerfindings.length; j++) {
		var af = APP.answerfindings[j];
		if (af.wasSubmitted) {
			var newDiv = document.createElement('div');
			newDiv.style.width = '630px';
			// newDiv.style.textAlign = 'center';
			newDiv.innerHTML = '<u><b>Finding ' + (j + 1) + '</b></u><br>';
			fdiv.appendChild(newDiv);

			// Append User and answer types.
			newDiv = document.createElement('div');
			newDiv.className = 'answerTextDivL';
			// newDiv.style.float = 'left';
			// newDiv.style.width = '300px';
			// newDiv.style.height = '30px';
			var str = "";
			if (af.userType == "calc") {
				str = "Calcifications";
			} else if (af.userType == "mass") {
				str = "Mass";
			} else if (af.userType == "other") {
				str = "Other Suspicious Abnormality";
			} else {
				str = "Undefined";
			}
			newDiv.innerHTML = "<u>You chose type</u>: <b>" + str + "</b><br>";
			fdiv.appendChild(newDiv);

			newDiv = document.createElement('div');
			newDiv.className = 'answerTextDivR';
			// newDiv.style.float = 'right';
			// newDiv.style.width = '300px';
			// newDiv.style.height = '30px';
			str = "";
			if (af.type == "calc") {
				str = "Calcifications";
			} else if (af.type == "mass") {
				str = "Mass";
			} else if (af.type == "other") {
				str = "Other Suspicious Abnormality";
			} else {
				str = "Undefined";
			}
			newDiv.innerHTML = "<u>Answer type</u>: <b>" + str + "</b><br>";
			fdiv.appendChild(newDiv);
			// Append User and answer descriptions
			newDiv = document.createElement('div');
			newDiv.className = 'answerTextDivL';
			// newDiv.style.float = 'left';
			// newDiv.style.width = '300px';
			// newDiv.style.height = 'automatic';
			newDiv.innerHTML = "<u>Your description</u>:<br>"
					+ af.userDescription;
			fdiv.appendChild(newDiv);

			newDiv = document.createElement('div');
			newDiv.className = 'answerTextDivR';
			// newDiv.style.float = 'right';
			// newDiv.style.width = '300px';
			// newDiv.style.height = 'automatic';
			newDiv.innerHTML = "<u>Answer description</u>:<br>"
					+ af.description;
			fdiv.appendChild(newDiv);
		}
	}
	var newDiv = document.createElement('div');
	newDiv.style.width = '630px';
	newDiv.style.height = '30px';
	//newDiv.innerHTML = '<hr>';
	fdiv.appendChild(newDiv);
	// display any answerfindings that weren't "found"
	// REALLY could use JQuery here instead of this long winded JS
	if (APP.caseSubmitted) {
		var ncorrectfindings = 0;
		// List anything that was not found. May be made obsolete since we are
		// not allowing
		// user to submit until all findings are found. Need input from docs.
		/*
		 * for(var i=0;i<APP.answerfindings.length;i++){
		 * if(APP.answerfindings[i].corFinding==-1){ var newADiv =
		 * document.createElement('div'); newADiv.className =
		 * 'answerFindingElement'; newADiv.innerHTML = "Answer Finding
		 * "+(APP.answerfindings[i].findingNum+1)+"<br>"+ "Type:
		 * "+APP.answerfindings[i].type+ "<br>"+ "Description: "
		 * +APP.answerfindings[i].description; newADiv.style.border= '1px solid
		 * red'; afdiv.appendChild(newADiv); }else{ ncorrectfindings++; } }
		 */
		// Update overall "score" (now irrelevant... will have to think of a
		// better way to keep score):
		APP.TotalNumOfFindings += APP.answerfindings.length;
		APP.TotalNumOfCorrectFindings += APP.answerfindings.length;

		var biradsDiv = document.getElementById("biradsDiv");
		biradsDiv.innerHTML = "";
		var newDiv = document.createElement('div');
		newDiv.className = 'answerTextDivL';
		newDiv.innerHTML = "Your BIRADS#: " + APP.User_Impression.biradsNum
		biradsDiv.appendChild(newDiv);
		newDiv = document.createElement('div');
		newDiv.className = 'answerTextDivR';
		newDiv.innerHTML = "Answer BIRADS#: " + APP.Answer_Impression.biradsNum;
		biradsDiv.appendChild(newDiv);

		if (APP.User_Impression.biradsNum == APP.Answer_Impression.biradsNum) {
			biradsDiv.style.color = '#66FF66';// Light green
		} else {
			biradsDiv.style.color = '#FF3333';// Light red
		}

		var impressionDiv = document.getElementById("impressionDiv");
		impressionDiv.innerHTML = "";
		newDiv = document.createElement('div');
		newDiv.className = 'answerTextDivL';
		newDiv.innerHTML = "Your Impression <br>";
		var newText = document.createElement('textarea');
		newText.cols = '35';
		newText.rows = '8';
		newText.value = APP.User_Impression.description;
		newDiv.appendChild(newText);
		impressionDiv.appendChild(newDiv);

		var newDiv2 = document.createElement('div');
		newDiv2.className = 'answerTextDivR';
		newDiv2.innerHTML = "Answer Impression <br>";
		var newText2 = document.createElement('textarea');
		newText2.cols = '35';
		newText2.rows = '8';
		newText2.value = APP.Answer_Impression.description;
		newDiv2.appendChild(newText2);
		impressionDiv.appendChild(newDiv2);

		var indicationsDiv = document.getElementById("indicationsDiv");
		indicationsDiv.innerHTML = "";
		var newDiv = document.createElement('div');
		newDiv.className = 'answerTextDivL';
		newDiv.innerHTML = "Your Indications <br>";
		var newText = document.createElement('textarea');
		newText.cols = '35';
		newText.rows = '1';
		newText.value = APP.User_Impression.indications;
		newDiv.appendChild(newText);
		indicationsDiv.appendChild(newDiv);

		var newDiv2 = document.createElement('div');
		newDiv2.className = 'answerTextDivR';
		newDiv2.innerHTML = "Answer Indications <br>";
		var newText2 = document.createElement('textarea');
		newText2.cols = '35';
		newText2.rows = '1';
		newText2.value = APP.Answer_Impression.indications;
		newDiv2.appendChild(newText2);
		indicationsDiv.appendChild(newDiv2);

		var pathDiv = document.getElementById("finalPathologyDiv");
		pathDiv.innerHTML = "";
		var newDiv = document.createElement('div');
		newDiv.className = 'answerTextDivL';
		newDiv.innerHTML = "Your Pathology <br>";
		var newText = document.createElement('textarea');
		newText.cols = '35';
		newText.rows = '1';
		newText.value = APP.User_Impression.finalPathology;
		newDiv.appendChild(newText);
		pathDiv.appendChild(newDiv);

		var newDiv2 = document.createElement('div');
		newDiv2.className = 'answerTextDivR';
		newDiv2.innerHTML = "Answer Pathology <br>";
		var newText2 = document.createElement('textarea');
		newText2.cols = '35';
		newText2.rows = '1';
		newText2.value = APP.Answer_Impression.finalPathology;
		newDiv2.appendChild(newText2);
		pathDiv.appendChild(newDiv2);

		document.getElementById("nextCaseButton").disabled = false;
		document.getElementById("saveAndSubmitImpressionButton").disabled = true;

	} else {
		var biradsDiv = document.getElementById("biradsDiv");
		var brHTML = "Choose BIRADS#: ";
		for ( var j = 0; j < 7; j++) {
			brHTML += '<input type="radio" class="formelement" name="radio1" value='
					+ j + '> ' + j;
		}
		biradsDiv.innerHTML = brHTML;
		biradsDiv.style.color = "white";
		document.getElementById("impressionDiv").innerHTML = 'Impression <br><textarea name="impression" id="impressions_box" cols="60" rows="5"></textarea><br>';
		document.getElementById("indicationsDiv").innerHTML = 'Indications<br><textarea name="indications" id="indications_box" cols="60" rows="1"></textarea><br>';
		document.getElementById("finalPathologyDiv").innerHTML = 'Guess Final Pathology<br><textarea name="finalPath" id="final_path_box" cols="60" rows="1"></textarea><br>';
		document.getElementById("nextCaseButton").disabled = true;
		document.getElementById("saveAndSubmitImpressionButton").disabled = false;
	}

	document.getElementById("impressionsForm").style.visibility = 'visible';

}
Mammoapp.prototype.saveFinding = function() {
	APP.findings[APP.selectedFinding].description = document
			.getElementById("description_box").value;
	var mass = APP.check1.checked;
	var calc = APP.check2.checked;
	var other = APP.check3.checked;

	if (calc) {
		APP.findings[APP.selectedFinding].type = "calc";
	} else if (mass) {
		APP.findings[APP.selectedFinding].type = "mass";
	} else if (other) {
		APP.findings[APP.selectedFinding].type = "other";
	}
}
Mammoapp.prototype.addFinding = function() {
	var type = "";
	var xArr = "";
	var yArr = "";
	var npts = 0;
	var description = "";

	var params = {
		"type" : type,
		"description" : description,
		"npts" : npts,
		"xArr" : xArr,
		"yArr" : yArr
	};

	var newFind = new Finding();
	newFind.init(APP.findings.length);
	APP.findings.push(newFind);
	APP.selectedFinding = APP.findings.length - 1;
}
