/***************************************************************************************
 *                MAMMOAPP - Mammography web simulator:
 *               
 *                Data container classes: these JS classes 
 *                store some meta data about the system state. 
 *                (some of this is still a var in APP, maybe 
 *                can move it here to make it even more organized)
 *                
 *                Author: Matt Olson: mattlolson@gmail.com
 *                All rights reserved.
 * 
 ***************************************************************************************/

//WS means Window State: global vars that describe the state of the canvas.
var WS = {
	currentMousePos : [ 0, 0 ],
	windowX : 0,
	windowY : 0,

	windowWidth : 0,
	windowHeight : 0,
	windowXmin : 0,
	windowXmax : 0,
	windowYmin : 0,
	windowYmax : 0,

	orientBoxXmin : 0,
	orientBoxYmin : 0,
	orientBoxXmax : 0,
	orientBoxYmax : 0,
	canvasWidth : 0,
	canvasHeight : 0,

	zoomFactor : 0.15,
	minZoom : 1,
	maxZoom : 3.5,

	isDragging : false,
	isDrawing : false,
	isRoiDrawing : false,
	isPolyRoiDrawing : false,
	isRectRoiDrawing : false,
	isSpotMagTool : false,
	viewCM : false, //false for cc view, true for mlo view.
	DisplayAnswers : false,
	orientMag : 3,
	orientX : 0,
	dragCoordsStart : [ 0, 0 ]
}

function Finding() {

	//ROI params
	this.xArr;
	this.yArr;
	this.n;
	this.isClosed;
	//finding desctriptors
	this.findingNum;
	this.type;
	this.description;
	this.syncedWithServer;
	this.wasJustCompleted;
	this.view;
	this.corAnswerNums;
	this.roiContainsPoint = roiContainsPoint;

	this.init = init;
	this.addPoint = addPoint;
	this.removeLastPoint = removeLastPoint;
	this.getXarr = getXarr;
	this.getYarr = getYarr;
	this.getNpoints = getNpoints;
	this.addRect = addRect;
	this.roiArea = roiArea;

	function init(fNum) {
		this.n = 0;
		this.xArr = new Array();
		this.yArr = new Array();
		this.isClosed = false;
		this.type = "";
		this.findingNum = fNum;
		this.description = "";
		this.syncedWithServer = false;
		this.wasJustCompleted = false;
		this.view = WS.viewCM;
		this.corAnswerNums = new Array();
	}
	function addPoint(x, y) {
		this.xArr[this.n] = (x - WS.windowX) / WS.zoomFactor;
		this.yArr[this.n] = (y - WS.windowY) / WS.zoomFactor;
		//Check to see if ROI should be closed.
		if (this.n > 2) {
			if ((Math.abs(this.xArr[0] - this.xArr[this.n]) + Math
					.abs(this.yArr[0] - this.yArr[this.n])) < 20 / WS.zoomFactor) {
				
				this.xArr[this.n] = this.xArr[0];
				this.yArr[this.n] = this.yArr[0];
				this.isClosed = true;
				this.wasJustCompleted = true;
				
				//Check to see if ROI contains an answer finding.
				for ( var j = 0; j < APP.answerfindings.length; j++) {
					var afind = APP.answerfindings[j];
					if (afind.isCC && !this.view) { //Are the views the same?
						if (this.roiContainsPoint(afind.xCC, afind.yCC)) {
							this.corAnswerNums.push(j);
							APP.answerfindings[j].corFinding = this.findingNum;
						}
					} else if (afind.isMLO && this.view) {
						if (this.roiContainsPoint(afind.xMLO, afind.yMLO)) {
							this.corAnswerNums.push(j);
							APP.answerfindings[j].corFinding = this.findingNum;
						}
					}
				}
			}
		}
		this.n++;
	}
	function addRect(x, y) {
		var xx = (x - WS.windowX) / WS.zoomFactor;
		var yy = (y - WS.windowY) / WS.zoomFactor;

		this.xArr[1] = xx;
		this.yArr[1] = this.yArr[0];

		this.xArr[2] = xx;
		this.yArr[2] = yy;

		this.xArr[3] = this.xArr[0];
		this.yArr[3] = yy;

		this.xArr[4] = this.xArr[0];
		this.yArr[4] = this.yArr[0];

		this.n = 5;
	}
	function removeLastPoint() {
		this.xArr[this.n] = -1;
		this.yArr[this.n] = -1;
		this.n--;
	}
	function getXarr() {
		return this.xArr;
	}
	function getYarr() {
		return this.yArr;
	}
	function getNpoints() {
		return this.n;
	}
	function roiContainsPoint(xx, yy) {
		//Draw ray from point to side, if it intersect an odd number of lines it is 
		//inside, if it intersects an even number it is outside.
		var i, j, c = false;
		for (i = 0, j = this.n - 1; i < this.n; j = i++) {
			if (((this.yArr[i] > yy) != (this.yArr[j] > yy))
					&& (xx < (this.xArr[j] - this.xArr[i])
							* (yy - this.yArr[i])
							/ (this.yArr[j] - this.yArr[i]) + this.xArr[i])) {
				c = !c;
			}
		}
		return c;
	}
	//Returns area of polygon defined by vertices xArr, yArr. 
	//Ignores last vertex, because in this program it is the same as the first.
	function roiArea(){
		var area =0;
		var i;
		var npoints = this.n -1;
		var j=npoints-1;
		for (i=0; i<npoints; i++) { 
			area+=Math.abs((this.xArr[j]+this.xArr[i])*(this.yArr[j]-this.yArr[i])); 
			j=i; 
		}
		return 0.5*area; 	
	}
}
function AnswerFinding(imgN, setN){
	this.imgN = imgN;
	this.setN = setN;
	this.xCC;
	this.yCC;
	this.xMLO;
	this.yMLO ;
	this.isCC;
	this.isMLO;
	this.type;
	this.description;
	this.findingNum;
	this.corFinding;
	//User inputed information
	this.userType;
	this.userDescription;
	this.wasSubmitted;
	//Question and list of answers.
	this.question;
	this.choices;//2D array of choices and and T/F answers
	this.userChoices;//list of indices of choices selected by user.
}

function AnswerImpression(syncedWithServer, description, finalPathology,
		indications, biradsNum) {
	this.syncedWithServer = syncedWithServer;
	this.description = description;
	this.finalPathology = finalPathology;
	this.biradsNum = biradsNum;
	this.indications = indications;
	this.question;
	this.choices;//2D array of choices and and T/F answers
	this.userChoices;//list of indices of choices selected by user.
	this.init = init;
	this.extraImageDescription;
	this.patientInfo;

	function init() {
		this.syncedWithServer = false;
		this.description = "";
		this.finalPathology = "";
		this.biradsNum = -1;
		this.indications = "";
	}
}