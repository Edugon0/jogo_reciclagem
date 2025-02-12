let isPlaying = false;
const audio = document.getElementById("background-music");
const soundButton = document.getElementById("sound-button");

function toggleSound() {
    if (isPlaying) {
        audio.pause();
        soundButton.textContent = "🔇";
    } else {
        audio.play();
        soundButton.textContent = "🔊";
    }
    isPlaying = !isPlaying;
}
