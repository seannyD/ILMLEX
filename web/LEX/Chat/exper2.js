var sliderExperiment = false;  // if true, runs sound slider experiment.  If false, runs typed label experiment.  This is not fully implemented
// the variables dictionaryExperiment and learnOnlyExperiment are set in index.php


// var click_to_continue_text = "Continue";
// var wait_for_partner_text = "Waiting for partner ...";
// var end_of_experiment_text = "This is the end of the experiment!";
// var signal_too_short_text = "Signal is too short! Try again!";
// var experiment_intro_text = "Press to start experiment";


var click_to_continue_text = "Continue";
var wait_for_partner_text = "Waiting for partner ...";
var end_of_experiment_text = "You have finished the test!";
var signal_too_short_text = "Dat was iets te kort. Probeer nog eens!";
var experiment_intro_text = "Click here to begin";
var training_text = "Pay attention!";
var break_text = "Take a rest!";

if(learnOnlyExperiment){
	wait_for_partner_text = "";
}

var testing_prompt = "Please type a word that will help the other player pick the correct picture from the set of six randomly picked options, then hit enter.";
var testing_prompt_learnOnly = "Please type the word that you think is associated with the picture, then hit enter";
var dictionary_instruction_text = "<b>Notebook</b> <br />Click to edit";
var notebook_prompt = "Add the word to your notebook?";

var prompt_speaker = "Please type a word that will help the other player pick the correct shape from the set of six randomly generated options.";

var recieveSpeakersWord_text = "The other player has typed the word <br /><br /><br /><br />Click the shape that you think they are referring to";

var correctImage = "images/tick.png"
var incorrectImage = "images/cross.png"

var cont_visible_after_choice = true;

// page to send participant to after the experiment has finished
var debrief_URL = "http://correlation-machine.com/LEX/Debrief_Page.html";

var minimumRecordLength = 2;
var maxStringLength = 50;

var roleSpeaker = [name,toUser].sort()[0]==name;
console.log("RoleSpeaker");
console.log(roleSpeaker);
var currentTarget = 0; // index of ims
var currentSentWord = "";
var currentTrainingStimName = "";
var stimArray = [];  // array of numbers indexing ims
//var ims = ["images/SpikyRed.png","images/SpikyGreen.png","images/SpikyBlue.png","images/SpikyRedThick.png","images/SpikyGreenThick.png","images/SpikyBlueThick.png","images/RoundRed.png","images/RoundGreen.png","images/RoundBlue.png","images/RoundRedThick.png","images/RoundGreenThick.png","images/RoundBlueThick.png"];
var ims = ["images/iconic/B01_mier_A.png","images/iconic/B02_mier_B.png","images/iconic/B03_spin_A.png","images/iconic/B04_spin_B.png","images/iconic/B05_tor_A.png","images/iconic/B06_tor_B.png","images/iconic/B07_krokodil_A.png","images/iconic/B08_krokodil_B.png","images/iconic/B09_slang_A.png","images/iconic/B10_slang_B.png","images/iconic/B11_walvis_A.png","images/iconic/B12_walvis_B.png"];
var stimLabels = ['a','b','c','d','e','f','g','h','i','j','k','l'];

var practice_ims = ["images/Test1.jpg","images/Test2.jpg","images/Test3.jpeg","images/Test4.jpg"];
var practiceLabels = ["broc","pep","ber","ap","","","","","","","","","","","",""];
var lastRoundWasPractice = true;  // set to false at the first real stimulus test

var currentDictionary = [];
var tmpDictText = "";

var lastUsedStimLabels = Array();  // this is a copy of stimLabels which is updated with each test round to reflect the last signal used for a given meaning.

var listenersResponse = 0;
var speakersWord = "";
var started = false;
var writtenPartDetails = false;

var rounds;  // training, stimulus, partBreak, message
var TRAINING = 0;
var STIMULUS = 1;
var PARTBREAK = 2;
var MESSAGE = 3;
var ROLESWITCH = 4;
var PRACTICEIND = 5;

var numberOfTestRounds = 0;

var currentlyTraining = false;

var numberCompletedTraining = 0;

var numReadyToStart = 0;

var partBreakTime = 0;
var waitText = "";
var myTimerVar;

var maxTimerTime = 100
var timerTime = maxTimerTime;
var timerTimeInterval = 0;
var firstListenerEndPlayback = true;

var dictionaryOrderIsRandom = true;
var dictOrder = getStartingDictOrder();

//var experiment_filename = "";
//var language_filename  = "";

document.getElementById("ScorePanel").innerHTML = "Score: 0";


var score = 0;

// SW
var sentWhistle = "";


//loadData();

if(roleSpeaker){

	document.getElementById("SynchButton").innerHTML = " Press to Synchronise<br />"+experiment_filename;
	document.getElementById("SynchButton").onclick = function (){synchExper();};
}
else{
	document.getElementById("SynchButton").innerHTML = "Waiting for Part 1 to synchronise";

}

