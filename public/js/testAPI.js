// Test file to make calls to API

let jsonResult;

document.getElementById('testButton').addEventListener('click', function() {
	console.log("Starting request");
	var displayText = document.getElementById('textBox');
	displayText.textContent = "Making Call";
	
	jsonResult = makeRequest(apiSpec.professors.index, 'GET')
        //.then(result => console.log("Request successful: ", result));

    // Get the body element and append the generated table
    const body = document.body;
    const displayFields = ['name'];
    const tableName = "Professors";
    // console.log("JSON: ", jsonResult)
    jsonResult.then(data => {
        const tableElement = generateTable(data, displayFields, tableName);

        if (tableElement) {
            body.appendChild(tableElement);
        } else {
            console.error('Failed to generate table. Check JSON data structure.');
        }
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
    // const tableElement = generateTable(jsonResult);
    // body.appendChild(tableElement);

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
function generateTable(jsonData, displayFields, tableName) {
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.error('Invalid JSON data structure.');
        return null;
    }

    let table = document.getElementById(tableName);

    // If the table does not exist, create a new one
    if (!table) {
        table = document.createElement('table');
        table.id = tableName;

        // Create a caption for the table (you can uncomment these lines if you want the caption)
        // const caption = document.createElement('caption');
        // caption.textContent = tableName;
        // table.appendChild(caption);

        // Create table header
        const thead = document.createElement('thead');
        // thead.textContent = tableName; // Include your line here
        table.appendChild(thead);

        const headerRow = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = tableName;
        headerRow.appendChild(th);
        thead.appendChild(headerRow);

        const fieldsToDisplay = displayFields || Object.keys(jsonData[0]);

        fieldsToDisplay.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
    } else {
        // If the table exists, clear its content before updating
        table.innerHTML = '';
    }

    // Create table body
    const tbody = document.createElement('tbody');

    jsonData.forEach(data => {
        if (typeof data !== 'object') {
            console.error('Invalid JSON data structure.');
            return null;
        }

        const row = document.createElement('tr');

        const fieldsToDisplay = displayFields || Object.keys(data);

        fieldsToDisplay.forEach(field => {
            const td = document.createElement('td');
            td.textContent = data[field] || ''; // Display empty string if the field is undefined
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    return table;
}










