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
		var newAF = new AnswerFinding(APP.imageNum, APP.setNum);
		
		newAF.findingNum = returnedAFs[i].findingNum; 
		newAF.isCC = returnedAFs[i].isCCView;
		newAF.isMLO = returnedAFs[i].isMLOView;
		newAF.xCC = returnedAFs[i].xLocCC;
		newAF.yCC = returnedAFs[i].yLocCC; 
		newAF.xMLO = returnedAFs[i].xLocMLO;
		newAF.yMLO = returnedAFs[i].yLocMLO;
		newAF.type = returnedAFs[i].type;
		newAF.description = returnedAFs[i].description; 
		newAF.corFinding = -1; 
		newAF.userType = "";
		newAF.userDescription = "";
		newAF.wasSubmitted = false;
		var choices = returnedAFs[i].choices;
		var ch_clean = new Array();
		//var an_clean = new Array();
		for(var j=0; j<choices.length;j++){
			ch_clean.push(choices[j]);
			//an_clean.push(choices[j+1]);
		}
		newAF.choices = ch_clean;
		//newAF.choicesAnswers = an_clean;
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
	APP.drawScreen();
	// constructImpressionsForm();
}
function callback_setMaxImgNum(data) {
	APP.MaxImgNum = data.maxImageNum;
}
function message_callback(data) {
	console.log("Message: " + data.message);
}