var currentRound = 0;

// optinally start from a round greater than 0
//var currentRoundTmp = prompt("Start from round ...","0");
//currentRound = parseInt(currentRoundTmp);

// for some reason, if we hide the slideWhistle immediately, it doesn't work
// so, call after a delay
if(sliderExperiment){
setTimeout(function(){document.getElementById("SlideWhistle").style.display = 'none';},1000);
}

document.getElementById("sendButtonDiv").style.display = 'none';
document.getElementById("retryButton").style.display = 'none';
document.getElementById("PlayPartnerSignal").style.display = 'none';
document.getElementById("typedInput").style.display = 'none';
document.getElementById("dictionaryPanel").style.display = 'none';
document.getElementById("AddToNotebook").style.display = 'none';

document.getElementById("StartButton").innerHTML =  experiment_intro_text;

var animateSendButtonCount = 0;

var loadedExperFromSpeaker = false;  // used for keeping track of whether we'e shared the experiment details

var bufferPadding = Array();

for(var i=0;i<10;++i){
	bufferPadding.push(0);
}

function startExperiment(){
	if(!started){

		started = true;
		waitingForListenerClick = false;
		instructionPhase = false;
		document.getElementById("StartButton").style.display = 'none';
		document.getElementById("SlideWhistle").style.display = 'none';
		if(sliderExperiment){
			stopSlideWhistle(); // Instructions will have started slide whistle
		}
		document.getElementById("cont").style.display = 'none';
		if(!learnOnlyExperiment ){
			// score panel not visibel in learn only condition
			document.getElementById("ScorePanel").style.display = 'inline';
		}
		else{
			document.getElementById("ScorePanel").style.display = 'none';
		}
		document.getElementById("instructions").style.display = 'none';
		document.getElementById("NextInst").style.display = 'none';
		document.getElementById("PrevInst").style.display = 'none';

		document.getElementById("dictionaryPanel").style.display = 'none';
		if(dictionaryExperiment){
			document.getElementById("dictionaryPanel").style.display = 'inline';
			document.getElementById("instructions").style.display = 'inline';
			document.getElementById("instructions").innerHTML = dictionary_instruction_text;
		}

		if(!writtenPartDetails){
			writeParticipantDetails();
			writtenPartDetails = true;
		}



		setBackground("");
		clearScreen();
		document.getElementById("InfoPanel").innerHTML = wait_for_partner_text;
		setBackground("images/backgrounds/SW_Listener1.png");
		chat.send("READYTOSTART", name, toUser);	// picked up by readyToStart();

		// TODO set infotext to "waiting"

		// link button for playing partner's signal
//		document.getElementById("PlayPartnerSignal").addEventListener("touchend",playPartnerSignal());
//		document.getElementById("PlayPartnerSignal").addEventListener("onclick",playPartnerSignal());

	}
}


function setStim(stimWindow,im){
// im is number that indexes ims

// TODO
// iPhone browser displays 'empty image' box when there's no image, so change inner HTML or display property

	if(im=="none"){
		document.getElementById(stimWindow).src = "";
		document.getElementById(stimWindow).style.display = 'none';
	}
	else{
			document.getElementById(stimWindow).style.display = 'inLine';
		if(im<0){
			// show practice image
			document.getElementById(stimWindow).src = practice_ims[-im-1];
		}
		else{
			document.getElementById(stimWindow).src = ims[im];
		}
		// show stim after a pause for loading
		//window.setTimeout(function(){document.getElementById(stimWindow).style.display = 'inLine';},100);
	}
}

function setBackground (bg) {
	// TODO - set backgrounds off properly
	//document.getElementById("backgroundImage").src = bg;

}

// function shuffle(a, b)
// {
//    return Math.random() > 0.5 ? -1 : 1;
// }

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}


function trainingRound(im,stimName){
	console.log("Training Round");

	currentlyTraining = true;

	currentTrainingStimName = stimName;


	//setBackground("images/backgrounds/Training.jpg");
	// SW
	setBackground("images/backgrounds/SW_Training.png");

	// will need to change to accept number
	currentTarget = im;

	document.getElementById("typedInput").style.display = 'none';
	document.getElementById("ScorePanel").style.display = 'none';
	document.getElementById("SlideWhistle").style.display = 'none';
	document.getElementById("cont").style.display = 'none';

	document.getElementById("InfoPanel").style.display = 'inline';
	document.getElementById("InfoPanel").innerHTML = training_text;

	if(!sliderExperiment){
		document.getElementById("middleStim").style.display = 'inline';
	}
	document.getElementById("leftStim").style.display = 'inline';

	// display stimulus
	setStim("leftStimImage",currentTarget);
	// display label

	if(sliderExperiment){
		window.setTimeout(function(){
		// load meaing
		startSlideWhistle();
		recordBuffer = stringToRecordBuffer(currentTrainingStimName);
		startPlayback();
		},1000);
		// after playback has ended, exper_EndPlayback(); is called -> training_PlaybackEnds();
	}
 	else{
 		window.setTimeout(function(){
 			training_showWord();
 		},1000);
 	}


	if(! sliderExperiment){
		// clear image and message
		window.setTimeout(function(){
			setStim("leftStimImage","none");
			document.getElementById("middleStim").innerHTML = "";
			},6000);

		// next round
		window.setTimeout(function(){nextRound();},9000);
	}
}

