var imgC = new Image();
var imgM = new Image();

var setNum = 1;
var imageNum = 1;
var maxImgNum = 1;

window.addEventListener('load', eventWindowLoaded, false);

var windowWidth = 2560;
var windowHeight = 3328;

var canvasWidth;
var canvasHeight;

var windowX = 0;
var windowY = 0;
var zoomFactor = 0.15;
var minZoom = 1; 
var maxZoom = 3.5;
var mouseWheelObject;
//var context3;
var context_top;
var context_bottom;
var context_obox1;
var context_obox2;
var isDragging = false;
var isROIdrawing = false;
var windowXmin = 0;
var windowXmax = windowWidth;
var windowYmin = 0;
var windowYmax = windowHeight;
var imgLoaded = false;
var orientBoxXmin = 0;
var orientBoxYmin = 0;
var orientBoxXmax = 0;
var orientBoxYmax = 0;
var selectedFinding;
var isDrawing = false;
var isPolyRoiDrawing = false;
var isRectRoiDrawing = false;
var isSpotMagTool = false;
var viewCM = false; //false for cc view, true for mlo view.

var imgCLoaded = false;
var imgMLoaded = false;
var DefineFinding = false;
var UpdateFinding =false;

var orientMag = 3;
var orientX;

//DOM objects
var defineROIbutton;
var description_box;
var check1;
var check2;
var check3;
//var theCanvas_3;

//All findings on client side
var findings = new Array();
var answerfindings = new Array();
var dragCoordsStart=new Array(); 

function eventWindowLoaded() {
   canvasApp();
}

