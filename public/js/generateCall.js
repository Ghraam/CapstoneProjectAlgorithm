import { apiSpec, comAPI } from "./apicall.js";

// Event listener for the "Generate Schedule" button
document.getElementById('generateButton').addEventListener('click', async function() {
    let displayText = document.getElementById('displayText');
    displayText.textContent = "Generating a schedule...";

    try {
        // Make API call to generate schedule using the 'algorithm.generate' endpoint
        const response = await comAPI('algorithm', 'generate', 'POST');

        // Handle successful response
        if (response.ok) {
            displayText.textContent = "Schedule generated successfully!";
            // You can perform further actions here, like updating the UI with the generated schedule
        } else {
            // Handle error response
            const errorData = await response.json();
            displayText.textContent = "Error: " + errorData.message;
        }
    } catch (error) {
        // Handle network errors or other exceptions
        console.error("Error:", error);
        displayText.textContent = "Error: Failed to generate schedule.";
    }
});