function training_showWord(){
	if(currentTarget<0){
	// practice words
		var practiceWord = practiceLabels[-currentTarget-1];
		document.getElementById("middleStim").innerHTML = practiceWord ;
	}
	else{
		document.getElementById("middleStim").innerHTML = currentTrainingStimName;
	}
}

function training_PlaybackEnds(){
	console.log("training_PlaybackEnds")
	// called after playback has finished
		setTimeout(function(){
			if(sliderExperiment){
				stopSlideWhistle();
				}
			setStim("leftStimImage","none");
		},1000);

		checkMoveNextRound();
		chat.send("NEXTROUND", name, toUser);

}


function checkMoveNextRound(){
	numberCompletedTraining += 1;
	if(numberCompletedTraining >=2){
		setTimeout("nextRound();",3000); // want this on different thread
	}
}

function endExperiment(){
		//document.getElementById("StartButton").style.display = 'inLine';
		//document.getElementById("StartButton").innerHTML = end_of_experiment_text;



		// write language used
		// only one participant needs to do this
		if(name=="Part1"){
			writeLanguageFile(ims,lastUsedStimLabels);
		}

		experimentOver= true; // set in index.php

		// send to debrief page with chain, generation and score
		setTimeout("window.location.href = debrief_URL + '?score=' + score.toString() + '&chain='+chain_num.toString() + '&generation='+experiment_filename + '&player='+name;",2000);
}

function nextRound(){
	console.log("NextRound");

	if(rounds==undefined){
		// a bit dodgy - if we have no rounds, wait a bit, then try loading again.
		// note that if the call to process.php fails, loadData_exper() gets called again
		// in failLoadData.  Maybe take the call out of here?
		alert("No Rounds loaded: "+experiment_filename);
//		loadData_exper();
//		setInterval("nextRound()",2000);
	}
	else{
		console.log(rounds[currentRound]);
		clearScreen();
		dehighlighAllImages();
		if(sliderExperiment){
			stopSlideWhistle();
		}
		currentlyTraining = false;
		numberCompletedTraining = 0;

		if(currentRound == rounds.length){
			// end of experiment
			endExperiment();
		}
		else{
			// load the dictionary for the first real trial
			if(dictionaryExperiment){
				if(rounds[currentRound][PRACTICEIND]=="1" || (lastRoundWasPractice && rounds[currentRound][PARTBREAK]>0)){
					practiceDictLoad();
				}
				else{
					// first time we load the real dictionary
					if(lastRoundWasPractice){
						score = 0; // reset score
						numberOfTestRounds = 0; // reset number of test rounds
						dictLoad();
						lastRoundWasPractice = false;
					}
				}

			}


			if(rounds[currentRound][PARTBREAK] > 0){
				// do break
				//doBreak(rounds[currentRound][PARTBREAK],rounds[currentRound][MESSAGE]);
				// SW adjustment:
				if(rounds[currentRound][MESSAGE]=="<br />Prepare for the real experiment!"){
					score = 0;
					document.getElementById("ScorePanel").innerHTML = "Score: "+score +"/"+numberOfTestRounds.toString();
				}
				doBreak(rounds[currentRound][PARTBREAK],rounds[currentRound][MESSAGE]);


			}
			else{
				if(rounds[currentRound][TRAINING]=="1"){
				// TRAINING
				if(dictionaryExperiment){
					// no training in dictionary experiment
					window.setTimeout(function(){nextRound();},50);
					}
				else{
					trainingRound(rounds[currentRound][STIMULUS],stimLabels[rounds[currentRound][STIMULUS]]);
				}
				}
				else{
				// testing
					// switch role
					if(rounds[currentRound][ROLESWITCH]=="1"){
						roleSpeaker = ! roleSpeaker;
					}
					testingRound(rounds[currentRound][STIMULUS]);
				}
			}
			currentRound += 1;
		}
	}
}


function testingRound(target){

	numberOfTestRounds += 1;
	if(!learnOnlyExperiment ){
		document.getElementById("ScorePanel").style.display = 'inline';
	}
	console.log("TestingRound");

	if(learnOnlyExperiment){
		// in a learning only experiment, each participant is always the speaker
		roleSpeaker = true;
	}


	if(roleSpeaker){
		testingSpeaker1(target);
	}
	else{
		waitingForMessage = true;
		//setBackground("images/backgrounds/ListenerPresent.png");
		// SW
		setBackground("images/backgrounds/SW_Listener1.png");
		document.getElementById("typedInput").style.display = 'none';
		document.getElementById("SlideWhistle").style.display = 'none'; //make invisible
		document.getElementById("sendButtonDiv").style.display = 'none';
		document.getElementById("retryButton").style.display = 'none';
		document.getElementById("PlayPartnerSignal").style.display = 'none';
		document.getElementById("cont").style.display = 'none';
		wait();
	}

}