function canvasSupport () {
     return Modernizr.canvas;
}
function canvasApp(){
   if (!canvasSupport()) {
    return;
   }else{    	 
    imgC.src = window.STATIC_URL+"media/set"+setNum+"/"+imageNum+"c.jpg";
    imgM.src = window.STATIC_URL+"media/set"+setNum+"/"+imageNum+"m.jpg";
 
    imgC.addEventListener('load', eventCImgLoaded , false);
    imgM.addEventListener('load', eventMImgLoaded , false);   
   }
}
function eventMImgLoaded() {
  	imgMLoaded = true;
  	if(imgCLoaded){  	   	 
  		initialize();
	}
}
function eventCImgLoaded() {
   	imgCLoaded = true;
    if(imgMLoaded){ 
   		initialize();
   	} 
}
function initialize(){
	viewCM = false;
    imgMLoaded=false;
	imgCLoaded = false;
	   
	console.log("init");
   
	windowHeight = imgC.height;
	windowWidth = imgC.width;
	
	var cWidth = imgC.width;
	var cHeight = imgC.height;
	
	var mWidth = imgM.width;
	var mHeight = imgM.height;
	
	var theCanvas_bottom = document.getElementById("canvas_bottom");
    var theCanvas_top = document.getElementById("canvas_top");
    var theCanvas_obox1 = document.getElementById("canvas_obox1");
    var theCanvas_obox2 = document.getElementById("canvas_obox2");
    
    //theCanvas_3 = document.getElementById("canvas_3");
    theCanvas_bottom.width =800;
    theCanvas_top.width = 800;
    
    canvasWidth = theCanvas_bottom.width;
    canvasHeight = theCanvas_bottom.height;
    
    orientX = canvasWidth - canvasWidth/orientMag;
    
    console.log("cdim "+canvasWidth+","+canvasHeight);
    //var addFindingButton = document.getElementById("addFindingButton");
    //var defineROIbutton = document.getElementById("defineROIbutton");
    var findingDropdown = document.getElementById("findingsDrop");
    //defineROIbutton= document.getElementById("defineROIbutton");
    description_box = document.getElementById("description_box");
    check1 = document.getElementById("check1");
    check2 = document.getElementById("check2");
    check3 = document.getElementById("check3");
       
	theCanvas_obox1.width=Math.round(cWidth/orientMag);
	theCanvas_obox1.height=Math.round(cHeight/orientMag);
	theCanvas_obox2.width=Math.round(mWidth/orientMag);
	theCanvas_obox2.height=Math.round(mHeight/orientMag);
	
	console.log(theCanvas_obox1.width);
	while(theCanvas_obox1.width != Math.round(cWidth/orientMag) || theCanvas_obox2.width!=Math.round(mWidth/orientMag)){
		console.log("waiting "+theCanvas_obox1.width);
	}
   
	theCanvas_obox1.style.position="absolute";
	theCanvas_obox1.style.left=canvasWidth+"px";
	theCanvas_obox1.style.top=0+"px";
   
	theCanvas_obox2.style.position="absolute";
	theCanvas_obox2.style.left=canvasWidth +"px";
	theCanvas_obox2.style.top=Math.round(cHeight/orientMag)+"px";
	
	context_bottom = theCanvas_bottom.getContext("2d"); 
    context_top = theCanvas_top.getContext("2d"); 
    context_obox1 = theCanvas_obox1.getContext("2d"); 
    context_obox2 = theCanvas_obox2.getContext("2d"); 
	
	if (theCanvas_top.addEventListener) {  
    	// IE9, Chrome, Safari, Opera  
    	theCanvas_top.addEventListener("mousewheel", MouseWheelHandler, false); 
    	theCanvas_top.addEventListener("mousedown", MouseDownHandler, false); 
    	theCanvas_top.addEventListener("mousemove", MouseMoveHandler, false);
    	theCanvas_top.addEventListener("mouseup", MouseUpHandler, false);
    	theCanvas_top.addEventListener("mouseout", MouseLeaveHandler, false);
    	//canvas.addEventListener("mouseout", MouseUpHandler, false);
    	// Firefox  
    	theCanvas_top.addEventListener("DOMMouseScroll", MouseWheelHandler, false);  
    }  
    // IE 6/7/8  
    else window.attachEvent("onmousewheel", MouseWheelHandler); 
    
    if (theCanvas_obox1.addEventListener) {
        theCanvas_obox1.addEventListener("mousedown", MouseDownHandler, false); 
    	theCanvas_obox1.addEventListener("mousemove", MouseMoveHandler, false);
    	theCanvas_obox1.addEventListener("mouseup", MouseUpHandler, false);
    	theCanvas_obox1.addEventListener("mouseout", MouseLeaveHandler, false);
    	
    }
    if (theCanvas_obox2.addEventListener) {
        theCanvas_obox2.addEventListener("mousedown", MouseDownHandler, false); 
    	theCanvas_obox2.addEventListener("mousemove", MouseMoveHandler, false);
    	theCanvas_obox2.addEventListener("mouseup", MouseUpHandler, false);
    	theCanvas_obox2.addEventListener("mouseout", MouseLeaveHandler, false);
    	
    }
	zoomFactor = canvasWidth/windowWidth;
	//minZoom = canvasWidth/windowWidth;
	
	DefineFinding = false;
	UpdateFinding =false;
	selectedFinding=0;
	isDrawing = false;
	isPolyRoiDrawing = false;
	isRectRoiDrawing = false;
	isSpotMagTool = false;
	viewCM = false;
	answerfindings=new Array();
	windowX=0;
	windowY=0;  
	
	//Get the max image number for this set from the server
	Dajaxice.finding.getMaxImageNum(callback_setMaxImgNum,{"setNum":setNum})

	drawScreen();  	
}
function drawScreen() {

	//Bounds checking
	if(zoomFactor > maxZoom){
		zoomFactor = maxZoom;}
	else if(zoomFactor<minZoom){
		zoomFactor=minZoom;}
	
	if(windowX < canvasWidth-(zoomFactor*windowWidth)){
		windowX = canvasWidth-(zoomFactor*windowWidth);}
	if(windowX > 0){
		windowX = 0;}
	if(windowY < canvasHeight-(zoomFactor*windowHeight)){
		windowY = canvasHeight-(zoomFactor*windowHeight);}
	if(windowY > 0){
		windowY =  0;}	

    //make changes here 
    if(isRectRoiDrawing){
    	drawScreen_top_only();
    }else if(findings.length>0 && findings[selectedFinding].wasJustCompleted){   	
		findings[selectedFinding].wasJustCompleted = false;
		drawScreen_top_only();
		findingDropdownChangeHandler();	
		//context.stroke();
    }else{
    	//context.font = "bold 18px sans-serif";
		context_bottom.clearRect (0, 0, canvasWidth, canvasHeight);
		
		if(viewCM){
			context_bottom.drawImage(imgM, 0,0 , windowWidth, windowHeight,windowX, windowY,windowWidth*zoomFactor,windowHeight*zoomFactor);
		}else{
			context_bottom.drawImage(imgC, 0,0 , windowWidth, windowHeight,windowX, windowY,windowWidth*zoomFactor,windowHeight*zoomFactor);
		}
		//console.log("zoom = " +zoomFactor +", x = " + windowX + ", y = "+windowY);
    	//context.font = "bold 18px sans-serif";
    	    	//Draw orientation box
    	drawScreen_top_only();
    	
    }
    
    //console.log("draw");
   // isDrawing = false;
}
function drawScreen_top_only(){
	
	//context_top.revert();	
	context_top.clearRect (0, 0,canvasWidth, canvasHeight);
	
	context_top.textBaseline = 'top';
	context_top.font = "16px sans-serif";
	var i;
	var j;
	var xpts;
	var ypts;
	var npts;

	context_top.strokeStyle = "red";
	context_top.fillStyle = "red";
	
	for(i=0;i<answerfindings.length;i++){
		if((answerfindings[i].isCC && !viewCM)){
					
			var xx = answerfindings[i].xCC;
			var yy = answerfindings[i].yCC;
	 		context_top.beginPath();
	    	context_top.lineTo(((xx)*zoomFactor)+windowX -10, (yy)*zoomFactor+windowY-10);
	    	context_top.lineTo(((xx)*zoomFactor)+windowX +10, (yy)*zoomFactor+windowY+10);
			context_top.stroke();
			context_top.closePath();
			
			context_top.beginPath();
			context_top.lineTo(((xx)*zoomFactor)+windowX -10, ((yy)*zoomFactor)+windowY+10);
	    	context_top.lineTo(((xx)*zoomFactor)+windowX +10, ((yy)*zoomFactor)+windowY-10);
			context_top.stroke();
			context_top.closePath();
			
			context_top.fillText("F"+(answerfindings[i].findingNum+1),(xx*zoomFactor)+windowX, (yy*zoomFactor)+windowY);
			context_top.stroke();
			context_top.closePath();
			
		}else if(answerfindings[i].isMLO && viewCM){
			var xx = answerfindings[i].xMLO;
			var yy = answerfindings[i].yMLO;
	 		
	 		context_top.beginPath();
	    	context_top.lineTo(((xx)*zoomFactor)+windowX-10, ((yy)*zoomFactor)+windowY-10);
	    	context_top.lineTo(((xx)*zoomFactor)+windowX+10, ((yy)*zoomFactor)+windowY+10);
			context_top.stroke();
			context_top.closePath();
			context_top.beginPath();
			context_top.lineTo(((xx)*zoomFactor)+windowX-10, ((yy)*zoomFactor)+windowY+10);
	    	context_top.lineTo(((xx)*zoomFactor)+windowX+10, ((yy)*zoomFactor)+windowY-10);
			context_top.stroke();
			context_top.closePath();
			
			context_top.fillText("F"+(answerfindings[i].findingNum+1),(xx*zoomFactor)+windowX, (yy*zoomFactor)+windowY);
			context_top.stroke();
			context_top.closePath();
		}
	}
	
	drawOBox();

}
function drawOBox(){
	
	context_obox1.clearRect (0, 0, canvasWidth, canvasHeight);	
	
    var iHeight = imgC.height;
	var iWidth = imgC.width;
	//console.log("ch, cw = "+iHeight+","+iWidth);
	
	context_obox1.drawImage(imgC, 0,0 , iWidth, iHeight,0, 0,(iWidth)/orientMag,(iHeight)/orientMag);
	
	iHeight = imgM.height;
	iWidth = imgM.width;
	
	context_obox2.clearRect (0, 0, canvasWidth, canvasHeight);	
	context_obox2.drawImage(imgM, 0,0 , iWidth, iHeight,0, 0,(iWidth)/orientMag,(iHeight)/orientMag);	
	
	if(!viewCM){
		context_obox1.strokeStyle = '#f00'; // red
		context_obox1.strokeRect(0-((windowX/zoomFactor)/orientMag),0-((windowY/zoomFactor)/orientMag),(((canvasWidth/zoomFactor)))/orientMag,(((canvasHeight/zoomFactor)))/orientMag);
		context_obox1.font = "10px sans-serif";
	}else{
		context_obox2.strokeStyle = '#f00'; // red
		context_obox2.strokeRect(0-((windowX/zoomFactor)/orientMag),0-((windowY/zoomFactor)/orientMag),(((canvasWidth/zoomFactor)))/orientMag,(((canvasHeight/zoomFactor)))/orientMag);
		context_obox2.font = "10px sans-serif";
	}
	for(i=0;i<answerfindings.length;i++){
		if(answerfindings[i].isCC){
		 	if(selectedFinding ==i){
				context_obox1.fillStyle = '#FFFF00';
			}else{
				context_obox1.fillStyle = 'white';
			}
			context_obox1.fillText("F"+(answerfindings[i].findingNum+1),((answerfindings[i].xCC)/orientMag),0+((answerfindings[i].yCC)/orientMag));	
		}
		if(answerfindings[i].isMLO){
			if(selectedFinding ==i){
				context_obox2.fillStyle = '#FFFF00';
			}else{
				context_obox2.fillStyle = 'white';
			}
			context_obox2.fillText("F"+(answerfindings[i].findingNum+1),((answerfindings[i].xMLO)/orientMag),0+((answerfindings[i].yMLO)/orientMag));	

		}
		
	}
	
}

