var pointInPlay  = false;
var pointButton = document.getElementById("pointButton");
function startPointToggle(){ // TODO: insert the call that triggers video to livestream
	pointInPlay  = ! pointInPlay;
	if (pointInPlay) { // TODO: insert the call that triggers video to livestream
		pointButton.innerHTML = "Click when point is finished!";
		pointButton.classList.remove('btn-warning');
		pointButton.classList.add('btn-danger');

	} else{ //TODO: insert the call that triggers video to replay last 5 seconds of point
		pointButton.innerHTML = "Click to start point!";
		pointButton.classList.add('btn-warning');
		pointButton.classList.remove('btn-danger');
	}
	console.log(pointInPlay);
}