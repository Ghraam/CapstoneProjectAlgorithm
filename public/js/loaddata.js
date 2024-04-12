import { comAPI, apiSpec } from './apicall.js';

// Function to fetch data for a subsection and insert it into an HTML element as spans
async function fetchDataAndInsert(apiHeader, elementId) {
    const dataArray = await fetchSubsectionData(apiHeader, elementId);
    insertDataAsDivs(dataArray, elementId, apiHeader);
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
            // console.log(data)
            return data;
        } else {
            throw new Error('Failed to fetch data.');
        }
    } catch (error) {
        console.error('Error fetching subsection data:', error);
        return null;
    }
}

function insertDataAsDivs(dataArray, elementId, apiHeader) {
    const element = document.getElementById(elementId);

    // Clear previous content
    element.innerHTML = '';

    // Iterate over the data array and create <span> elements for each item
    dataArray.forEach((item, index) => {
        const holdingDiv = document.createElement('div');
        holdingDiv.classList.add("data-item");

        let fieldValue;
        let tooltipText;
        switch (apiHeader) {
            case 'professors':
                fieldValue = item.name;
                tooltipText = fieldValue;
                break;
            case 'courses':
                fieldValue = item.identifier;
                tooltipText = `${item.name}, ${fieldValue}, Size: ${item.course_size}`;
                break;
            case 'classrooms':
                fieldValue = item.room;
                tooltipText = `${fieldValue}, Capacity: ${item.room_capacity}`;
                break;
            default:
                fieldValue = '';
                console.error('Unknown API header:', apiHeader);
                break;
        }

        // Set the text content of the main span
        holdingDiv.textContent = fieldValue;

        // Create a hidden span element to store the ID
        const hiddenSpan = document.createElement('span');
        hiddenSpan.textContent = item.id;
        hiddenSpan.style.display = 'none';

        // Append the hidden span inside the main span
        holdingDiv.appendChild(hiddenSpan);

        holdingDiv.setAttribute('data-tooltip', tooltipText);
        holdingDiv.classList.add('tooltip');

        let display = document.getElementById(elementId);

        holdingDiv.addEventListener('click', function() {
            // const id = span.querySelector('span').textContent; // Get the ID from the hidden span
            const id = hiddenSpan.textContent;
            if (!holdingDiv.nextSibling) {
                // If there is no next sibling (i.e., it's the last element)
                const previousSibling = holdingDiv.previousSibling;
                if (previousSibling && previousSibling.nodeType === Node.TEXT_NODE) {
                    // If the previous sibling is a text node (representing the comma)
                    display.removeChild(previousSibling); // Remove the comma
                }
            }
            display.removeChild(holdingDiv);
            confirmRemoval(id, apiHeader);
        });

        // Event listener to show tooltip
        holdingDiv.addEventListener('mouseover', function(event) {
            if (event.target.classList.contains('tooltip')) {
                let tooltipText = event.target.getAttribute('data-tooltip');
                let tooltip = document.createElement('div');
                tooltip.className = 'tooltip-text';
                tooltip.innerHTML = tooltipText;
                tooltip.style.display = 'block';
                document.body.appendChild(tooltip);

                // Position the tooltip next to the mouse cursor
                tooltip.style.top = (event.clientY + 10) + 'px';
                tooltip.style.left = (event.clientX + 10) + 'px';
            }
        });

        // Event listener to hide tooltip
        holdingDiv.addEventListener('mouseout', function(event) {
            let tooltip = document.querySelector('.tooltip-text');
            if (tooltip) {
                tooltip.style.display = 'none';
                tooltip.parentNode.removeChild(tooltip);
            }
        });

        // Event listener to hide tooltip
        holdingDiv.addEventListener('mouseout', function(event) {
            let tooltip = document.querySelector('.tooltip-text');
            if (tooltip) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });

        // Add comma and space if not the last item
        if (index < dataArray.length - 1) {
            const separator = document.createTextNode(', ');
            holdingDiv.appendChild(separator);
        }

        element.appendChild(holdingDiv);


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