function drawSpotMag(x,y){
	context_top.clearRect (0, 0, canvasWidth, canvasHeight);
	var mag = 1.2;
	var xx =  ((x-100)/zoomFactor)-windowX/zoomFactor - 100/(zoomFactor+mag);
	var yy =  ((y-100)/zoomFactor)-windowY/zoomFactor - 100/(zoomFactor+mag);
	if(viewCM){	
		context_top.drawImage(imgM, xx,yy,200/(zoomFactor+mag),200/(zoomFactor+mag),x-200, y-200,200,200);
	}else{
		context_top.drawImage(imgC, xx,yy,200/(zoomFactor+mag),200/(zoomFactor+mag),x-200, y-200,200,200);	
	}
}
function MouseWheelHandler(e){
	if (e.preventDefault){
		e.preventDefault();
	}
	if(isROIdrawing){
		return;
	}
	var evt=window.event || e; //equalize event object
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	zoomFactor = zoomFactor + 0.05* delta;
	
	if(zoomFactor>minZoom && zoomFactor < maxZoom){
		windowX= windowX -delta*(windowWidth/2)*0.05;
		windowY= windowY -delta*(windowHeight/2)*0.05;
	}
	drawScreen();
}
function MouseUpHandler(e){
	if(DefineFinding){
		DefineFinding=false;
	}
	if(isSpotMagTool){
		isSpotMagTool=false;
		context_top.clearRect (0, 0, canvasWidth, canvasHeight);
		//theCanvas_3.style.zIndex="1000";
		drawScreen();
	}else if(isRectRoiDrawing){
		isROIdrawing=false;
		isRectRoiDrawing=false;
		findings[selectedFinding].isClosed = true;
		findings[selectedFinding].wasJustCompleted = true;
		drawScreen();
	}
	//else{
		isDragging = false;	
	//}
	return true;
}
function MouseDownHandler(e){
	
	if(this.id == "canvas_obox1"){
		viewCM = false;
		isDragging = true;
		windowHeight = imgC.height;
		windowWidth = imgC.width;
		//Needs work. Depends on screen coordinates which could be messed up.
		console.log("sx sy "+e.layerX+","+e.layerY);
		//windowX = (canvasWidth-(zoomFactor*windowWidth)) + (((windowWidth/orientMag-(e.layerX)))*zoomFactor*orientMag) - canvasWidth/2;
		//windowY = (canvasHeight-(zoomFactor*windowHeight)) + ((windowHeight/orientMag- (e.layerY))*zoomFactor*orientMag) - canvasHeight/2;
		windowX = (canvasWidth-(zoomFactor*windowWidth)) + (((windowWidth/orientMag-(e.layerX +80)))*zoomFactor*orientMag) - canvasWidth/2;
		windowY = (canvasHeight-(zoomFactor*windowHeight)) + ((windowHeight/orientMag- (e.layerY +2))*zoomFactor*orientMag) - canvasHeight/2;
		
		dragCoordStart = [e.screenX,e.screenY];
		drawScreen();
		return;
	}
    if(this.id == "canvas_obox2"){
    	viewCM = true;
		isDragging = true;
		windowHeight = imgM.height;
		windowWidth = imgM.width;	
		console.log(" "+e.layerX+","+e.layerY);
		windowX = (canvasWidth-(zoomFactor*windowWidth)) + (((windowWidth/orientMag-(e.layerX +80)))*zoomFactor*orientMag) - canvasWidth/2;
		windowY = (canvasHeight-(zoomFactor*windowHeight)) + ((windowHeight/orientMag- (e.layerY +29))*zoomFactor*orientMag) - canvasHeight/2;
		dragCoordStart = [e.screenX,e.screenY];
		drawScreen();
		return;
	}
	
	/*if(isInOrientationBox(e.layerX,e.layerY)){
		//needs refactoring
		isDragging = true;
		windowX = (canvasWidth-(zoomFactor*windowWidth)) + (((windowWidth/orientMag-(e.layerX-orientX)))*zoomFactor*orientMag) - canvasWidth/2;
		windowY = (canvasHeight-(zoomFactor*windowHeight)) + ((windowHeight/orientMag- e.layerY)*zoomFactor*orientMag) - canvasHeight/2;
		dragCoordStart = [e.screenX,e.screenY];
		drawScreen();
		return;
	}*/
	//}else if(isROIdrawing){
		//console.log("1");
	if(DefineFinding){
		var view="";
		if(viewCM){
			view="MLO";
		}else{
			view="CC";
		}
		addAnswerFinding(true,view,e.layerX,e.layerY);
		drawScreen();
		findingDropdownChangeHandler();
		DefineFinding=false;
		return;
	}
	if(UpdateFinding){
		var view="";
		if(viewCM){
			view="MLO";
		}else{
			view="CC";
		}
		addAnswerFinding(false,view,e.layerX,e.layerY);
		UpdateFinding=false;
		closeFindingForm();
		return;
	}
	
	if(isPolyRoiDrawing){
		isDragging = false;
		isROIdrawing = true;
		if(!findings[selectedFinding].isClosed){
			findings[selectedFinding].addPoint(e.layerX,e.layerY);
				//console.log("2");
		}else{
			isROIdrawing = false;
			isPolyRoiDrawing = false;
		}
		drawScreen();
		return;
	}	

	if(isRectRoiDrawing){
		isDragging = false;
		isROIdrawing = true;
		findings[selectedFinding].addPoint(e.layerX,e.layerY);
			//findings[selectedFinding].isClosed = true;
		return;
	}
	if(isSpotMagTool){
		drawSpotMag(e.layerX,e.layerY);
		return;
	}
	
	isDragging = true;
	var ret = isFindingClicked(e.layerX,e.layerY);
	//If finding was clicked center on that location.
	if(ret >=0){
		selectedFinding = ret;
		findingDropdownChangeHandler();
	}
	
    //isDragging = true;
    dragCoordStart = [e.screenX,e.screenY];
    drawScreen();
	//return;
}
function MouseMoveHandler(e){
	if(isSpotMagTool){
		drawSpotMag(e.layerX,e.layerY);		
	}else if(isRectRoiDrawing && isROIdrawing){
		
		findings[selectedFinding].addRect(e.layerX,e.layerY);
		drawScreen();
		//draw_top
	}else if(isDragging){
		//isDragging = false;	
		var x = e.screenX;
		var y = e.screenY;
		
		//if(isInOrientationBox(e.layerX,e.layerY)){
		if(this.id =="canvas_obox1" || this.id == "canvas_obox2"){
			windowX = windowX - orientMag*(x -dragCoordStart[0])*zoomFactor;
			windowY = windowY - orientMag*(y -dragCoordStart[1])*zoomFactor;			
		}else{
			windowX = windowX + ((x -dragCoordStart[0]));
			windowY = windowY + ((y -dragCoordStart[1]));
		}		
		dragCoordStart = [x,y];
		drawScreen();
		//isDragging = true;
	//}		
	}
	return true;
}
function MouseLeaveHandler(){
	DefineFinding=false;
	UpdateFinding=false;
	isROIdrawing=false;
	isRectRoiDrawing=false;
	isPolyRoiDrawing=false;
	isDragging = false;
}
function isFindingClicked(x,y){
	
	var i;
	var xx = (x-windowX)/zoomFactor;
	var yy = (y-windowY)/zoomFactor;
	for(i=0;i<answerfindings.length;i++){
		if(answerfindings[i].isCC && !viewCM){
			var xo = answerfindings[i].xCC;   
			var yo = answerfindings[i].yCC;
			//console.log("xo,yo= "+xo+","+yo);
			//console.log("xc,yc= "+x+","+y);
	    	if(xx >xo && yy>yo && xx< xo+(20/zoomFactor) && yy< yo+(20/zoomFactor))
	    	{
	    	return i;
	    	}
    	}else if(answerfindings[i].isMLO && viewCM){
    		var xo = answerfindings[i].xMLO;   
			var yo = answerfindings[i].yMLO;
			//console.log("xo,yo= "+xo+","+yo);
			//console.log("xc,yc= "+x+","+y);
	    	if(xx >xo && yy>yo && xx< xo+(20/zoomFactor) && yy< yo+(20/zoomFactor))
	    	{
	    	return i;
	    	}
    	}
	}	
	return -1;
}
//returns true if mouse is in orientation box, otherwise false.
function isInOrientationBox(x,y){	
    return (x>orientX && y<windowHeight/orientMag && zoomFactor>0.5);
}
function gotoPrevFinding(){
	if(answerfindings.length>0){
		selectedFinding--;
		if(selectedFinding<0){selectedFinding=answerfindings.length-1;}
		drawScreen();
		findingDropdownChangeHandler();
	}
}
function gotoNextFinding(){
	if(answerfindings.length>0){
		selectedFinding++;
		if(selectedFinding>answerfindings.length-1){selectedFinding = 0;}
		drawScreen();
		findingDropdownChangeHandler();
	}
}
function markAnswerFinding(){
	DefineFinding = true;
}
function defineFingingOtherView(){
	
	if(viewCM){
		ccView();
	}else{
		mloView();
	}
	UpdateFinding = true;
	
	closeFindingForm();
}
function SaveROIbuttonHandler(e){
	return true;
}
function ClearROIbuttonHandler(e){
	return true;
}
function DefineROIbuttonHandler_polygon(){
	addFinding();
	
	if(findings.length>0){
	//isROIdrawing = true;
	isPolyRoiDrawing = true;
	isRectRoiDrawing = false;
	isSpotMagTool=false;
	}
}
function DefineROIbuttonHandler_rectangle(){
	addFinding();
	
	if(findings.length>0){
	//isROIdrawing = true;
	isPolyRoiDrawing = false;
	isRectRoiDrawing = true;
	isSpotMagTool=false;
	}
}
function SpotMagTool(){
	isROIdrawing = false;
    isPolyRoiDrawing = false;
	isRectRoiDrawing = false;
	isSpotMagTool=true;
}
function constructImpressionsForm(){
	var form = document.getElementById("impressionsForm");
	var fdiv = document.getElementById("findingsList");
	
	fdiv.innerHTML = "";
	var i;
	for(i=0;i<answerfindings.length;i++){
		
		var newDiv = document.createElement('div');
		newDiv.innerHTML = "Finding "+(answerfindings[i].findingNum+1)+"<br>"+
							"Type: "+answerfindings[i].type+ "<br>"+
							"Description: "+answerfindings[i].description+"<hl>";
		
		fdiv.appendChild(newDiv);
	}
	form.style.visibility = 'visible';
}
function closeImpressionForm(){
	document.getElementById("impressionsForm").style.visibility = 'hidden';
}
function ccView(){
	isPolyRoiDrawing = false;
	isRectRoiDrawing = false;
	isSpotMagTool=false;
	viewCM = false;	
	windowHeight = imgC.height;
	windowWidth = imgC.width;
	
	drawScreen();
}
function mloView(){
	isPolyRoiDrawing = false;
	isRectRoiDrawing = false;
	isSpotMagTool=false;
	viewCM = true;	
	windowHeight = imgM.height;
	windowWidth = imgM.width;
	drawScreen();
	
}
function nextImage(){
	imageNum++;	
	if(imageNum > maxImgNum){	
		imageNum = 1;
	}
	
	imgC.src = window.STATIC_URL+"media/set"+setNum+"/"+(imageNum)+"c.jpg";
    imgM.src = window.STATIC_URL+"media/set"+setNum+"/"+(imageNum)+"m.jpg";
 	
}
function findingDropdownChangeHandler(){
	//var dropdown = document.getElementById("findingsDrop");
	var i;
  	//s = "nums: ";
  	var option;
  	document.getElementById("findingForm").style.visibility = "visible";
  	//dropdown.options.length = 0;  	
  //console.log("data length = "+data.fnumbers.length);
  	//for(i=0;i<findings.length;i++){
  	//	option=document.createElement("option");
  	//	option.text=""+findings[i].findingNum;
  	//	dropdown.add(option);
	//	//s += data.fnumbers[i]+" ";
 	//}
  	//console.log(s);
	document.getElementById('finding_indicator').innerHTML = "Finding: "+ (selectedFinding+1) +"/" +answerfindings.length;	
	
	if(answerfindings.length==0){
		//defineROIbutton.disabled = true;
	}else{
		//defineROIbutton.disabled = false;
		description_box.value = answerfindings[selectedFinding].description;
		if(answerfindings[selectedFinding].type =="mass"){
			check1.checked = true;
			check2.checked = false;
			check3.checked = false;
		}else if(answerfindings[selectedFinding].type =="calc"){
			check1.checked = false;
			check2.checked = true;
			check3.checked = false;			
		}else if(answerfindings[selectedFinding].type =="other"){
			check1.checked = false;
			check2.checked = false;
			check3.checked = true;			
		}else{
			check1.checked = false;
			check2.checked = false;
			check3.checked = false;	
		}
		//set dropdown to selected finding.
	}
	return true;
}
function closeFindingForm(){
	saveAnswerFinding();
	document.getElementById("findingForm").style.visibility = "hidden";
	drawScreen();
}
function deleteAnswerFinding(){
	if(answerfindings.length==0){return;}	
	answerfindings.splice(selectedFinding,1);
	
	for(var i=0;i<answerfindings.length;i++){
		answerfindings[i].findingNum = (i);
	}
	findingDropdownChangeHandler();
}
function AnswerFinding() {
	
	this.xCC;
	this.yCC;
	this.xMLO;
	this.yMLO;
	
	this.isCC;
	this.isMLO;
	this.type;
	this.description;
	
	this.imgN;
	this.setN;
	this.findingNum;
	this.init=init;
	this.updateFinding=updateFinding;
	
	function init(fNum){
		if(viewCM){
			this.isMLO=true;
			this.isCC=false;
		}else{
			this.isMLO=false;
			this.isCC=true;
		}
		this.type="";
		this.description="";
		this.imgN = imageNum;
		this.setN = setNum;
		this.findingNum = fNum;
		this.xMLO=-1;
		this.yMLO=-1;
		this.xCC=-1;
		this.yCC=-1;
	}
	function updateFinding(view,x,y){
		var xx = (x-windowX)/zoomFactor;
	  	var yy = (y-windowY)/zoomFactor;
		if(view=="MLO"){
			this.isMLO=true;
			this.xMLO=xx;
			this.yMLO=yy;
		}else if(view=="CC"){
			this.isCC=true;
			this.xCC=xx;
			this.yCC=yy;
		}
		
	}	
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
	
	  this.init=init;
	  this.addPoint=addPoint;
	  this.removeLastPoint=removeLastPoint;
	  this.getXarr=getXarr;
	  this.getYarr=getYarr;
	  this.getNpoints=getNpoints;
	  this.addRect=addRect;

	  function init(fNum){
	  	this.n=0;
	  	this.xArr = new Array();
	  	this.yArr = new Array();
	  	this.isClosed = false;
	  	this.type="";
	  	this.findingNum = fNum;
	  	this.description="";
	  	this.syncedWithServer=false;
	  	this.wasJustCompleted=false;
	  	this.view = viewCM;
	  }    
	 function addPoint(x,y){
	  	this.xArr[this.n] = (x-windowX)/zoomFactor;
	  	this.yArr[this.n] = (y-windowY)/zoomFactor;  	
	  	//Check to see if ROI should be closed.
	  	if(this.n > 2){
	  		if((Math.abs(this.xArr[0] - this.xArr[this.n]) + Math.abs(this.yArr[0] - this.yArr[this.n])) < 100){
	  			this.xArr[this.n] = this.xArr[0];
	  			this.yArr[this.n] = this.yArr[0];
	  			this.isClosed = true;
	  			this.wasJustCompleted=true;
	  			//this.n--;
	  		}
	  	}
	  	this.n++;  	
	  	//console.log("n, x, y = "+this.n+","+this.xArr[this.n]+","+this.yArr[this.n]);	
	  }
	  function addRect(x,y){
	  	var xx = (x-windowX)/zoomFactor;
	  	var yy = (y-windowY)/zoomFactor; 
	  	
	  	this.xArr[1] = xx;
	  	this.yArr[1] = this.yArr[0];
	  	
	  	this.xArr[2] = xx;
	  	this.yArr[2] = yy; 
	  	
	  	this.xArr[3] = this.xArr[0];
	  	this.yArr[3] = yy;
	  	
	  	this.xArr[4] = this.xArr[0];
	  	this.yArr[4] = this.yArr[0];
	  	
	  	this.n=5;
	  }
	  function removeLastPoint(){
	  	this.xArr[this.n] = -1;
	  	this.yArr[this.n] = -1;
	  	this.n--;
	  }
	  function getXarr(){
	  	return this.xArr;
	  }
	  function getYarr(){
	  	return this.yArr;
	  }
	  function getNpoints(){
	  	return this.n;
	  }
}

