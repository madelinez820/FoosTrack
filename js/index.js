// hard-coded values for now
var yellowScore = 9;
var blackScore = 5;
var currentVideoPath = "videos/sampleVideo.mp4";



var pointInPlay  = false;
var pointButton = document.getElementById("pointButton");
var currentVideo = document.getElementById("currentVideo");


function startPointToggle(){ 
	pointInPlay  = ! pointInPlay;
	if (pointInPlay) { // TODO: insert the call that triggers video to livestream
		pointButton.innerHTML = "Click when point is finished!";
		pointButton.classList.remove('btn-warning');
		pointButton.classList.add('btn-danger');

		playLiveStreamVideo();

	} else{ //TODO: insert the call that triggers video to replay last 5 seconds of point
		pointButton.innerHTML = "Click to start point!";
		pointButton.classList.add('btn-warning');
		pointButton.classList.remove('btn-danger');

		playReplayVideo();
	}
	console.log(pointInPlay);

	function playLiveStreamVideo(){ // TODO: insert the call that triggers video to livestream
		currentVideo.src = currentVideoPath;
		currentVideo.play();
	}

	function playReplayVideo(){//TODO: insert the call that triggers video to replay last 5 seconds of point
		currentVideo.src = currentVideoPath;
		currentVideo.play();

	}
}