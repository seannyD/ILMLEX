function saveData(){
	if(name=="Part1"){
		sendStringToServer();
	}
}

function sendStringToServer(){
	// save data after every round
	console.log("Save data");

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	var hh = today.getHours().toString();
	var minmin = today.getMinutes().toString();
	var ss = today.getSeconds().toString();
	if(hh.length==1){
		hh = "0"+hh;
	}
	if(minmin.length==1){
		minmin = "0"+minmin;
	}
	if(ss.length==1){
		ss = "0"+ss;
	}
	var timeX =  mm+'_'+dd+'_'+yyyy+'_'+hh+minmin+ss;

	// make dictionary string
	var dStr = "";
	for(var i=0; i<currentDictionary.length; ++i){
		dStr += currentDictionary[i]+"_";
	}

	var resString = [
		currentTarget,
		stimArray.join("_"),
		listenersResponse,
		speakersWord,
		timeX,
		experimentName,
		experiment_filename,
		language_filename,
		name,				// speaker name
		dStr, // dictionary
		currentExperimentType,
		getDateString()
		].join("\t");
	console.log(experimentName);
	console.log(resString);
	sendResults(experimentName,resString);

	if(roleSpeaker){
		writeLanguageFile(ims,lastUsedStimLabels);
	}

}

function writeLanguageFile(imageFiles,signals){

		console.log("Sending language file");
		var ret = "";
		for(var i=0; i< imageFiles.length; ++i){
			ret += signals[i] + "\t" + imageFiles[i] + "\n";
		}

		sendResults(experiment_filename+".lang",ret);


}

function getDateString(){
	var d = new Date();
	return(d.toISOString());
}


function writeParticipantDetails(){
		// write sex, age of participants to file
		// TODO

		var sex = "NA";//document.getElementById("data_sex").value;
// 			Sex<br />
// 			<select id='data_sex' size="2" style="font-size:20px; width:100%">
// 				<option selected>Female</option>
// 				<option>Male</option>
// 			</select>
		var age = document.getElementById("data_age").value;

		sendPartData(experiment_filename + "\t" + name +  "\t" + sex + "\t" + age);

}
