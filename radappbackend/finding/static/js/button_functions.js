/*******************************************************************************
 * MAMMOAPP - Mammography web simulator:
 * 
 * Button functions: these functions interface with the HTML button elements.
 * 
 * Author: Matt Olson: mattlolson@gmail.com All rights reserved.
 * 
 ******************************************************************************/
function but_closeAnswerFindingBox() {
	APP.closeAnswerFindingBox();
}
function but_submitAnswerFindingBox() {
	var ind = APP.selectedAnswerFinding;

	if (APP.answerfindings[ind].wasSubmitted) {
		return;
	}
	APP.answerfindings[ind].wasSubmitted = true;
	APP.numFoundAnswerFindings++;
	var selected = new Array();
	var checkboxArr = new Array();
	for(var i=0;i<APP.answerfindings[ind].choices.length;i++){
		var cb = document.getElementById("choices_cb"+i)
		checkboxArr.push(cb);
		if(cb.checked){
			selected.push(true);
		}else{
			selected.push(false);
		}
	}
	APP.answerCheckboxes = checkboxArr;
	APP.answerfindings[ind].userChoices = selected;
	/*APP.answerfindings[ind].userDescription = APP.description_box.value;
	if (APP.check1.checked) {
		APP.answerfindings[ind].userType = "mass";
	} else if (APP.check2.checked) {
		APP.answerfindings[ind].userType = "calc";
	} else if (APP.check3.checked) {
		APP.answerfindings[ind].userType = "other";
	}
	*/
	APP.drawScreen_top_only();
	APP.displayAnswerFindingBox(ind, false);
}
// Obsolete:
function but_gotoPrevFinding() {
	if (APP.findings.length > 0) {
		APP.selectedFinding--;
		if (APP.selectedFinding < 0) {
			APP.selectedFinding = APP.findings.length - 1;
		}
		APP.drawScreen();
		APP.showFindingDialogBox(false, 250, 60);
	}
}
// Obsolete:
function but_gotoNextFinding() {
	if (APP.findings.length > 0) {
		APP.selectedFinding++;
		if (APP.selectedFinding > APP.findings.length - 1) {
			APP.selectedFinding = 0;
		}
		APP.drawScreen();
		APP.showFindingDialogBox(false, 200, 50)
	}
}
// Obsolete:
function but_saveFinding() {
	APP.findings[APP.selectedFinding].description = APP.description_box.value;
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
// Obsolete:
function but_saveAndCloseFinding() {
	APP.saveFinding();
	APP.closeFindingForm();
}
// Obsolete but may need at some point:
function but_deleteFinding() {
	if (APP.findings.length == 0) {
		return;
	}
	APP.findings.splice(APP.selectedFinding, 1);
	for ( var i = 0; i < APP.findings.length; i++) {
		APP.findings[i].findingNum = i;
	}
	if (APP.selectedFinding >= APP.findings.length) {
		APP.selectedFinding = APP.findings.length - 1;
	}
	APP.drawScreen();
	APP.showFindingDialogBox();
}
function but_checkFindingAnswers() {

	//APP.User_Impression.description = document
	//		.getElementById("impressions_box").value;
	//APP.User_Impression.indications = document
	//		.getElementById("indications_box").value;
	//APP.User_Impression.finalPathology = document
	//		.getElementById("final_path_box").value;
	
	if(APP.numFoundAnswerFindings < APP.answerfindings.length){
		alert("There is "+ (APP.answerfindings.length - APP.numFoundAnswerFindings)+" finding that has not been identified and submitted.");
		return;
	}
	
	var radios = document.getElementsByName('radio1');
	for ( var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			APP.User_Impression.biradsNum = radios[i].value;
		}
	}
	if (APP.User_Impression.biradsNum == -1) {
		alert("Please indicate BIRADS number.");
		return;
	}
	var selected = new Array();
	//var checkboxArr = new Array();
	for(var i=0;i<APP.Answer_Impression.choices.length;i++){
		var cb = document.getElementById("imp_choices_cb"+i)
		//checkboxArr.push(cb);
		if(cb.checked){
			selected.push(true);
		}else{
			selected.push(false);
		}
	}
	//APP.answerCheckboxes = checkboxArr;
	APP.Answer_Impression.userChoices = selected;
		
	APP.DisplayAnswers = true;
	APP.caseSubmitted = true;
	APP.constructImpressionsForm();
	// Now done at initialize();
	// Dajaxice.finding.returnAllAnswerFindings(callback_checkFindingAnswers,{"setNum":setNum,"imageNum":imageNum});
}
function but_closeImpressionForm() {
	// Could probably move this to APP method.
	document.getElementById("impressionsForm").style.visibility = 'hidden';
}
function but_nextImage() {
	APP.imageNum++;
	document.getElementById("impressionsForm").style.visibility = 'hidden';
	if (APP.imageNum > APP.MaxImgNum) {
		window.location = "/mammo/score/" + APP.TotalNumOfCorrectFindings + "/"
				+ APP.TotalNumOfFindings + "/";
		return;
	}
	APP.imgC.src = window.STATIC_URL + "media/set" + APP.setNum + "/"
			+ (APP.imageNum) + "c.jpg";
	APP.imgM.src = window.STATIC_URL + "media/set" + APP.setNum + "/"
			+ (APP.imageNum) + "m.jpg";
}
function but_DefineROIbuttonHandler_polygon() {
	if(WS.isPolyRoiDrawing){//If button was already clicked, go through and delete any unclosed findings.
		for(var i=0;i<APP.findings.length;i++){
			if(!APP.findings[i].isClosed){
				APP.deleteFinding(i);
			}
		}
	}
	APP.addFinding();
	if (APP.findings.length > 0) {
		// isROIdrawing = true;
		WS.isPolyRoiDrawing = true;
		WS.isRectRoiDrawing = false;
		WS.isSpotMagTool = false;
	}
}
function but_DefineROIbuttonHandler_rectangle() {
	APP.addFinding();
	if (APP.findings.length > 0) {
		// isROIdrawing = true;
		WS.isPolyRoiDrawing = false;
		WS.isRectRoiDrawing = true;
		WS.isSpotMagTool = false;
	}
}
function but_SpotMagTool() {
	WS.isROIdrawing = false;
	WS.isPolyRoiDrawing = false;
	WS.isRectRoiDrawing = false;
	WS.isSpotMagTool = true;
}
function but_constructImpressionsForm() {
	APP.constructImpressionsForm();
}
function but_zoomOut() {
	WS.zoomFactor = WS.zoomFactor - 0.4;

	if (WS.zoomFactor > WS.minZoom && WS.zoomFactor < WS.maxZoom) {
		WS.windowX = WS.windowX + (WS.windowWidth / 2) * 0.4;
		WS.windowY = WS.windowY + (WS.windowHeight / 2) * 0.4;
	}
	APP.drawScreen();
}
function but_zoomIn() {
	WS.zoomFactor = WS.zoomFactor + 0.4;

	if (WS.zoomFactor > WS.minZoom && WS.zoomFactor < WS.maxZoom) {
		WS.windowX = WS.windowX - ((WS.windowWidth / 2) * 0.4);
		WS.windowY = WS.windowY - ((WS.windowHeight / 2) * 0.4);
	}
	APP.drawScreen();
}
