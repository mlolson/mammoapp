var imgC = new Image();
var imgM = new Image();

var setNum = 1;
var imageNum = 1;
var MaxImgNum = 1;

window.addEventListener('load', eventWindowLoaded, false);

var windowWidth = 2560;
var windowHeight = 3328;

var canvasWidth;
var canvasHeight;

//Score keeping
var TotalNumOfFindings =0;
var TotalNumOfCorrectFindings =0;
//********************************

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
var DisplayAnswers = false;

var imgCLoaded = false;
var imgMLoaded = false;

var orientMag = 3;
var orientX;

//DOM objects
var defineROIbutton;
var description_box;
var check1;
var check2;
var check3;
var FindingsBox;
//var theCanvas_3;

//All findings on client side
var findings = new Array();
var answerfindings = new Array();
var Answer_Impression;
var User_Impression;

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
    
    FindingsBox = document.getElementById("findingForm");
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
	windowX=0;
	windowY=0; 
	DisplayAnswers = false;
	Answer_Impression = new AnswerImpression(false,"","","",-1);
	User_Impression = new AnswerImpression(false,"","","",-1);
	closeFindingForm();
	closeImpressionForm();
	Dajaxice.finding.getMaxImageNum(callback_setMaxImgNum,{"setNum":setNum})
	findings.length=0;
	answerfindings.length=0;
	User_Impression.init();
	Answer_Impression.init();
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
		isPolyRoiDrawing=false;
		isROIdrawing = false;
		drawScreen_top_only();
		findingDropdownChangeHandler(false,200,50);	
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
		
	context_top.clearRect (0, 0, canvasWidth, canvasHeight);
	context_top.textBaseline = 'top';
	context_top.font = "16px sans-serif";
	var i;
	var j;
	var xpts;
	var ypts;
	var npts;

	for(i=0;i<findings.length;i++){
		if(findings[i].view==viewCM){
			npts = findings[i].n; 		
			//console.log("n pts = " + npts);
			context_top.beginPath();
			xpts = findings[i].xArr;
			ypts = findings[i].yArr;
			if(!findings[i].isClosed){
				context_top.strokeStyle = "red";
				context_top.fillStyle = "red";
			}else if(selectedFinding ==i){
				context_top.strokeStyle = '#FFFF00'; //yellow
				context_top.fillStyle = '#FFFF00';
			}else{
				context_top.strokeStyle = 'white';
				context_top.fillStyle = 'white';
			}
	 		//console.log(npts);
			for(j=0;j<npts;j++){
				//console.log("px,py = "+xpts[n] +","+ypts[n]);
	    		context_top.lineTo((xpts[j]*zoomFactor)+windowX, (ypts[j]*zoomFactor)+windowY);
			} 
			//if(findings[i].isClosed){
				//maybe not neccesary to set these every time, but might want to customize response later.		
				//add text label over finding.
			
			context_top.fillText("F"+(findings[i].findingNum+1),(xpts[0]*zoomFactor)+windowX, (ypts[0]*zoomFactor)+windowY);
			context_top.stroke();
			
			//context_top.fillStyle = 'rgba(0,0,'+(i+10)+',0.1)';
			//context_top.fill();
			context_top.closePath();
			//context_top.save();
			//fill with transparent color to mark finding ROI area:
			
		}
	}
	
	if(DisplayAnswers){
		
		for(i=0;i<answerfindings.length;i++){
			
			if(answerfindings[i].corFinding==-1){
				context_top.strokeStyle = "red";
				context_top.fillStyle = "red";	
			}else{
				context_top.strokeStyle = "#7CFC00";
				context_top.fillStyle = "#7CFC00";
			}
			
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
				
				context_top.fillText("A"+(answerfindings[i].findingNum+1),(xx*zoomFactor)+windowX, (yy*zoomFactor)+windowY);				
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
				
				
				
				context_top.fillText("A"+(answerfindings[i].findingNum+1),(xx*zoomFactor)+windowX, (yy*zoomFactor)+windowY);
				
				context_top.stroke();
				context_top.closePath();
			}
		}
	}
	
	
	drawOBox();

}
function drawOBox(){
	
	context_obox1.clearRect (0, 0, canvasWidth, canvasHeight);	
	
    var iHeight = imgC.height;
	var iWidth = imgC.width;
	var i;
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
	for(i=0;i<findings.length;i++){
		if(!findings[i].view){
		 	if(selectedFinding ==i){
				context_obox1.fillStyle = '#FFFF00';
			}else{
				context_obox1.fillStyle = 'white';
			}
			context_obox1.fillText("F"+(findings[i].findingNum+1),((findings[i].xArr[0])/orientMag),0+((findings[i].yArr[0])/orientMag));	
		}else{
			if(selectedFinding ==i){
				context_obox2.fillStyle = '#FFFF00';
			}else{
				context_obox2.fillStyle = 'white';
			}
			context_obox2.fillText("F"+(findings[i].findingNum+1),((findings[i].xArr[0])/orientMag),0+((findings[i].yArr[0])/orientMag));	

		}
		
	}
	
	if(DisplayAnswers){
		for(i=0;i<answerfindings.length;i++){
			if(answerfindings[i].isCC){
				if(answerfindings[i].corFinding==-1){
					context_obox1.fillStyle = 'red';
				}else{
					context_obox1.fillStyle = '#7CFC00';
				}
				context_obox1.fillText("A"+(answerfindings[i].findingNum+1),((answerfindings[i].xCC)/orientMag),0+((answerfindings[i].yCC)/orientMag));					
			}
			if(answerfindings[i].isMLO){
				if(answerfindings[i].corFinding==-1){
					context_obox2.fillStyle = 'red';
				}else{
					context_obox2.fillStyle = '#7CFC00';
				}
				context_obox2.fillText("A"+(answerfindings[i].findingNum+1),((answerfindings[i].xMLO)/orientMag),0+((answerfindings[i].yMLO)/orientMag));								
			}		
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
		findingDropdownChangeHandler(false,250,200);	
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
		windowX = (canvasWidth-(zoomFactor*windowWidth)) + (((windowWidth/orientMag-(e.layerX)))*zoomFactor*orientMag) - canvasWidth/2;
		windowY = (canvasHeight-(zoomFactor*windowHeight)) + ((windowHeight/orientMag- (e.layerY))*zoomFactor*orientMag) - canvasHeight/2;
		
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
		windowX = (canvasWidth-(zoomFactor*windowWidth)) + (((windowWidth/orientMag-(e.layerX)))*zoomFactor*orientMag) - canvasWidth/2;
		windowY = (canvasHeight-(zoomFactor*windowHeight)) + ((windowHeight/orientMag- (e.layerY))*zoomFactor*orientMag) - canvasHeight/2;
		dragCoordStart = [e.screenX,e.screenY];
		drawScreen();
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
			//findingDropdownChangeHandler(false,250,60);	
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
		findingDropdownChangeHandler(false,250,60);
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
	//console.log("leave");
	isROIdrawing=false;
	isRectRoiDrawing=false;
	//isPolyRoiDrawing=false;
	isDragging = false;
}
function isFindingClicked(x,y){
	
	var i;
	var xx = (x-windowX)/zoomFactor;
	var yy = (y-windowY)/zoomFactor;
	for(i=0;i<findings.length;i++){
		if(findings[i].view == viewCM){
			var xo = findings[i].xArr[0];   
			var yo = findings[i].yArr[0];
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
	if(findings.length>0){
		selectedFinding--;
		if(selectedFinding<0){selectedFinding=findings.length-1;}
		drawScreen();
		findingDropdownChangeHandler(false,250,60);
	}
}
function gotoNextFinding(){
	if(findings.length>0){
		selectedFinding++;
		if(selectedFinding>findings.length-1){selectedFinding = 0;}
		drawScreen();
		findingDropdownChangeHandler(false,200,50)
	}
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
	var fdiv = document.getElementById("findingsList");
	var afdiv = document.getElementById("answerFindingsList");
	var findingsHeaderDiv = document.getElementById("findingsHeader");
	var str =" finding";
	if(findings.length==1){
		str += ":";
	}else{
		str += "s:";
	}		
	findingsHeaderDiv.innerHTML="You have marked "+findings.length+str;
	fdiv.innerHTML = "";
	afdiv.innerHTML = "";
	
	var i;
	for(i=0;i<findings.length;i++){		
		var newDiv = document.createElement('div');
		newDiv.className = 'findingElement';
		newDiv.innerHTML = "Finding "+(findings[i].findingNum+1)+"<br>"+
							"Type: "+findings[i].type+ "<br>"+
							"Description: "+findings[i].description;		
		newDiv.style.border = "1pt solid yellow";
		var answerNums = findings[i].corAnswerNums;
		//Display answers that are attached to finding
		if(DisplayAnswers){	
			if(answerNums.length >0){
				newDiv.style.border= '1px solid #7CFC00';
				for(var k=0;k<answerNums.length;k++){
					var newADiv = document.createElement('div');
					newADiv.className = 'answerFindingElement';
					newADiv.innerHTML = "Answer Finding "+(answerfindings[answerNums[k]].findingNum+1)+"<br>"+
										"Type: "+answerfindings[answerNums[k]].type+ "<br>"+
										"Description: "+answerfindings[answerNums[k]].description;
					newADiv.style.border= '1px solid #7CFC00';
					afdiv.appendChild(newADiv);
				}
			}else{
				var newADiv = document.createElement('div');
				newADiv.className = 'answerFindingElement';
				newDiv.style.border= '1px solid red';
				newADiv.innerHTML = "<br><br><br>";
				afdiv.appendChild(newADiv);
			}					
			
		}
		fdiv.appendChild(newDiv);
	}

	//display any answerfindings that weren't "found"
	//REALLY could use JQuery here instead of this long winded JS
	if(DisplayAnswers){	
		var ncorrectfindings = 0;
		for(var i=0;i<answerfindings.length;i++){
			if(answerfindings[i].corFinding==-1){
				var newADiv = document.createElement('div');
				newADiv.className = 'answerFindingElement';
				newADiv.innerHTML = "Answer Finding "+(answerfindings[i].findingNum+1)+"<br>"+
								"Type: "+answerfindings[i].type+ "<br>"+
								"Description: "+answerfindings[i].description;
				newADiv.style.border= '1px solid red';
				afdiv.appendChild(newADiv);	
			}else{
				ncorrectfindings++;
			}	
		}
		
		findingsHeaderDiv.innerHTML=("You found "+ncorrectfindings+" out of "+answerfindings.length+" findings:");
		
		//Update overall score:
		TotalNumOfFindings += answerfindings.length;
		TotalNumOfCorrectFindings += ncorrectfindings;
		
		var biradsDiv = document.getElementById("biradsDiv");
		biradsDiv.innerHTML = " Your BIRADS#: "+User_Impression.biradsNum+"<br>Answer BIRADS#: "+Answer_Impression.biradsNum;
		if(User_Impression.biradsNum ==Answer_Impression.biradsNum){
			biradsDiv.style.color = '#7CFC00';
		}else{
			biradsDiv.style.color ='red';
		}
		var impressionDiv = document.getElementById("impressionDiv");
		impressionDiv.innerHTML="";
		var newDiv = document.createElement('div');
		newDiv.className = 'answerTextDivL';
		newDiv.innerHTML="User Impression <br>";
		var newText = document.createElement('textarea');
		newText.cols='35';
		newText.rows='8';
		newText.value = User_Impression.description;
		newDiv.appendChild(newText);
		impressionDiv.appendChild(newDiv);
		
		var newDiv2 = document.createElement('div');
		newDiv2.className = 'answerTextDivR';
		newDiv2.innerHTML="Answer Impression <br>";
		var newText2 = document.createElement('textarea');
		newText2.cols='35';
		newText2.rows='8';
		newText2.value = Answer_Impression.description;
		newDiv2.appendChild(newText2);
		impressionDiv.appendChild(newDiv2);
		
		var indicationsDiv = document.getElementById("indicationsDiv");
		indicationsDiv.innerHTML="";
		var newDiv = document.createElement('div');
		newDiv.className = 'answerTextDivL';
		newDiv.innerHTML="User Indications <br>";
		var newText = document.createElement('textarea');
		newText.cols='35';
		newText.rows='1';
		newText.value = User_Impression.indications;
		newDiv.appendChild(newText);
		indicationsDiv.appendChild(newDiv);	
		
		var newDiv2 = document.createElement('div');
		newDiv2.className = 'answerTextDivR';
		newDiv2.innerHTML="Answer Indications <br>";
		var newText2 = document.createElement('textarea');
		newText2.cols='35';
		newText2.rows='1';
		newText2.value = Answer_Impression.indications;
		newDiv2.appendChild(newText2);
		indicationsDiv.appendChild(newDiv2);
		
		var pathDiv = document.getElementById("finalPathologyDiv");
		pathDiv.innerHTML = "";
		var newDiv = document.createElement('div');
		newDiv.className = 'answerTextDivL';
		newDiv.innerHTML="User Pathology <br>";
		var newText = document.createElement('textarea');
		newText.cols='35';
		newText.rows='1';
		newText.value = User_Impression.finalPathology;
		newDiv.appendChild(newText);
		pathDiv.appendChild(newDiv);	
		
		var newDiv2 = document.createElement('div');
		newDiv2.className = 'answerTextDivR';
		newDiv2.innerHTML="Answer Pathology <br>";
		var newText2 = document.createElement('textarea');
		newText2.cols='35';
		newText2.rows='1';
		newText2.value = Answer_Impression.finalPathology;
		newDiv2.appendChild(newText2);
		pathDiv.appendChild(newDiv2);		
		
		document.getElementById("nextCaseButton").disabled=false;
		document.getElementById("saveAndSubmitImpressionButton").disabled=true;
	
	}else{
		var biradsDiv = document.getElementById("biradsDiv");
		var brHTML = "Choose BIRADS#: ";
		for(var j=0;j<7;j++){
			brHTML+='<input type="radio" class="formelement" name="radio1" value='+j+'> '+j;	 
		}
		biradsDiv.innerHTML=brHTML;
		biradsDiv.style.color="white";
		document.getElementById("impressionDiv").innerHTML = 
			'Impression <br><textarea name="impression" id="impressions_box" cols="60" rows="5"></textarea><br>';
		document.getElementById("indicationsDiv").innerHTML =
			'Indications<br><textarea name="indications" id="indications_box" cols="60" rows="1"></textarea><br>';	
		document.getElementById("finalPathologyDiv").innerHTML =
			'Guess Final Pathology<br><textarea name="finalPath" id="final_path_box" cols="60" rows="1"></textarea><br>';
		document.getElementById("nextCaseButton").disabled=true;
		document.getElementById("saveAndSubmitImpressionButton").disabled=false;	
	}
		
	document.getElementById("impressionsForm").style.visibility = 'visible';
	
	
}
function closeImpressionForm(){
	document.getElementById("impressionsForm").style.visibility = 'hidden';
}
//********************ANSWER CHECKING FUNCTIONS****************************
function checkFindingAnswers(){	
	
	User_Impression.description = document.getElementById("impressions_box").value;
	User_Impression.indications = document.getElementById("indications_box").value;
	User_Impression.finalPathology = document.getElementById("final_path_box").value;
	
	var radios = document.getElementsByName('radio1');
	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
	    	User_Impression.biradsNum=radios[i].value;
	    }
	}
	
	if(User_Impression.biradsNum==-1){
		alert("Please indicate BIRADS number.");
		return;
	}
	
	Dajaxice.finding.returnAllAnswerFindings(callback_checkFindingAnswers,{"setNum":setNum,"imageNum":imageNum});		
}
function callback_checkFindingAnswers(data){
	
	var returnedAFs = data.AnswerFindings;
	var returnedAI = data.AnswerImpression;
	//It works! Answer findings are returned from server.
	//Now need some method to process them and check against user findings (oh boy!)
	answerfindings.length=0;
	for(var i=0;i<returnedAFs.length;i++){
		var newAF = new AnswerFinding(imageNum,setNum,returnedAFs[i].findingNum,
				returnedAFs[i].isCCView,returnedAFs[i].isMLOView,returnedAFs[i].xLocCC,
				returnedAFs[i].yLocCC,returnedAFs[i].xLocMLO,returnedAFs[i].yLocMLO,
				returnedAFs[i].type,returnedAFs[i].description,-1);
		answerfindings.push(newAF);
	}
	
	DisplayAnswers = true;
	
	for(var i=0;i<findings.length;i++){
		findings[i].corAnswerNums.length = 0;
		for(var j=0;j<answerfindings.length;j++){		
			if(findings[i].roiContainsAnswer(answerfindings[j])){
				findings[i].corAnswerNums.push(j);
				answerfindings[j].corFinding = i;
			}			
		}
	}
	Answer_Impression.description = returnedAI[0].description;
	Answer_Impression.finalPathology = returnedAI[0].finalPathology;
	Answer_Impression.biradsNum = returnedAI[0].biradsNum;
	Answer_Impression.indications = returnedAI[0].indications;
	Answer_Impression.syncedWithServer = true;
	
	drawScreen();
	constructImpressionsForm();
}
function AnswerImpression(syncedWithServer,description,finalPathology,indications,biradsNum){
	this.syncedWithServer = syncedWithServer;
	this.description = description;
	this.finalPathology = finalPathology;
	this.biradsNum=biradsNum;
	this.indications=indications;
	this.init=init;
	
	function init(){
		this.syncedWithServer =false;
		this.description = "";
		this.finalPathology ="";
		this.biradsNum=-1;
		this.indications="";	
	}
}
function AnswerFinding(imgN,setN,findingNum,isCC,isMLO,xCC,yCC,xMLO,yMLO,type,description,corFinding) {	
	this.xCC= xCC;
	this.yCC= yCC;
	this.xMLO= xMLO;
	this.yMLO= yMLO;	
	this.isCC= isCC;
	this.isMLO= isMLO;
	this.type=type;
	this.description=description;	
	this.imgN=imgN;
	this.setN=setN;
	this.findingNum=findingNum;
	this.corFinding=corFinding;
}
//*************************************************************************
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
function zoomOut(){
	zoomFactor = zoomFactor -0.4;
	
	if(zoomFactor>minZoom && zoomFactor < maxZoom){
		windowX= windowX +(windowWidth/2)*0.4;
		windowY= windowY +(windowHeight/2)*0.4;
	}
	drawScreen();
}
function zoomIn(){
	zoomFactor = zoomFactor + 0.4;
	
	if(zoomFactor>minZoom && zoomFactor < maxZoom){
		windowX= windowX -((windowWidth/2)*0.4);
		windowY= windowY -((windowHeight/2)*0.4);
	}
	drawScreen();
}
function nextImage(){
	imageNum++;
	if(imageNum>MaxImgNum){
		//call final page/score view with ajax??
		//shit is tricky...
		window.location = "/mammo/score/"+TotalNumOfCorrectFindings+"/"+TotalNumOfFindings+"/";	
		return;
	}
	
	imgC.src = window.STATIC_URL+"media/set"+setNum+"/"+(imageNum)+"c.jpg";
    imgM.src = window.STATIC_URL+"media/set"+setNum+"/"+(imageNum)+"m.jpg";
 	
}
function findingDropdownChangeHandler(updatePos,x,y){
	//var dropdown = document.getElementById("findingsDrop");
	if(findings.length==0){
		closeFindingForm();
		return;
	}
	
	var i;
  	//s = "nums: ";
  	var option;
  	FindingsBox.style.visibility = "visible";
  	//dropdown.options.length = 0;  	
  //console.log("data length = "+data.fnumbers.length);
  	//for(i=0;i<findings.length;i++){
  	//	option=document.createElement("option");
  	//	option.text=""+findings[i].findingNum;
  	//	dropdown.add(option);
	//	//s += data.fnumbers[i]+" ";
 	//}
  	//console.log(s);
  	if(updatePos){
  		FindingsBox.style.left = x+"px";
  		FindingsBox.style.top = y+"px";
  	}
  	
	document.getElementById('finding_indicator').innerHTML = "Finding: "+ (selectedFinding+1) +"/" +findings.length;	
	
	if(findings.length==0){
		//defineROIbutton.disabled = true;
	}else{
		//defineROIbutton.disabled = false;
		description_box.value = findings[selectedFinding].description;
		if(findings[selectedFinding].type =="mass"){
			check1.checked = true;
			check2.checked = false;
			check3.checked = false;
		}else if(findings[selectedFinding].type =="calc"){
			check1.checked = false;
			check2.checked = true;
			check3.checked = false;			
		}else if(findings[selectedFinding].type =="other"){
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
	FindingsBox.style.visibility = "hidden";
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
	  this.roiContainsAnswer=roiContainsAnswer;
	  
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
	  	this.corAnswerNums=new Array();
	  }    
	 function addPoint(x,y){
	  	this.xArr[this.n] = (x-windowX)/zoomFactor;
	  	this.yArr[this.n] = (y-windowY)/zoomFactor;  	
	  	//Check to see if ROI should be closed.
	  	if(this.n > 2){
	  		if((Math.abs(this.xArr[0] - this.xArr[this.n]) + Math.abs(this.yArr[0] - this.yArr[this.n])) < 30/zoomFactor){
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
	  function roiContainsAnswer(answerFinding){
		  var xx;
		  var yy;
		  if(answerFinding.isCC && !this.view){
			  xx = answerFinding.xCC;
			  yy = answerFinding.yCC;	  
		  }else if(answerFinding.isMLO && this.view){
			  xx = answerFinding.xMLO;
			  yy = answerFinding.yMLO;
		  }else{
			  return false;
		  }
		  
		  //Draw ray from point to side, if it intersect an odd number of lines it is 
		  //inside, if it intersects an even number it is outside.
		  var i, j, c = false;
		    for(i=0, j = this.n-1; i < this.n; j = i++ ) {
		        if( ( ( this.yArr[i] > yy ) != ( this.yArr[j] > yy ) ) &&
		            ( xx < ( this.xArr[j] -this.xArr[i] ) * ( yy - this.yArr[i] ) / ( this.yArr[j] - this.yArr[i] ) + this.xArr[i] ) ) {
		                c = !c;
		        }
		   }
		   return c;	  		  
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
		
	//sendFindingToServer(selectedFinding);
	
}
function saveAndCloseFinding(){
	saveFinding();
	closeFindingForm();
}
function deleteFinding()
  {
  //var dropdown = document.getElementById("findingsDrop");
  //Dajaxice.finding.deleteFinding(callback_deleteFindingForm,{'numToDelete':(FindingsBox.options[FindingsBox.selectedIndex].text)});
  //getFindings();
	if(findings.length ==0){
		return;
	}
	
	findings.splice(selectedFinding,1);
	for(var i=0;i<findings.length;i++){
		findings[i].findingNum = i;
	}		
	if(selectedFinding>= findings.length){
		selectedFinding = findings.length-1;
	}

	drawScreen();
	findingDropdownChangeHandler();
	
		
  }
function message_callback(data){
  //document.getElementById("check1").checked=!document.getElementById("check1").checked;
  console.log(data.message);
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
		findingDropdownChangeHandler(false,200,50);
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
	findingDropdownChangeHandler(false,200,50);
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

  //findingDropdownChangeHandler(false,200,50);
}

function callback_updateFindingForm(data){
  //var dropdown = document.getElementById("findingsDrop");
  console.log(data.message);
  findingDropdownChangeHandler(false,200,50);
}
function callback_setMaxImgNum(data){
	MaxImgNum = data.maxImageNum;
	console.log("Max Image Num set to "+MaxImgNum);
}
function my_js_callback2(data){
  check1.checked=!check1.checked;
  var s = "";
  var i;
  for(i=0;i<data.fnumbers.length;i++){ s += data.fnumbers[i]+ "  "}

  console.log(s);
  
}
