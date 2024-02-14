

document.getElementById('quit').addEventListener('click', function quit(){
	alert('Why so scared?');
	let test = confirm('Sure you wanna be a quitter?');
	if(test){
		alert('well quitter, here is the exit...');
		alert('or is it?');
		alert('muhahahahahhaaaa');
		window.location.href = './pages/game.html';
	} else{
		alert('I knew you were a winner, now press Play!');
	}
})

const audio = document.getElementById("audio");
document.getElementById('music').addEventListener('click', function audioStart(){
	audio.play();
})