//***********************************AJAX**********************************
function getAllFindingsFromServer(){
	
}

function deleteAllFindings(){
	Dajaxice.finding.deleteAllFindings(callback_deleteAllFindingsForm);
	//getFindings();
}
function getFindings()
  { 
  Dajaxice.finding.getFindings(callback_updateFindingForm);
  }
  
function addAnswerFinding(create,view,x,y){
	if(create){
	  var newFind = new AnswerFinding();
	  newFind.init(answerfindings.length);
	  newFind.updateFinding(view,x,y);
	  answerfindings.push(newFind);
	  selectedFinding = answerfindings.length-1;
 	}else{
 		answerfindings[selectedFinding].updateFinding(view,x,y);
 	}
}

function addFinding()
  {
  var type = "";
  var xArr= "";
  var yArr= "";
  var npts = 0;
  var description = "";
    
  var params = {"type":type,"description":description,"npts":npts,"xArr":xArr,"yArr":yArr};	
  
  var newFind = new Finding();
  newFind.init(findings.length);	
  findings.push(newFind);
  selectedFinding = findings.length-1;
  	  	
  Dajaxice.finding.addFinding(callback_addFindingForm, params);
  //Create new ROI for this finding - yet to be defined.
  //getFindings();
  }
function saveAnswerFinding(){
	answerfindings[selectedFinding].description =document.getElementById("description_box").value;
	//console.log("description_box value= "+ document.getElementById("description_box").value);
	var mass =check1.checked;
	var calc =check2.checked;
	var other =check3.checked;
	
	if(calc){answerfindings[selectedFinding].type = "calc"; 
	}else if(mass){answerfindings[selectedFinding].type = "mass";
	}else if(other){answerfindings[selectedFinding].type = "other";}
		
	//sendFindingToServer(selectedFinding);
	
}
function saveFinding(){
	//Update information in local finding	
	//Need to figure out how to get user inputted text from this box:
	findings[selectedFinding].description =document.getElementById("description_box").value;
	//console.log("description_box value= "+ document.getElementById("description_box").value);
	var mass =check1.checked;
	var calc =check2.checked;
	var other =check3.checked;
	
	if(calc){findings[selectedFinding].type = "calc"; console.log("calc saved");
	}else if(mass){findings[selectedFinding].type = "mass";
	}else if(other){findings[selectedFinding].type = "other";}
		
	sendFindingToServer(selectedFinding);
	closeFindingForm();
	
}
function deleteFinding()
  {
  var dropdown = document.getElementById("findingsDrop");
  Dajaxice.finding.deleteFinding(callback_deleteFindingForm,{'numToDelete':(dropdown.options[dropdown.selectedIndex].text)});
  //getFindings();
  }