function wait(){
// TODO display waiting text

	document.getElementById("InfoPanel").innerHTML = wait_for_partner_text;
}


function testingSpeaker1(target){

	if(sliderExperiment){
		setBackground("images/backgrounds/SW_SpeakerSpeakB.png");

		// SW
		document.getElementById("SlideWhistle").style.display = 'inline'; //make visible

		startSlideWhistle();
		setTimeout('document.getElementById("sendButtonDiv").style.display = "inline"',2000);
		document.getElementById("retryButton").style.display = 'inline';
		document.getElementById("PlayPartnerSignal").style.display = 'none';
	}
	if(sliderExperiment){
		document.getElementById("cont").style.display = 'none';
	}
	else{
		if(!learnOnlyExperiment){
			// context is not visible in learn only experiment
			document.getElementById("cont").style.display = 'inline';
		}
	}
	document.getElementById("typedInput").style.display = 'inline';
	document.getElementById("sendie").focus();

	// set prompts
	if(learnOnlyExperiment){
		document.getElementById("InfoPanel").innerHTML = testing_prompt_learnOnly;
		}
	else{
		document.getElementById("InfoPanel").innerHTML = testing_prompt;
	}

	currentTarget = target;

	// set array

	var imsIndex = [];
	for(var i=0; i < ims.length; ++i){
		imsIndex.push(i);
	}

//	imsIndex = imsIndex.sort(shuffle);
	shuffle(imsIndex);
	stimArray = imsIndex.slice(0,6);

	if(!containsObject(currentTarget,stimArray)){
		stimArray = stimArray.slice(0,5);
		stimArray.push(target);
	}
	//stimArray= stimArray.sort(shuffle);
	shuffle(stimArray);


	if(currentTarget<0){
		// practice round
		stimArray = [-1,-2,"none",-3,-4,"none"];
	}



	if(cont_visible_after_choice){
		// show speaker the context
		showContext();
	}
	// TODO hide unwanted elements
	// TODO make elements visible

	waitingForInput = true;
	setStim("leftStimTestImage",target);

	// SW

	// start recording
	// this means that there's no practicing!
	if(sliderExperiment){
		startRecord();
		startTimer();
	}

}

function recieveMessage(m){
	console.log("recieveMessage");
	console.log(m);

	document.getElementById("InfoPanel").innerHTML = "";

		if(roleSpeaker){
			// feedback from listener
			listenersResponse = parseInt(m);

			// save data
			 saveData();

			dofeedback(listenersResponse);



		}
		else{
		// listener receives message from speaker

			//setBackground("images/backgrounds/ListenerChoose.png");
			if(sliderExperiment){
				setBackground("images/backgrounds/SW_Listener2.png");
				document.getElementById("playPartnerSignalButton").src = "images/backgrounds/PlayButton.png";
			}
			waitingForMessage = false;
			var sentWord = m.substring(0,m.indexOf("*"));
			currentSentWord = m.substring(0,m.indexOf("*"));
			speakersWord = currentSentWord;
			currentTarget = parseInt(m.substring(m.indexOf("*")+1,m.indexOf("#")));
			var sentStims = m.substring(m.indexOf("#")+1).split("_");
			console.log(sentWord);
			console.log(sentStims);
			console.log(currentTarget);

			// get stim array from speaker's message
			stimArray = [];
			for(var i=0; i < sentStims.length;++i){
				stimArray.push(parseInt(sentStims[i]));
			}

			if(currentTarget<0){
				// practice round
				stimArray = [-1,-2,"none",-3,-4,"none"];
			}

			console.log(stimArray);

			// show target word
			showSpeakerWord(sentWord);

			console.log("Recieve - 1");

			if(sliderExperiment){
				// SW
				// show play button
				document.getElementById("PlayPartnerSignal").style.display = 'inline';
				console.log("Recieve - 2");
				// set the record buffer in soundSlider.js
				//recordBuffer = stringToRecordBuffer(sentWord);
				// for playback, put padding of silence around recording
				recordBuffer = bufferPadding.concat(stringToRecordBuffer(sentWord),bufferPadding);
			}

			// update last used stim
			// map to actual target
			updateLastUsedStimLabels(currentTarget,sentWord);

			// show the context
			showContext();

			firstListenerEndPlayback = true;

			waitingForListenerClick = true;

		}

}

function recieveExperDetails(mss){
	recieveData(mss,"exper");
}

function showContext(){
			// make array
			for(var i=0;i< stimArray.length;++i){
				setStim("cont"+(i+1),stimArray[i]);
				}
			// wait for a bit so that images load
			if(!learnOnlyExperiment){
				setTimeout(function(){document.getElementById("cont").style.display = 'inline';},500);
			}
}

