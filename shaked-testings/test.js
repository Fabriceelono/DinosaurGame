var mario = document.getElementById("mario");


function Jump() {
    mario.classList.remove("walk");
    mario.classList.add("jump");
}

document.onkeydown = function (eventKeyName) {
    eventKeyName = eventKeyName || window.event;
    console.log(eventKeyName.key)
    if (eventKeyName.key == " ") // space pressed
    {
        Jump();
        setTimeout(function () {
            mario.classList.remove("jump");
            mario.classList.add("walk");

        }, 500);
    }

};

