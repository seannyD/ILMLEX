//  FUNCTIONS FOR SLIDE WHISTLE

function playPartnerSignal(){
	// play back the partner's signal
	console.log("PlayPartnerSignal2");
	console.log(waitingForListenerClick);
	document.getElementById("playPartnerSignalButton").src = "images/backgrounds/PlayButton_occupied.png";

	// check if suitable to do so
	if(waitingForListenerClick){
		console.log("playBack starting");
		console.log(playingBack);
		console.log(recordBuffer.length);
		// from soundSlider.js
		//playSavedRecording(sentWhistle);
		if(!playingBack){		// check that we're not already playing something
 			startSlideWhistle();
			startPlayback();
			}
	}
}

function retrySignal(){
	// give the participant a second attempt at doing the signal.
	// hide retry button, so only 1 attempt
	if(!instructionPhase){
		document.getElementById("retryButton").style.display = 'none';
		recordBuffer = Array();
	}
}


function exper_EndPlayback(){
	console.log("exper_EndPlayback ");
	console.log(currentlyTraining);
	if(currentlyTraining){
		training_PlaybackEnds();
	}
	else{
		// change play button image
		// needs a delay because buffer is still running out
		setTimeout(function(){
			document.getElementById("playPartnerSignalButton").src = "images/backgrounds/PlayButton.png";
			stopSlideWhistle();
			},500);

		if(firstListenerEndPlayback){
			firstListenerEndPlayback = false;
			if(sliderExperiment){
				startTimer();
			}
		}

	}
}

function sendSliderSignal(){
	if(waitingForInput & !instructionPhase){
		stopRecord();

		// is recording long enough?
		if(recordBuffer.length > minimumRecordLength){
			// call to communicaiton program
			var messageString = recordBufferToString();
			sendSpeakerMessage(messageString);
		}
		else{
			document.getElementById("InfoPanel").innerHTML = signal_too_short_text;
			// reset record buffer
			recordBuffer = Array();
			startRecord();
		}

	}
}