function message_callback(data){
  //document.getElementById("check1").checked=!document.getElementById("check1").checked;
  console.log(data.message);
}
function submitAnswerFindingsAndImpression(){
	sendAnswerFindingsToServer();
	sendAnswerImpressionToServer();
	closeImpressionForm();
}
function sendAnswerFindingsToServer(){
	if(answerfindings.length==0){return;}
	var params;
	for(var i=0;i<answerfindings.length;i++){
		var f = answerfindings[i];
		params = {"imageNum":f.imgN,"setNum":f.setN,"findingNum":f.findingNum,"isCCView":f.isCC,"isMLOView":f.isMLO,"xLocCC":f.xCC,
						"yLocCC":f.yCC,"xLocMLO":f.xMLO,"yLocMLO":f.yMLO,"ftype":f.type,"description":f.description};			
		Dajaxice.finding.addAnswerFinding(message_callback,params);		
	}
	
	
}
function sendAnswerImpressionToServer(){
	var impform = document.getElementById("impressionsForm");
	var description = document.getElementById("impressions_box").value;
	var finalPathology = document.getElementById("final_path_box").value;
	var brRadio = document.getElementsByName("radio1");
	var biradsNum = -1;
	for(var i=0;i<brRadio.length;i++){
		if(brRadio[i].checked){
			biradrNum = i;
		}
	}
	var params = {"imageNum":imageNum,"setNum":setNum,"biradsNum":biradsNum,"description":description,"finalPathology":finalPathology};
	Dajaxice.finding.addAnswerImpression(message_callback,params);
}
function sendFindingToServer(numToSend){	
	var f = findings[numToSend];
	//Need to convert xArr, yArr to csv strings?
	var params = {"findingNum":f.findingNum,"type":f.type,"description":f.description,"npts":f.n,"xArr":"1,2,3","yArr":"4,5,6"};	
	Dajaxice.finding.updateFinding(callback_sendFindingToServer,params);
}
function callback_deleteAllFindingsForm(data){
	findings = new Array();
	isROIdrawing = false;
	selectedFinding = -1;
}
function callback_sendFindingToServer(data){
	if(data.success ==1){
		findings[data.numUpdated].syncedWithServer=true;
		findingDropdownChangeHandler();
	}else{
		findings[data.numUpdated].syncedWithServer=false;
		console.log(data.message);
	}
}
function callback_deleteFindingForm(data){ 
	var i;
	for(i=0;i<findings.length;i++){
		if(findings[i].findingNum == data.numDeleted){
			findings.splice(i,1);
		}
	}
	findingDropdownChangeHandler();
}
function callback_addFindingForm(data){ 
 //newFind = new Finding();
 //newFind.init(findings.length);	
 //findings.push(newFind);
 console.log("findings length = "+findings.length);
 //console.log(""+(data.numUpdated-1));
 selectedFinding = findings.length-1;
 findings[selectedFinding].syncedWithServer = true;
 //var dropdown = document.getElementById("findingsDrop");
  //console.log(data.message);
  
  //console.log("selected finding = "+selectedFinding);

  //findingDropdownChangeHandler();
}

function callback_updateFindingForm(data){
  var dropdown = document.getElementById("findingsDrop");
  console.log(data.message);
  findingDropdownChangeHandler();
}
function callback_setMaxImgNum(data){
	maxImgNum = data.maxImageNum;
	console.log("Max Image Num set to "+maxImgNum);
}
function message_callback(data){
  console.log(data.message);  
}
