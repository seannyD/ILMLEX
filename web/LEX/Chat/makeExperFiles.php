<?php

// make experiment files

$bottleneck = 16; // size of bottleneck
// experiment structure for first generation
//$cycles_firstGen = array("Test","Test");
// experiment structure for later generations generation
//$cycles_laterGen = array("PracticeTrain","Break","PracticeTest","Break","Train","Break","Test","Test");

//$cycles_LearnOnly= array("PracticeTrain","Break10","PracticeTest","Train","Break60","Train","Break60","Train","Break60","Train","BreakF","Test");
//$cycles_ExpressOnly= array("PracticeTest","Test");
//$cycles_LearnAndExpress= array("PracticeTrain","Break10","PracticeTest","Train","Break60","Train","Break60","Train","Break60","Train","BreakF","Test");


// Test - each part is speaker for each meaning once
// Train - see each meaning once
// FinalTest - see each meaning once, ask what is the name (non-interactive)

$cycles_LearnOnly= array(                                                     "Train","Break10","Train","Break10","Train","Break10","Train","BreakF","FinalTest");
$cycles_ExpressOnly= array(                              "PracticeTest",                                          "Test" ,"Break10","Test" ,"BreakF","FinalTest");
$cycles_LearnAndExpress= array("PracticeTrain","Break10","PracticeTest",      "Train","Break10","Train","Break10",                  "Test" ,"BreakF","FinalTest");


$prepareForTestMessage = "__STARTTEST__"; // assigned in exper2.js
$prepareForRealExperimentMessage = "__STARTREALEXPER__";

// total number of stimuli
$numStimuli = 16;

// number of rounds per cycle
$numTrainingRoundsPerCycle = $bottleneck;
$numTestRoundsPerCycle = $numStimuli;

$partBreakLength = 10;


function repeat_array2 ($arr,$desiredLength){
	$newArray = array();
	$i = 0;
	while(count($newArray)<$desiredLength){
		array_push($newArray,$arr[$i]);
		$i += 1;
		if($i == count($arr)){
			$i = 0;
		}
	}
	return $newArray;
}

function array_zip_merge() {
  $output = array();
  // The loop incrementer takes each array out of the loop as it gets emptied by array_shift().
  for ($args = func_get_args(); count($args); $args = array_filter($args)) {
    // &$arg allows array_shift() to change the original.
    foreach ($args as &$arg) {
      $output[] = array_shift($arg);
    }
  }
  return $output;
}

$log = array(); // for output

 // is it a first generation? Get from POST
 // '1' = yes, other = no
$firstGen = $_POST["firstGen"];
if($firstGen==null){
	$firstGen = "0";
}

$filename = $_POST["filename"];


// experiment structure
$cycles = $cycles_laterGen;
// experiment structure for first generation
if($firstGen=="1"){
	$cycles = $cycles_firstGen;
}

$experType = $_POST["experType"];

if($experType=="LearnOnly"){
	$cycles = $cycles_LearnOnly;
}
if($experType=="ExpressOnly"){
	$cycles = $cycles_ExpressOnly;
}
if($experType=="LearnAndExpress"){
	$cycles = $cycles_LearnAndExpress;
}


$stimList = range(0,$numStimuli-1);

$roundNum = 0;
$training="";
$stim="";
$partBreak = "0";
$message = "";
$RoleSwitch = "1";
$practice = "0";

// Select random bottleneck
$rStims = range(0,$numStimuli-1);
shuffle($rStims);
$bottleneck_stims = array_slice($rStims,0,$bottleneck);

$header = "Round	Stimulus	Training	PartBreak	Message	RoleSwitch	Practice";
$retX =$header."\n";

foreach($cycles as $cy){



	if($cy=="Train"){
	// training round

		$training="1";
		$trAr = repeat_array2($bottleneck_stims,$numTrainingRoundsPerCycle);
		shuffle($trAr);
		foreach($trAr as $tr){
			$stim = $tr;
			$thisLine = array($roundNum,$stim,$training,$partBreak,$message,$RoleSwitch,$practice);
			$retX = $retX.implode("\t",$thisLine);
			$retX = $retX."\n";
			$roundNum += 1;
		}

	}	elseif($cy=="Test"){
		// test round
			$training="0";
			//$trAr = repeat_array2($stimList,$numTestRoundsPerCycle);
			//shuffle($trAr);

			// the order of stimuli should be random, with each particpant being the speaker for each stimuli
			// To do this, make X lists with random order of each stimulus, then interleave them.
			$trAr1 = range(0,$numStimuli-1);
			$trAr2 = range(0,$numStimuli-1);
			$trAr3 = range(0,$numStimuli-1);
			$trAr4 = range(0,$numStimuli-1);
			shuffle($trAr1);
			shuffle($trAr2);
			shuffle($trAr3);
			shuffle($trAr4);
			//$trAr = array_merge(array_zip_merge($trAr1,$trAr2),array_zip_merge($trAr3,$trAr4));

			// new method: only do once through each stim for each participant
			$trAr = array_zip_merge($trAr1,$trAr2);

			foreach($trAr as $tr){
				$stim = $tr;
				$thisLine = array($roundNum,$stim,$training,$partBreak,$message,$RoleSwitch,$practice);
				$retX = $retX.implode("\t",$thisLine);
				$retX = $retX."\n";
				$roundNum += 1;
			}

		}	elseif($cy=="FinalTest"){
			// test round
				$training="2";
				//$trAr = repeat_array2($stimList,$numTestRoundsPerCycle);
				//shuffle($trAr);

				// the order of stimuli should be random, with each particpant beign the speaker for each stimuli
				// To do this, make X lists with random order of each stimulus, then interleave them.
				$trAr = range(0,$numStimuli-1);
				shuffle($trAr);

				foreach($trAr as $tr){
					$stim = $tr;
					$thisLine = array($roundNum,$stim,$training,$partBreak,$message,$RoleSwitch,$practice);
					$retX = $retX.implode("\t",$thisLine);
					$retX = $retX."\n";
					$roundNum += 1;
				}

			} elseif($cy=="PracticeTrain"){
				// add practice rounds
				foreach(range(-1,-4) as $pr){
					$training="1";
					$stim = $pr;
					$thisLine = array($roundNum,$stim,$training,$partBreak,$message,$RoleSwitch,"1");
					$retX = $retX.implode("\t",$thisLine);
					$retX = $retX."\n";
					$roundNum += 1;
				}

		}	elseif($cy=="PracticeTest"){
					foreach(range(-1,-4) as $pr){
						$training="0";
						$stim = $pr;
						$thisLine = array($roundNum,$stim,$training,$partBreak,$message,$RoleSwitch,"1");
						$retX = $retX.implode("\t",$thisLine);
						$retX = $retX."\n";
						$roundNum += 1;
					}
					// add break before real round
					$thisLine = array($roundNum,"0","1","10",$prepareForRealExperimentMessage,$RoleSwitch,"1");
					$retX = $retX.implode("\t",$thisLine);
					$retX = $retX."\n";
		}	else{
						// break - message set in exper.js
						$breakLength = $partBreakLength;
						$breakMessage = " ";
						if($cy=="Break10"){
							$breakLength = 10;
						}
						if($cy=="BreakF"){
							$breakMessage = $prepareForTestMessage;
						}
						$retX = $retX.$roundNum."\t0\t0\t".$breakLength."\t".$breakMessage."\t0\t0\n";
		}
	}

$writeToFolder = '../../../private/LEX/experiments/';
fwrite(fopen($writeToFolder . $filename,'w'),$retX);

$log["contents"] = $retX;
echo json_encode($log);



?>
