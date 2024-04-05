import { apiSpec, comAPI } from "./apicall.js";

// Event listener for the "Generate Schedule" button
document.getElementById('generateButton').addEventListener('click', async function() {
    var displayText = document.getElementById('displayText');
    displayText.textContent = "Generating a schedule...";

    try {
        // Make API call to generate schedule using the 'algorithm.generate' endpoint
        const generateResponse = await comAPI('algorithm', 'generate', 'POST');

        // Handle successful generate response
        if (generateResponse.ok) {
            displayText.textContent = "Schedule generated successfully!";
            // Start checking status periodically
            checkStatus();
        } else {
            // Handle error response for generating schedule
            const errorData = await generateResponse.json();
            displayText.textContent = "Error: " + errorData.message;
        }
    } catch (error) {
        // Handle network errors or other exceptions
        console.error("Error:", error);
        displayText.textContent = "Error: Failed to generate schedule.";
    }
});

// Function to check status periodically until "done" message is received
async function checkStatus() {
    try {
        const statusResponse = await comAPI('algorithm', 'status', 'GET');
        // Display the status response below the button
        displayStatusResponse(statusResponse);

        // If status is not "done", continue checking after a delay
        if (statusResponse.status !== "done") {
            setTimeout(checkStatus, 5000); // Check status again after 5 seconds (adjust as needed)
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle network errors or other exceptions
    }
}

// Function to display the status response below the button
function displayStatusResponse(response) {
    const statusBox = document.getElementById('statusBox');
    statusBox.textContent = "Status Response: " + JSON.stringify(response);
}