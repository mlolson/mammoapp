var img = new Image();

window.addEventListener('load', eventWindowLoaded, false);

var imgRoot = 'C:/Users/Matt/Documents/Aptana Studio 3 Workspace/radappbackend/finding/static/';
var windowWidth = 2560;
var windowHeight = 3328;
var windowX = 0;
var windowY = 0;
var zoomFactor = 0.15;
var minZoom = 0.15; 
var maxZoom = 1.0;
var mouseWheelObject;
var context_top;
var context_bottom;
var isDragging = false;
var isROIdrawing = false;
var windowXmin = 0;
var windowXmax = windowWidth;
var windowYmin = 0;
var windowYmax = windowHeight;
var newROI = new Finding();
var imgLoaded = false;
var orientBoxXmin = 0;
var orientBoxYmin = 0;
var orientBoxXmax = 0;
var orientBoxYmax = 0;
var selectedFinding;
var isDrawing = false;

//DOM objects
var defineROIbutton;
var description_box;
var check1;
var check2;
var check3;

//All findings on client side
var findings = new Array();

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
    img.src = window.STATIC_URL+"media/imageC.jpg";
    //img.src = imgRoot+"media/image.jpg";
    newROI.init(0);
    var theCanvas_bottom = document.getElementById("canvas_bottom");
    var theCanvas_top = document.getElementById("canvas_top");
    //var addFindingButton = document.getElementById("addFindingButton");
    //var defineROIbutton = document.getElementById("defineROIbutton");
    var findingDropdown = document.getElementById("findingsDrop");
    defineROIbutton= document.getElementById("defineROIbutton");
    description_box = document.getElementById("description_box");
    check1 = document.getElementById("check1");
    check2 = document.getElementById("check2");
    check3 = document.getElementById("check3");
    
    context_bottom = theCanvas_bottom.getContext("2d"); 
    context_top = theCanvas_top.getContext("2d"); 
    img.addEventListener('load', eventImgLoaded , false);
    
    //while(!imgLoaded){}
    //if (findingDropdown.addEventListener){
    	// IE9, Chrome, Safari, Opera  
    //	findingDropdown.addEventListener("onfocus", findingDropdownChangeHandler, true);
    //}        
    //if (defineROIbutton.addEventListener){
    	// IE9, Chrome, Safari, Opera  
   // 	defineROIbutton.addEventListener("mousedown", DrawROIbuttonHandler, false);
    //}
    //var saveROIbutton = document.getElementById("saveROIbutton");
   // if (saveROIbutton.addEventListener){
    	// IE9, Chrome, Safari, Opera  
    //	saveROIbutton.addEventListener("mousedown", SaveROIbuttonHandler, false);
   // }
    if (theCanvas_top.addEventListener) {  
    	// IE9, Chrome, Safari, Opera  
    	theCanvas_top.addEventListener("mousewheel", MouseWheelHandler, false); 
    	theCanvas_top.addEventListener("mousedown", MouseDownHandler, false); 
    	theCanvas_top.addEventListener("mousemove", MouseMoveHandler, false);
    	theCanvas_top.addEventListener("mouseup", MouseUpHandler, false);
    	//canvas.addEventListener("mouseout", MouseUpHandler, false);
    	// Firefox  
    	theCanvas_top.addEventListener("DOMMouseScroll", MouseWheelHandler, false);  
    }  
    // IE 6/7/8  
    else window.attachEvent("onmousewheel", MouseWheelHandler);  
    //Add drag functionality for IE 6-8 later.
    
    // mouseWheelObject = new mouseWheel();
	// mouseWheelObject.init(img, self.onmousewheel);
   }
   function eventImgLoaded() {
   	   //alert('loaded');
   	   imgLoaded = true;
	   windowHeight = img.height;
	   windowWidth = img.width;
	   drawScreen();
	   //drawScreen(context,img,minZoom);   
	   //getFindings();
   }
}
function drawScreen() {
	
	//if(isDrawing){
		//return;
	//}
	
	//isDrawing = true;
	//Bounds checking
	if(zoomFactor > maxZoom){
		zoomFactor = maxZoom;}
	else if(zoomFactor<minZoom){
		zoomFactor=minZoom;}
	
	if(windowX < 1024-(zoomFactor*windowWidth)){
		windowX = 1024-(zoomFactor*windowWidth);}
	if(windowX > 0){
		windowX = 0;}
	if(windowY < 700-(zoomFactor*windowHeight)){
		windowY = 700-(zoomFactor*windowHeight);}
	if(windowY > 0){
		windowY =  0;}	
		/*
	   		var i;
    	var j;
  
    	for(i=0;i<findings.length;i++){
    
    		var npts = findings[i].n; 		
    		//console.log("n pts = " + npts);
   			context.beginPath();
    		var xpts = findings[i].xArr;
    		var ypts = findings[i].yArr;
    
   	 		//console.log(npts);
    		for(j=0;j<npts;j++){
    			//console.log("px,py = "+xpts[n] +","+ypts[n]);
        		context.lineTo((xpts[j]*zoomFactor)+windowX, (ypts[j]*zoomFactor)+windowY);
    		} 
    		//if(findings[i].isClosed){
    			//maybe not neccesary to set these every time, but might want to customize response later.
    		if(selectedFinding ==i){
    			context.strokeStyle = '#FFFF00';
    			context.fillStyle = '#FFFF00';
    		}else{
    			context.strokeStyle = 'white';
    			context.fillStyle = 'white';
    		}
    		
    			//add text label over finding.
    		context.fillText("F"+(findings[i].findingNum+1),(xpts[0]*zoomFactor)+windowX, (ypts[0]*zoomFactor)+windowY);
    		//}else{
    			//context.strokeStyle = "red";
    	///context.lineTo(100, 500);
    	//context.lineTo(500, 10);
    	//context.fill();
    	context.stroke();
    	context.closePath();
    	}*/	
    //make changes here 
    
    if(findings.length>0 && findings[selectedFinding].wasJustCompleted){   	
		findings[selectedFinding].wasJustCompleted = false;
		drawScreen_top_only();
		
    	//context.stroke();
    }else{
    	//context.font = "bold 18px sans-serif";
		context_bottom.clearRect (0, 0, windowWidth, windowHeight);
		context_bottom.drawImage(img, 0,0 , windowWidth, windowHeight,windowX, windowY,windowWidth*zoomFactor,windowHeight*zoomFactor);
		
		//console.log("zoom = " +zoomFactor +", x = " + windowX + ", y = "+windowY);
    	//context.font = "bold 18px sans-serif";
    	    	//Draw orientation box
    	drawScreen_top_only();
    	
    }
    
    //console.log("draw");
   // isDrawing = false;
}
function drawScreen_top_only(){
		
	context_top.clearRect (0, 0, windowWidth, windowHeight);
	context_top.textBaseline = 'top';
	context_top.font = "16px sans-serif";
	var i;
	var j;
	var xpts;
	var ypts;
	var npts;
	

	for(i=0;i<findings.length;i++){

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
		context_top.closePath();
	}
	if(zoomFactor>0.5){
		context_top.drawImage(img, 0,0 , windowWidth, windowHeight,600, 0,(windowWidth)/15,(windowHeight)/15);
		context_top.strokeStyle = '#666'; // grey
		context_top.strokeRect(600,0,(windowWidth)/15,(windowHeight)/15);
		context_top.strokeStyle = '#f00'; // red
		context_top.strokeRect(600-((windowX/zoomFactor)/15),0-((windowY/zoomFactor)/15),(((1024/zoomFactor)))/15,(((700/zoomFactor)))/15);
		
		orientBoxXmin = 600-((windowX/zoomFactor)/15);
		orientBoxYmin = 0-((windowY/zoomFactor)/15);
		orientBoxXmax = orientBoxXmin + (((1024/zoomFactor)))/15;
		orientBoxYmax = orientBoxYmin + (((700/zoomFactor)))/15;
		context_top.font = "10px sans-serif";
	for(i=0;i<findings.length;i++){
	 	if(selectedFinding ==i){
			context_top.fillStyle = '#FFFF00';
		}else{
			context_top.fillStyle = 'white';
		}
		context_top.fillText("F"+(findings[i].findingNum+1),600+((findings[i].xArr[0])/15),0+((findings[i].yArr[0])/15));
	}
	}else{
		orientBoxXmin = 10000;
		//orientBoxYmin = 1024;
	}
  	
	//if(findings.length>0){
	//	context_top.stroke();
	//	context_top.closePath();
	//}
		//}else{
			//context_top.strokeStyle = "red";
	///context_top.lineTo(100, 500);
	//context_top.lineTo(500, 10);
	//context_top.fill();
	
	
 

}
function MouseWheelHandler(e){
	if (e.preventDefault){
		e.preventDefault();
	}
	var evt=window.event || e; //equalize event object
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	zoomFactor = zoomFactor + 0.05* delta;
	
	//var x = e.layerX;
	//var y = e.layerY;
	
	//windowX = x-((zoomFactor*windowWidth)/2);
	//windowY = y-((zoomFactor*windowHeight)/2);
	console.log(windowX+","+windowY);
	if(zoomFactor>minZoom && zoomFactor < maxZoom){
		//This is a pain in the ass. Attempting to recenter on mouse 
		//still doesn't work right.
		windowX= windowX + 0.05*delta*windowX/zoomFactor;
		windowY= windowY + 0.05*delta*windowY/zoomFactor;
		//windowX = windowX -delta*0.2*(1024);// +zoomFactor*(e.layerX - 512));
		//windowY=windowY -delta*0.2*(700);//  +zoomFactor*(e.layerY - 350));
	}
	//windowX = windowX - 0.1*((e.layerX - 512));
	//windowY = windowY - 0.1*((e.layerY-350)); 
	//zoomFactor = zoomFactor + 0.05* delta;
	drawScreen();
}
function MouseUpHandler(e){
	if(isROIdrawing){
		//newROI.addPoint(e.layerX,e.layerY);
		//drawScreen();
	}
	//else{
		isDragging = false;	
	//}
	return true;
}
function MouseDownHandler(e){
	if(isInOrientationBox(e.layerX,e.layerY)){
		//needs refactoring
		windowX = (1024-(zoomFactor*windowWidth)) + (((windowWidth/15-(e.layerX-600)))*zoomFactor*15) - 512;
		windowY = (700-(zoomFactor*windowHeight)) + ((windowHeight/15- e.layerY)*zoomFactor*15) -350;
	}else if(isROIdrawing){
		//console.log("1");
		if(!findings[selectedFinding].isClosed){
			findings[selectedFinding].addPoint(e.layerX,e.layerY);
			//console.log("2");
			if(findings[selectedFinding].isClosed){
				isROIdrawing = false;
			}	
		}else{
			isROIdrawing = false;
		}
	}else{
		var ret = isFindingClicked(e.layerX,e.layerY);
		//If finding was clicked center on that location.
		if(ret >=0){
			selectedFinding = ret;
			findingDropdownChangeHandler();
		}
	}
    isDragging = true;
    dragCoordStart = [e.screenX,e.screenY];
    drawScreen();
	return true;
}
function MouseMoveHandler(e){
	if(isROIdrawing){
		return;
	}
	//else{
	if(isDragging){
		//isDragging = false;	
		var x = e.screenX;
		var y = e.screenY;
		
		if(isInOrientationBox(e.layerX,e.layerY)){
			windowX = windowX - 15*(x -dragCoordStart[0])*zoomFactor;
			windowY = windowY - 15*(y -dragCoordStart[1])*zoomFactor;			
		}else{
			windowX = windowX + ((x -dragCoordStart[0])/zoomFactor);
			windowY = windowY + ((y -dragCoordStart[1])/zoomFactor);
		}
		drawScreen();
		dragCoordStart = [x,y];
		//isDragging = true;
	//}		
	}
	return true;
}
function isFindingClicked(x,y){
	
	var i;
	var xx = (x-windowX)/zoomFactor;
	var yy = (y-windowY)/zoomFactor;
	for(i=0;i<findings.length;i++){
		var xo = findings[i].xArr[0];   
		var yo = findings[i].yArr[0];
		//console.log("xo,yo= "+xo+","+yo);
		//console.log("xc,yc= "+x+","+y);
    	if(findings[i].isClosed && xx >xo && yy>yo && xx< xo+100 && yy< yo+100)
    	{
    	return i;
    	}
	}	
	return -1;
}
//returns true if mouse is in orientation box, otherwise false.
function isInOrientationBox(x,y){
	//if(x<orientBoxXmin){return false;}
	//if(y>orientBoxYmax){return false;}
	//if(x>orientBoxXmax){return false;}
	//if(y<orientBoxYmin){return false;}	
    return (x>600 && y<windowHeight/15 && zoomFactor>0.5);
}
function gotoPrevFinding(){
	if(findings.length>0){
		selectedFinding--;
		if(selectedFinding<0){selectedFinding=findings.length-1;}
		drawScreen();
		findingDropdownChangeHandler();
	}
}
function gotoNextFinding(){
	if(findings.length>0){
		selectedFinding++;
		if(selectedFinding>findings.length-1){selectedFinding = 0;}
		drawScreen();
		findingDropdownChangeHandler()
	}
}

