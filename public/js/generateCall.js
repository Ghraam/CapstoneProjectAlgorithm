import { apiSpec, comAPI } from "./apicall.js";

// Event listener for the "Generate Schedule" button
document.getElementById('generateButton').addEventListener('click', async function() {
    var displayText = document.getElementById('displayText');
    displayText.textContent = "Generating a schedule...";

    try {
        // Make API call to generate schedule using the 'algorithm.generate' endpoint
        const generateResponse = await comAPI('algorithm', 'generate', 'POST');
        console.log('Generate Response:', generateResponse);

        // Check if the generateResponse is null (indicating success)
        if (generateResponse === null) {
            // Start checking status periodically
            checkStatus();
            displayText.textContent = "Schedule generation initiated. Please wait for status update.";
        } else {
            // Handle case when generateResponse is not null (unexpected)
            displayText.textContent = "Error: Unexpected response received from server.";
        }
    } catch (error) {
        // Handle network errors or other exceptions during generate call
        console.error("Error:", error);
        displayText.textContent = "Error: Failed to generate schedule.";
    }
});

// Function to check status periodically until "done" message is received
async function checkStatus() {
    try {
        const statusResponse = await comAPI('algorithm', 'status', 'GET');

        let status = statusResponse.status;

        console.log('Status Response:', status);

        switch (status) {
            case "in_progress":
                status = "In Progress";
                break;
            case "error":
                status = "Error";
                break;
            case "done":
                status = "Done";
                break;
            default:
        }

        // Display the status response below the button
        displayStatusResponse(status);

        // If status is not "done", continue checking after a delay
        if (status !== "Done" && status !== "Error") {
            setTimeout(checkStatus, 5000); // Check status again after 5 seconds (adjust as needed)
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle network errors or other exceptions during status call
    }
}

// Function to display the status response below the button
function displayStatusResponse(response) {
    const statusBox = document.getElementById('statusBox');
    statusBox.textContent = "Status: " + response; //JSON.stringify(response);
}