function updateLastUsedStimLabels(targetX,wordX){
	lastUsedStimLabels[targetX] = wordX;
}

function readyToStart(){
	console.log("READY TO START");
	numReadyToStart += 1;
	console.log(numReadyToStart);

	if(numReadyToStart ==2 || learnOnlyExperiment){
		// TODO set infotext to emtpy

		numReadyToStart = 0;
		nextRound();
	}
}

function clearScreen(){
		for(var i=0;i< 6;++i){
			setStim("cont"+(i+1),"none");
			}
		setStim("rightStimTestImage","none");
		setStim("leftStimTestImage","none");
		document.getElementById("middleStimTest").innerHTML = "";
		document.getElementById("InfoPanel").innerHTML = "";
		document.getElementById("feedbackPanel").style.display = 'none';
		if(sliderExperiment){
			stopTimer();
		}
		document.getElementById("AddToNotebook").style.display = 'none';
}


function dofeedback(m){


	if(learnOnlyExperiment){
		// no feedback in the learn only condition
		window.setTimeout('chat.send("READYTOSTART", name, toUser);',50);
	}
	else{
		console.log("doFeedback");

		document.getElementById("PlayPartnerSignal").style.display = 'none';
		if(sliderExperiment){
			stopTimer();
		}



			// highlight correct options
// 			if(roleSpeaker){
// 				var imx = stimArray.indexOf(listenersResponse) +1
// 				highlightImage("cont"+imx.toString());
// 			}
// 			else{
// 				var imx = stimArray.indexOf(currentTarget) +1
// 				highlightImage("cont"+imx.toString());
// 			}


			hideMe("leftStimTest");

			if(roleSpeaker){


	//			setStim("rightStimTestImage",listenersResponse);
//				setStim("leftStimTestImage",currentTarget);

				setStim("feedbackYouChoseImage",currentTarget);
				setStim("feedbackTheyChoseImage",listenersResponse);

				document.getElementById("feedbackYouChoseText").innerHTML = "Your target:"
				document.getElementById("feedbackTheyChoseText").innerHTML = "Your partner chose:"

			}
			else{
				//setStim("rightStimTestImage",currentTarget);
//				setStim("leftStimTestImage",listenersResponse);

				setStim("feedbackYouChoseImage",listenersResponse);
				setStim("feedbackTheyChoseImage",currentTarget);

				document.getElementById("feedbackYouChoseText").innerHTML = "You chose:"
				document.getElementById("feedbackTheyChoseText").innerHTML = "Your partner's target:"


			}





		if(listenersResponse == currentTarget){
			// good feedback
			document.getElementById("feedbackPanelImage").src = correctImage;
			score += 1;
		}
		else{
			//bad feedback
			document.getElementById("feedbackPanelImage").src = incorrectImage;

		}

		document.getElementById("feedbackPanel").style.display = 'inline';

		document.getElementById("ScorePanel").innerHTML = "Score: "+score +"/"+numberOfTestRounds.toString();

		// the guesser gets feedback immediately locally, while the speaker
		// must wait for the guesser's message.  This can cause problems when the
		// guesser becomes the speaker if they send their signal very quickly
		// therefore, delay guesser by a bit more than the speaker.
	// 	if(roleSpeaker){
	// 		window.setTimeout(function(){nextRound();},3000);
	// 	}
	// 	else{
	// 		window.setTimeout(function(){nextRound();},5000);
	// 	}

		// instead of calling nextRound(), we just use the 'readyToStart' funcitonality
		// both participants have to check in before moving on.
		if(!dictionaryExperiment || currentTarget<0){
			window.setTimeout('chat.send("READYTOSTART", name, toUser);',3000);
		}
		else{
		// show notebook div, which contains buttons that will trigger addToNotebook, which does the line above
			showAddToNotebook();

		}
	}

}

function showAddToNotebook(){
	// make sure addtonotebook is on top

	document.getElementById("InfoPanel").innerHTML = notebook_prompt;
	document.getElementById("AddToNotebook").style.zIndex="2";
	document.getElementById("sendie").style.zIndex="1";
	// show addtonotebook
	document.getElementById("AddToNotebook").style.display = 'inline';
}

function addToNotebook(addTo){
	// launched when add to notebook buttons are pressed
	document.getElementById("AddToNotebook").style.display = 'none';
	// put sendie back on top
	document.getElementById("AddToNotebook").style.zIndex="1";
	document.getElementById("sendie").style.zIndex="2";
	if(addTo){
		currentDictionary[currentTarget] = currentSentWord;
		updateDictionary();
	}
	window.setTimeout('chat.send("READYTOSTART", name, toUser);',50);
	document.getElementById("InfoPanel").innerHTML = wait_for_partner_text;

}


