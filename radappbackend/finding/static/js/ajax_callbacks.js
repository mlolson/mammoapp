/*******************************************************************************
 * MAMMOAPP - Mammography web simulator:
 * 
 * AJAX callback functions.
 * 
 * Author: Matt Olson: mattlolson@gmail.com All rights reserved.
 * 
 ******************************************************************************/

function callback_checkFindingAnswers(data) {

	var returnedAFs = data.AnswerFindings;
	var returnedAI = data.AnswerImpression;
	APP.answerfindings.length = 0;
	for ( var i = 0; i < returnedAFs.length; i++) {
		var newAF = new AnswerFinding(APP.imageNum, APP.setNum,
				returnedAFs[i].findingNum, returnedAFs[i].isCCView,
				returnedAFs[i].isMLOView, returnedAFs[i].xLocCC,
				returnedAFs[i].yLocCC, returnedAFs[i].xLocMLO,
				returnedAFs[i].yLocMLO, returnedAFs[i].type,
				returnedAFs[i].description, -1, "", "", false);
		APP.answerfindings.push(newAF);
	}
	// Now we will want to do this check at the time the finding is created.
	// Keep this here in case we change our mind
	/*
	 * for(var i=0;i<APP.findings.length;i++){
	 * APP.findings[i].corAnswerNums.length = 0; for(var j=0;j<APP.answerfindings.length;j++){
	 * if(APP.findings[i].roiContainsAnswer(APP.answerfindings[j])){
	 * APP.findings[i].corAnswerNums.push(j); APP.answerfindings[j].corFinding =
	 * i; } } }
	 */

	APP.Answer_Impression.description = returnedAI[0].description;
	APP.Answer_Impression.finalPathology = returnedAI[0].finalPathology;
	APP.Answer_Impression.biradsNum = returnedAI[0].biradsNum;
	APP.Answer_Impression.indications = returnedAI[0].indications;
	APP.Answer_Impression.syncedWithServer = true;
	// drawScreen();
	// constructImpressionsForm();
}
function callback_setMaxImgNum(data) {
	APP.MaxImgNum = data.maxImageNum;
}
function message_callback(data) {
	console.log("Message: " + data.message);
}
