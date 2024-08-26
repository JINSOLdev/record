'use strict';

// dom
const recordButton = document.querySelector('.record-button');
const stopButton = document.querySelector('.stop-button');
const playButton = document.querySelector('.play-button');
const downloadButton = document.querySelector('.download-button');
const previewPlayer = document.querySelector('#preview');
const recordingPlayer = document.querySelector('#recording');

let recorder;
let recordedChunks = [];

// functions
function videoStart() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        previewPlayer.srcObject = stream;
        startRecord(previewPlayer.captureStream());
    });
}

function startRecord(stream) {
    recordedChunks = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        recordedChunks.push(e.data);
    };
    recorder.start();
}

function stopRecord() {
    // console.log(previewPlayer.srcObject);
    previewPlayer.srcObject.getTracks().forEach((track) => track.stop());
    recorder.stop();
    console.log(recordedChunks);
}

function playRecord() {
    const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    recordingPlayer.src = URL.createObjectURL(recordedBlob);
    recordingPlayer.play();
    downloadButton.href = recordingPlayer.src;
    downloadButton.download = `recording_${new Date()}.webm`;
    console.log(recordingPlayer.src);
}

// event
recordButton.addEventListener('click', videoStart);
stopButton.addEventListener('click', stopRecord);
playButton.addEventListener('click', playRecord);
