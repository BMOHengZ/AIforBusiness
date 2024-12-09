let model, webcam, labelContainer, maxPredictions;
const URL = "./models/";  // Path to the models folder

// Load the model and metadata
async function loadModel() {
    try {
        const modelURL = URL + "model.json";        // Ensure the path is correct
        const metadataURL = URL + "metadata.json";  // Ensure the path is correct

        console.log("Loading model...");
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded successfully!");
    } catch (error) {
        console.error("Error loading model:", error);
    }
}

// Start webcam capture
async function startWebcam() {
    webcam = new tmImage.Webcam(400, 400, true); // Set the webcam size to match the desired container
    await webcam.setup(); // Request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    const webcamOutput = document.getElementById('webcam-output');
    webcamOutput.innerHTML = ""; // Clear any previous content
    webcamOutput.appendChild(webcam.canvas);

    labelContainer = document.getElementById('label-container');
    labelContainer.innerHTML = ""; // Clear previous labels
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement('div'));
    }

    document.getElementById('webcam-container').style.display = 'block';
}

// Webcam prediction loop
async function loop() {
    webcam.update(); // Update the webcam frame
    await predictWebcam();
    window.requestAnimationFrame(loop);
}

// Make predictions with the webcam
async function predictWebcam() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// Switch to webcam mode
document.getElementById('webcamBtn').addEventListener('click', function() {
    startWebcam();
});

// Load the model when the page loads
window.onload = () => {
    loadModel();
};


