import { comAPI, apiSpec } from './apicall.js';

// Function to fetch data for a subsection and insert it into an HTML element as spans
async function fetchDataAndInsert(apiHeader, elementId) {
    const dataArray = await fetchSubsectionData(apiHeader, elementId);
    insertDataAsSpans(dataArray, elementId, apiHeader);
}

document.addEventListener('DOMContentLoaded', async function() {
    // Example subsections and corresponding element IDs
    const apiHeader = ['professors', 'courses', 'classrooms'];
    const elementIds = ['professorsDisplay', 'classesDisplay', 'classroomsDisplay'];

    // Fetch data and insert into elements for each subsection
    for (let i = 0; i < apiHeader.length; i++) {
        await fetchDataAndInsert(apiHeader[i], elementIds[i]);
    }
});



async function fetchSubsectionData(apiSpecHeader, elementId) {
    try {
        const data = await comAPI(apiSpecHeader, 'index', 'GET'); // Fetch data using fetchData function
        const element = document.getElementById(elementId); // Get the HTML element by ID
        if (!element) {
            throw new Error(`Element with ID ${elementId} not found.`);
        }
        if (data) {
            console.log(data)
            return data;
        } else {
            throw new Error('Failed to fetch data.');
        }
    } catch (error) {
        console.error('Error fetching subsection data:', error);
        return null;
    }
}

function insertDataAsSpans(dataArray, elementId, apiHeader) {
    const element = document.getElementById(elementId);

    // Clear previous content
    element.innerHTML = '';

    // Iterate over the data array and create <span> elements for each item
    dataArray.forEach((item, index) => {
        const span = document.createElement('span');
        let fieldValue;
        switch (apiHeader) {
            case 'professors':
                fieldValue = item.name;
                break;
            case 'courses':
                fieldValue = item.identifier;
                break;
            case 'classrooms':
                fieldValue = item.room;
                break;
            default:
                fieldValue = '';
                console.error('Unknown API header:', apiHeader);
                break;
        }

        // Set the text content of the main span
        span.textContent = fieldValue;

        // Create a hidden span element to store the ID
        const hiddenSpan = document.createElement('span');
        hiddenSpan.textContent = item.id;
        hiddenSpan.style.display = 'none';

        // Append the hidden span inside the main span
        span.appendChild(hiddenSpan);

        var display = document.getElementById(elementId);

        span.addEventListener('click', function() {
            const id = span.querySelector('span').textContent; // Get the ID from the hidden span
            if (span.nextSibling) {
                display.removeChild(span.nextSibling); // remove the following comma
            } else if (span.previousSibling) {
                display.removeChild(span.previousSibling); // remove the preceding comma if it's the last element
            }
            display.removeChild(span);
            confirmRemoval(id, apiHeader);
        });

        element.appendChild(span);

        // Add comma and space if not the last item
        if (index < dataArray.length - 1) {
            const separator = document.createTextNode(', ');
            element.appendChild(separator);
        }
    });
}

function confirmRemoval(id, apiHeader) {
    const confirmation = confirm('Do you want to remove this element from the database?');
    if (confirmation) {
        // User clicked "OK"
        // Remove element from the database
        console.log('Removing element with ID:', id);
        let sub = 'destroy';
        let method = 'DELETE';
        const prom = comAPI(apiHeader, sub, method, null, id);
    } else {
        // User clicked "Cancel"
        // Do nothing to the database
        alert("Removed from current session, element remains in the database.");
    }
}