function showSpeakerWord(sentWord){
	if(!sliderExperiment){
		document.getElementById("middleStimTest").innerHTML = sentWord;
		document.getElementById("middleStimTest").style.display = 'inline';
		document.getElementById("InfoPanel").innerHTML = recieveSpeakersWord_text;

	}

	}

function doBreak(t,m){
	started = true;
	partBreakTimer = t;
	waitText = "";

	document.getElementById("StartButton").style.display = 'inLine';
	document.getElementById("StartButton").innerHTML = waitText + "<br /> "+ partBreakTimer ;

	document.getElementById("InfoPanel").style.display = 'inLine';
	document.getElementById("InfoPanel").innerHTML = break_text + m;

	myTimerVar=setInterval(function(){myTimer()},1000);

}

function myTimer(){
	partBreakTimer -= 1;
	if(partBreakTimer < 0){
		clearInterval(myTimerVar);
		document.getElementById("StartButton").innerHTML = click_to_continue_text;
		started = false;

	}
	else{
		document.getElementById("StartButton").innerHTML = waitText + "<br /> "+ partBreakTimer ;
	}
}

function sendSpeakerMessage(text){
	console.log("sendSpeakerMessage");
	console.log(stimArray);
	console.log(text);

	speakersWord = text;
	currentSentWord = text;


//	document.getElementById("typedInput").style.display = 'none';
	// SW
	document.getElementById("SlideWhistle").style.display = 'none';
	if(sliderExperiment){
		stopSlideWhistle();
	}
	document.getElementById("sendButtonDiv").style.display = 'none';
	document.getElementById("retryButton").style.display = 'none';
	document.getElementById("PlayPartnerSignal").style.display = 'none';


//	setBackground("images/backgrounds/speakerSpeak.png");
	// SW
	setBackground("images/backgrounds/SW_SpeakerWait.png");
//	document.getElementById("middleStimTest").innerHTML = speakersWord;


	// update last used stim
	// map to actual target
	// also done on listener's side
	updateLastUsedStimLabels(currentTarget,text);

	if(learnOnlyExperiment){
		// if it's only a learning experiment,
		// then skip straight to receiving message
		setTimeout("recieveMessage("+currentTarget.toString()+");",1000)
	}
	else{
		document.getElementById("InfoPanel").innerHTML = wait_for_partner_text;
		// send message
		text = text + "*" + currentTarget+ "#" + stimArray.join("_");
		chat.send(text, name, toUser);
		if(sliderExperiment){
			stopTimer();
		}
		waitingForMessage = true;
	}
}

function listenerClick(x){
	// incoming directly from index.php definitions
	console.log("Listener click");
	console.log(x);

	x = parseInt(x);

	if(instructionPhase){
		exampleChoice = x;
		sceneCounter += 1;
		changeScene();
	}
	else{
		if(waitingForListenerClick){

				// send choice to speaker
				chat.send(stimArray[x],name,toUser);
				waitingForListenerClick = false;
				// remove all images
				if(!cont_visible_after_choice){
					removeImages();
				}

			listenersResponse = stimArray[x];
			setStim("leftStimTestImage",stimArray[x]);
			dofeedback(listenersResponse);
			saveData();

		}
	}
}

function removeImages(){
	// yyy
	for(var i=0;i< 6;++i){
		//if(i != x){
			setStim("cont"+(i+1),"none");
		//}
	}
}



function loadData(){
	loadData_lang();
	loadData_exper();
}

function loadData_lang(){
	getExperiment(language_filename,"lang");
}

function loadData_exper(){
	// In order for the experiment files to be synched, only Speaker needs to request a random experiment file
	// getRandExperimentFile() requests that a random experiment file be generated and sent back
	// speaker must load experiment file when they recieve a message "LOADEXPER"
	if(roleSpeaker){
		var firstGenEx = "0";
		if(firstGeneration){
			firstGenEx = "1";
		}

		getRandExperimentFile(firstGenEx,experiment_filename+".exper");
	}

	else{
	// listener loads the file written by the speaker
	// The file might not be written yet, but the speaker will let the listener know
	// if they need to re-load it
		getExperiment(experiment_filename+".exper","exper");
	}

	removeSynchButton();

}


function recieveData(contents,filetype){

	console.log("DATA");
	console.log(contents);

	if(filetype=='exper'){
	// experiment file

	var lines = contents.split("\n");
	var rownames = lines[0].split("\t");

	var trainingInd = rownames.indexOf("Training");
	var stimulusInd = rownames.indexOf("Stimulus");
	var partBreakInd = rownames.indexOf("PartBreak");
	var messageInd = rownames.indexOf("Message");
	var roleSwitch = rownames.indexOf("RoleSwitch");
	var pracInd = rownames.indexOf("Practice");


	rounds = [];
	for(var i=1; i < lines.length -1;++i){  // start from row 1
		var ix = lines[i].split("\t");
		if(ix.length>1){
			console.log([ix[trainingInd],parseInt(ix[stimulusInd]),parseInt(ix[partBreakInd]), ix[messageInd]]);
			rounds.push([ix[trainingInd],parseInt(ix[stimulusInd]),parseInt(ix[partBreakInd]), ix[messageInd],ix[roleSwitch], ix[pracInd]]);
		}
	}

	removeSynchButton();

	// If the speaker has recieved the file, then the experiment file is written and the listener
	// can load it.  So send a message to the listener to load the file.
	if(roleSpeaker){
		chat.send("LOADEXPER"+experiment_filename, name, toUser);
	}


	}

	else{
	// lanuage file

		loadLanguage(contents);
		//dictLoad();
		practiceDictLoad();
	}

}

