// Test file to make calls to API

var jsonResult;

document.getElementById('testButton').addEventListener('click', function() {
	console.log("Starting request");
	var displayText = document.getElementById('textBox');
	displayText.textContent = "Making Call";
	
	jsonResult = makeRequest(apiSpec.professors.index, 'GET');
    if (jsonResult) {console.log("Request successful" + jsonResult);}

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

let hostname = window.location.hostname;

// Replace 'BASE_URL' with the actual base URL of your API
const BASE_URL = 'http://' + hostname + ':3000';

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

// Sample JSON data
let jsonData = [
    {"name": "John Doe", "age": 25, "city": "New York"},
    {"name": "Jane Smith", "age": 30, "city": "Los Angeles"},
    {"name": "Bob Johnson", "age": 28, "city": "Chicago"}
];

if (jsonResult) {jsonData = jsonResult;}

// Function to generate HTML table from JSON
function generateTable(jsonData) {
    const table = document.createElement('table');

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    Object.keys(jsonData[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');

    jsonData.forEach(data => {
        const row = document.createElement('tr');

        Object.values(data).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    return table;
}

// Get the body element and append the generated table
const body = document.body;
const tableElement = generateTable(jsonData);
body.appendChild(tableElement);

