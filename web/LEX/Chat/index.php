<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>Chat</title>

    <link rel="stylesheet" href="style3.css" type="text/css" />

    <script type="text/javascript">
	    var experimentOver = false;
    	// save back button disaster
		window.onbeforeunload = function() {
			if(!experimentOver){
				alert("Oops! Click 'OK' then 'Stay on Page'");
				return "Oops! Click 'OK' then 'Stay on Page'";
			}
		};
	</script>

    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="chat2.js"></script>

    <script type="text/javascript" src="handleExperimentStart.js"></script>

</head>

<body onload="setInterval('chat.update()', 2000)">

	<div id="background"><img id="backgroundImage"></div>

    <div id="leftStim"><img id="leftStimImage"></div>
    <div id="leftStimTest"><img id="leftStimTestImage"></div>

    <div id="rightStim"></div>
    <div id="middleStim"> </div>
    <div id="middleStimTest"> </div>

    <div id="rightStimTest"><img id="rightStimTestImage"></div>

    <div id="cont">
    <table width="100%" height="95%" border="0" cellspacing="0" cellpadding="1px">
  <tr>
    <td><img id="cont1" onClick="listenerClick(0)"></td>
    <td><img id="cont2" onClick="listenerClick(1)"></td>
    <td><img id="cont3" onClick="listenerClick(2)"></td>
  </tr>
  <tr>
    <td><img id="cont4" onClick="listenerClick(3)"></td>
    <td><img id="cont5" onClick="listenerClick(4)"></td>
    <td><img id="cont6" onClick="listenerClick(5)"></td>
  </tr>
</table>

    </div>

    <div id="typedInputSurround"></div>
    <p id="typedInput"><input type="text" id="sendie" maxlength = '100' width = '100%' onkeypress="sendTextSignal(event)"></p>

	<div id="feedbackPanel">
		<div id="feedbackPanelInner">
			<div id="feedbackYouChose">
				<div id="feedbackYouChoseText"></div>
				<img id="feedbackYouChoseImage">
				</div>
			<img id="feedbackPanelImage">
			<div id="feedbackTheyChose">
				<div id="feedbackTheyChoseText"></div>
				<img id="feedbackTheyChoseImage">
				</div>
		</div>
	</div>

	<div id="ScorePanel"></div>

	<div id="InfoPanel"></div>


	<div id="StartButton" onClick="startExperiment()"></div>

	<div id="SlideWhistle"></div>

	<div id="sendButtonDiv">
		<img id="sendButton" src="" onclick="sendSliderSignal()">
	</div>

	<div id="retryButton">
		<img id="retryButtonImage" src="" onClick="retrySignal()">
	</div>

	<div id="PlayPartnerSignal">
		<img id="playPartnerSignalButton" src="" onclick="playPartnerSignal();">
	</div>

	<div id="dictionaryPanel">
		<div id="leftDictCol">
			<div id="d1">
				<img id="d1Image" src="">
				<input type="text" id="d1text" onclick="dictionaryTextClick(1)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d2">
				<img id="d2Image" src="">
				<input type="text" id="d2text" onclick="dictionaryTextClick(2)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d3">
				<img id="d3Image" src="">
				<input type="text" id="d3text" onclick="dictionaryTextClick(3)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d4">
				<img id="d4Image" src="">
				<input type="text" id="d4text" onclick="dictionaryTextClick(4)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d5">
				<img id="d5Image" src="">
				<input type="text" id="d5text" onclick="dictionaryTextClick(5)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d6">
				<img id="d6Image" src="">
				<input type="text" id="d6text" onclick="dictionaryTextClick(6)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d7">
				<img id="d7Image" src="">
				<input type="text" id="d7text" onclick="dictionaryTextClick(7)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d8">
				<img id="d8Image" src="">
				<input type="text" id="d8text" onclick="dictionaryTextClick(8)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
		</div>
		<div id="rightDictCol">
			<div id="d9">
				<img id="d9Image" src="">
				<input type="text" id="d9text" onclick="dictionaryTextClick(9)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d10">
				<img id="d10Image" src="">
				<input type="text" id="d10text" onclick="dictionaryTextClick(10)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d11">
				<img id="d11Image" src="">
				<input type="text" id="d11text" onclick="dictionaryTextClick(11)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d12">
				<img id="d12Image" src="">
				<input type="text" id="d12text" onclick="dictionaryTextClick(12)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d13">
				<img id="d13Image" src="">
				<input type="text" id="d13text" onclick="dictionaryTextClick(13)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d14">
				<img id="d14Image" src="">
				<input type="text" id="d14text" onclick="dictionaryTextClick(14)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d15">
				<img id="d15Image" src="">
				<input type="text" id="d15text" onclick="dictionaryTextClick(15)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
			<div id="d16">
				<img id="d16Image" src="">
				<input type="text" id="d16text" onclick="dictionaryTextClick(16)" onkeypress="dictionaryTextKey(event)" onblur="dictionaryTextKey2(event)">
			</div>
		</div>
	</div>

	<div id="instructions" style="text-align: center;"></div>

	<div id="instructionsTitle" style="text-align: center; font-size: 30;"><b>Instructies</b></div>

	<div id="AddToNotebook">
		<div id="AddToNotebookTitle"></div>
		<button id="AddToNotebookYes" type="button" onclick="addToNotebook(true)">Yes</button>
 		<button id="AddToNotebookNo" type="button" onclick="addToNotebook(false)">No</button>
    <button id="AddToNotebookContinue" type="button" onclick="addToNotebook(false)">Continue</button>
	</div>

	<div id="NextInst" onclick="nextScene()">
		<p style="display: absolute; text-align: center;  vertical-align: middle;  line-height: normal; font-size: 26; ">Volgende</p>
	</div>
	<div id="PrevInst" onclick="previousScene()">
		<p style="display: absolute;  text-align: center; vertical-align: middle;  line-height: normal; font-size: 26; ">Vorige</p>
	</div>

	<div id="DataForm" style="position: absolute; top: 100px; left: 50px; height: 500px; width: 500px; font-size: 30px;">

			<br />Leeftijd <br />
			<select id='data_age' size="5" style="position: relative; font-size:20px; width:100%;">
				<option>Minder dan 6</option>
				<option>6-9</option>
				<option>10-13</option>
				<option>14-18</option>
				<option selected>19-40</option>
				<option>40+</option>
			</select>

	</div>

	<div id="SynchButton">Synchronise exper</div>

	<div id="timerCanvasDiv">
	<canvas id="timerCanvas" width="125" height="125"></canvas>
	</div>

	<div id="AcceptAndProceedDiv">
		<input type="button" id="AgreeButton" onclick="agreeClick()" value="Klik hier om te beginnen">
	<div>
</body>

<script type="text/javascript" src="writeData.js"></script>
<script type="text/javascript" src="exper2.js"></script>
<script type="text/javascript" src="instructions.js"></script>

</html>
