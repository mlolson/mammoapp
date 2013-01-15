var imagesState = {
	imgC:new Image(),
	imgM:new Image(),
	setNum: 1,
	imageNum: 1,
	MaxImgNum: 1,	
	imgCLoaded: false,
	imgMLoaded: false
}
//WS means Window State
var WS = {
	windowX: 0,
	windowY: 0,	

	windowWidth: 0,
	windowHeight: 0,
	windowXmin: 0,
	windowXmax: 0,
	windowYmin: 0,
	windowYmax: 0,

	orientBoxXmin: 0,
	orientBoxYmin: 0,
	orientBoxXmax: 0,
	orientBoxYmax: 0,
	canvasWidth: 0,
	canvasHeight: 0,		
	
	zoomFactor: 0.15,
	minZoom: 1, 
	maxZoom: 3.5,
	
	isDragging:false,
	isDrawing: false,
	isRoiDrawing: false,
	isPolyRoiDrawing: false,
	isRectRoiDrawing: false,
	isSpotMagTool: false,
	viewCM: false, //false for cc view, true for mlo view.
	DisplayAnswers: false,
	orientMag: 3,
	orientX: 0,
	dragCoordsStart: [0,0]
}
var caseInfo = {
	findings: {},
	answerfindings: {},
	Answer_Impression: {},//init objs here?,
	User_Impression: {},
	selectedFinding: -1
}
var domHandles = {
	defineROIbutton:{},
	description_box:{},
	check1:{},
	check2:{},
	check3:{},
	FindingsBox:{},
	mouseWheelObject:{},
	context_top:{},
	context_bottom:{},
	context_obox1:{},
	context_obox2:{}
}

var userInfo = {
	TotalNumOfFindings:0,
	TotalNumOfCorrectFindings:0		
}