function loadLanguage(contents){
		var ims_tmp = []
		stimLabels = [];
		var lines = contents.split("\n");
		for(var i = 0; i < lines.length; ++ i){
			console.log([lines[i],lines[i].split("\t")[0]]);
			var labx = lines[i].split("\t")[0];
			if(labx.length>0){
				stimLabels.push(labx);
				// read stimulus images from language file
				ims_tmp.push(lines[i].split("\t")[1]);
			}
		}
		if(ims_tmp.length == stimLabels.length){
			ims = ims_tmp
		}

		// copy to last Used Stim Labels
		lastUsedStimLabels = Array();
		for(var i=0;i<stimLabels.length;++i){
			lastUsedStimLabels.push(stimLabels[i]);
		}
}




function sendTextSignal(e){
	if(e.keyCode == 13){
		var str = document.getElementById("sendie").value;
		if(validateDict(str)){

			// disable text entry
			document.getElementById("StartButton").focus();
			document.getElementById("typedInput").style.display = 'none';
			document.getElementById("sendie").value = "";

			sendSpeakerMessage(str);
		}
		else{
			// TODO warning
			alert("Text must have at least one character!\nLowercase letters only, no Spaces, no English!");
		}
	}
}

function animateSendButton(){

	if(animateSendButtonCount==0){
		document.getElementById("sendButton").src = "images/backgrounds/SendButtonDark.png";
	}
	else{
		document.getElementById("sendButton").src = "images/backgrounds/SendButton.png";
		animateSendButtonCount == 0;
	}

	animateSendButtonCount += 1;
}



function failLoadData(filename,filetype){
	// on failing to load data
	if(roleSpeaker)	{
	   	alert("Cannot load Ex file "+filename);
	}
	else{
		console.log("failed to load data as listener, waiting");
		// listener may just be waiting for speaker to generate the file
		// wait for a bit, then try again.
		// if we fail again, we'll just come back here.
		// setTimeout("loadData_exper()",3000);
	}
}

function synchExper(){
	loadData();
	document.getElementById("SynchButton").style.top = "0%";
	document.getElementById("SynchButton").style.left = "0%";
	removeSynchButton();
}

function removeSynchButton(){
	document.getElementById("SynchButton").style.top = "0%";
	document.getElementById("SynchButton").style.left = "0%";
	document.getElementById("SynchButton").style.width = "0%";
	document.getElementById("SynchButton").style.height = "0%";
	document.getElementById("SynchButton").style.display = 'none';
	document.getElementById("SynchButton").style.zIndex = '-1';
}

function startTimer(){
	if(started){
		document.getElementById("timerCanvasDiv").style.display = "inline";
		timerTime = maxTimerTime;
		timerTimeInterval = setInterval("minusTimer()",30);
		}
}

function stopTimer(){
	clearInterval(timerTimeInterval);
	document.getElementById("timerCanvasDiv").style.display = "none";
}