function SaveROIbuttonHandler(e){
	return true;
}
function ClearROIbuttonHandler(e){
	//newROI.init();
	//drawScreen();
	return true;
}
function DefineROIbuttonHandler(){
	if(findings.length>0){
	isROIdrawing = true;}
}

function findingDropdownChangeHandler(){
	//var dropdown = document.getElementById("findingsDrop");
	var i;
  	//s = "nums: ";
  	var option;
  	//dropdown.options.length = 0;  	
  //console.log("data length = "+data.fnumbers.length);
  	//for(i=0;i<findings.length;i++){
  	//	option=document.createElement("option");
  	//	option.text=""+findings[i].findingNum;
  	//	dropdown.add(option);
	//	//s += data.fnumbers[i]+" ";
 	//}
  	//console.log(s);
	document.getElementById('finding_indicator').innerHTML = "Finding: "+ (selectedFinding+1) +"/" +findings.length;	
	
	if(findings.length==0){
		defineROIbutton.disabled = true;
	}else{
		defineROIbutton.disabled = false;
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
	
	  this.init=init;
	  this.addPoint=addPoint;
	  this.removeLastPoint=removeLastPoint;
	  this.getXarr=getXarr;
	  this.getYarr=getYarr;
	  this.getNpoints=getNpoints;

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
function addFinding()
  {
  var type = "";
  var xArr= "";
  var yArr= "";
  var npts = 0;
  var description = "";
    
  var params = {"type":type,"description":description,"npts":npts,"xArr":xArr,"yArr":yArr};		
  	
  Dajaxice.finding.addFinding(callback_addFindingForm, params);
  //Create new ROI for this finding - yet to be defined.
  //getFindings();
  }
function saveFinding(){
	//Update information in local finding
	
	//Need to figure out how to get user inputted text from this box:
	findings[selectedFinding].description =document.getElementById("description_box").value;
	console.log("description_box value= "+ document.getElementById("description_box").value);
	var mass =check1.checked;
	var calc =check2.checked;
	var other =check3.checked;
	
	if(calc){findings[selectedFinding].type = "calc"; console.log("calc saved");
	}else if(mass){findings[selectedFinding].type = "mass";
	}else if(other){findings[selectedFinding].type = "other";}
		
	sendFindingToServer(selectedFinding);
	
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
 newFind = new Finding();
 newFind.init(findings.length);	
 findings.push(newFind);
 console.log("findings length = "+findings.length);
 findings[findings.length-1].syncedWithServer = true;
 //var dropdown = document.getElementById("findingsDrop");
  console.log(data.message);
  selectedFinding = findings.length-1;
  console.log("selected finding = "+selectedFinding);

  findingDropdownChangeHandler();
}

function callback_updateFindingForm(data){
  var dropdown = document.getElementById("findingsDrop");
  console.log(data.message);
  findingDropdownChangeHandler();
}

function my_js_callback2(data){
  check1.checked=!check1.checked;
  var s = "";
  var i;
  for(i=0;i<data.fnumbers.length;i++){ s += data.fnumbers[i]+ "  "}

  console.log(s);
  
}
/*function mouseWheel() {
	var self=this;
	var wheelCallback = function(event,object,delta){
		zoomFactor = zoomFactor + 0.1*delta;
		drawScreen(context,img);
	}
	//Mouse wheel event handler
	self.wheelHandler = function (event){
		var delta = 0;
		if (!event) //For IE
			event = window.event;
		if (event.wheelDelta) 	//IE
		{
			delta = event.wheelDelta/120;
			//if (window.opera) delta = -delta; //for Opera...hmm I read somewhere opera 9 need the delta sign inverted...tried in opera 10 and it doesnt require this!?
		}
		else if (event.detail) //firefox
			delta = -event.detail/3;

		if (event.preventDefault)
			event.preventDefault();
		event.returnValue = false;
		if (delta)
			wheelCallback(event,this,delta);	//callback function
	}
	//Mouse wheel initialization
	self.init = function(object,callback) {
		if (object.addEventListener) //For firefox
			object.addEventListener('DOMMouseScroll', this.wheelHandler, false); //Mouse wheel initialization
		//For IE
		object.onmousewheel = this.wheelHandler; //Mouse wheel initialization
		wheelCallback=callback;
	}
	this.setCallback = function(callback){
		wheelCallback=callback;
	}
	
}*/