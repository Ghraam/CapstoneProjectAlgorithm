// Test file to make calls to API


document.getElementById('testButton').addEventListener('click', function() {
	console.log("Starting request");
	var displayText = document.getElementById('textBox');
	displayText.textContent = "Making Call";
	
	makeRequest(apiSpec.professors.index, 'GET')
		.then(result => console.log("Sections - Get all: ", result));

});

// API Specification
const apiSpec = {
    "professors": {
        "index": {
            "url": "/professors.json",
            "method": "GET",
            "description": "Get all professors"
        },
        // ... (other assignment methods)
    },
    // ... (other endpoints)
};

// Replace 'BASE_URL' with the actual base URL of your API
const BASE_URL = 'http://bendrone.com:3000';

// Function to make a generic API request
async function makeRequest(endpoint, method, data = null) {
    const url = `${BASE_URL}${endpoint.url}`;
    const headers = {
        'Content-Type': 'application/json',
        // Add any additional headers as needed
    };

    const config = {
        method: method,
        headers: headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, config);

    if (!response.ok) {
        // Handle non-successful responses (e.g., display an error message)
        console.error(`Request failed with status ${response.status}`);
        return null;
    }

    try {
        const result = await response.json();
        return result;
    } catch (error) {
        // Handle JSON parsing errors
        console.error('Error parsing JSON:', error);
        return null;
    }
}