function drawTimer(endangle){

//	endangle = endangle * (2 * Math.PI);
	endangle = (3.5 - (2*endangle)) ;

	var canvas = document.getElementById("timerCanvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var radius = cx - 6;

	context.fillStyle = '#ff0000';
	context.lineWidth=4;
	context.beginPath();
	context.arc(cx,cy,radius, 0, Math.PI*2, true);
	context.closePath();
	context.fill();


	context.fillStyle = '#00973e';
	context.moveTo(cx,cy);
	context.arc(cx,cy,radius,1.5*Math.PI,endangle* Math.PI,false);
	context.lineTo(cx,cy);
//	context.stroke(); // or context.fill()
	context.strokeStyle = 'black';
	context.stroke();
	context.fill();
	}

	function flashTimer(x){
	var canvas = document.getElementById("timerCanvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var radius = cx - 6;

   	x = Math.abs(x % 100);

	context.fillStyle = 'hsl(0,100%,' + x+'%)';

	context.lineWidth=4;
	context.beginPath();
	context.arc(cx,cy,radius, 0, Math.PI*2, true);
	context.closePath();
	context.fill();
	}

	function minusTimer(){
//		console.log(timerTime/maxTimerTime );
		if(timerTime<0){
			timerTime -= 1;
			flashTimer(timerTime);
		}
		else{
			timerTime -= 0.1;
			drawTimer(timerTime/maxTimerTime );
			}
	}

// Dictionary functions

function dictLoad(){

	if(dictionaryOrderIsRandom){
		dictOrder = getRandomDictOrder();
	}

	currentDictionary = [];

	// set images for dict
	for(var i=0; i< ims.length; ++i){
		var x = i+1;
		var dictRef = dictOrder[i]
		document.getElementById("d"+x.toString()+"Image").src = ims[dictRef];
	}
	// update dictionary list
	for(var i=0; i< stimLabels.length; ++i){
		currentDictionary.push(stimLabels[i]);
	}
	// update dictionary display
	updateDictionary();
}

function practiceDictLoad(){
		currentDictionary = practiceLabels;
		updateDictionary();
		for(var i=0; i< practice_ims.length; ++i){
			var x = i+1;
			document.getElementById("d"+x.toString()+"Image").src =practice_ims[i];
		}
}

function updateDictionary(){
	//console.log(document.getElementById("dictionaryPanel").innerHTML);
	for(var i=0; i< currentDictionary.length; ++i){
		var x = i+1;
		var dictRef = dictOrder[i]
		document.getElementById("d"+x.toString()+"text").value = currentDictionary[dictRef];
	}
}

function dictionaryTextClick(x){
	//document.getElementById("d"+x.toString()+"text").disabled = false;
	document.getElementById("d"+x.toString()+"text").focus();
	tmpDictText = document.getElementById("d"+x.toString()+"text").value;
}

function dictionaryTextKey(e){
	if(e.keyCode == 13){
		dictionaryTextKey2(e);
	}
}

function dictionaryTextKey2(e){
	var n = e.target.id;
	var tx = document.getElementById(n).value;
	var meaning_num = parseInt(n.substring(1))-1;
	if(dictionaryOrderIsRandom){
		// meaning_num matches visual dictionary position
		// not meaning list index
		meaning_num = dictOrder[meaning_num];
	}

	//document.getElementById(n).disabled = true;
	document.getElementById("sendie").focus();
	if(!validateDict(tx)){
			// TODO warning
			alert("Text must have at least one character!\nLowercase letters only, no Spaces, no English!");
			document.getElementById(n).value = tmpDictText;
			//document.getElementById(n).disabled= false;
			//setTimeout(function(){document.getElementById(n).focus();},500);
	}
	else{
		currentDictionary[meaning_num] = tx;
	}

}

function validateDict(str){
  return /^[a-z]*$/.test(str) && str.length > 0 && str.length <= maxStringLength;
}


function highlightImage(c){
	document.getElementById(c).style.border="thick solid #FF0000";
}

function dehighlightImage(c){
	document.getElementById(c).style.border = "none";
}

function dehighlighAllImages(){
	for(var i=0;i< 6;++i){
			dehighlightImage("cont"+(i+1));
	}
}

// RANDOMISE DICTIONARY

// function randomiseDictionaryOrder(){
// 	var order = new Array();
// 	for(var i=0;i<stimLabels.length;++i){
// 		order.push(i);
// 	}
// 	shuffle(order)
// 	var dictDiv = makeDictDiv(order);
// 	console.log(dictDiv);
// 	document.getElementById("dictionaryPanel").innerHTML = dictDiv;
// }

function getStartingDictOrder(){
	var dx = new Array();
	for(i=0; i <16; ++ i){
		dx.push(i);
	}
	return dx;
}

function getRandomDictOrder(){
// 	var dx = new Array();
// 	for(i=0; i <stimLabels.length; ++ i){
// 		dx.push(i);
// 	}
// 	shuffle(dx);
// 	return dx;
 	var orderX = new Array();
	// set shape order
	shapeOrder = new Array();
	for(i=0;i<4; ++i){
		shapeOrder.push(i)
	}
	shuffle(shapeOrder);
	// set pattern order
	patternOrder = new Array();
	for(i=0;i<4; ++i){
		patternOrder.push(i)
	}
	shuffle(patternOrder);

	for(var s=0;s<shapeOrder.length;++s){
		for(var p=0;p<patternOrder.length;++p){
			orderX.push(patternOrder[p] + (shapeOrder[s]*4))
		}
	}
	console.log("ORDER "+orderX);
	return orderX;
}

// function makeDictDiv(order){
// 	divString = '<div id="leftDictCol">';
// 	for(var i=0;i<(order.length/2); ++i){
// 		divString = divString +"\n" + makeEntryDiv(order[i]);
// 	}
// 	divString = divString + '</div><div id="rightDictCol">';
// 	for(var i=order.length/2;i<order.length; ++i){
// 		divString = divString +"\n" + makeEntryDiv(order[i]);
// 	}
// 	divString = divString + '</div>';
// 	return divString;
// }
//
// function makeEntryDiv(n){
// 	return '<div id="d' + n +
// 	'"><img id="d'+ n +
// 	'Image" src=""><input type="text" id="d'+ n +
// 	'text" onclick="dictionaryTextClick('+ n +
// 	')" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)"></div>';
// }
