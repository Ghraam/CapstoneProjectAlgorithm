import {comAPI} from "./apicall.js";

// Function to parse time blocks response
function parseTimeBlockResponse(response) {
    // Extract relevant data from the response
    const { identifier } = response;

    // Split the identifier string to get day and time
    const [dayString, timeString] = identifier.split(' ');

    // Map day string to actual day
    const dayMap = {
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thursday: 'Thursday',
        Friday: 'Friday',
        Saturday: 'Saturday',
        Sunday: 'Sunday'
    };
    const day = dayMap[dayString];

    // Map time string to actual time
    const timeMap = {
        '1': '8:30',
        '2': '10:00',
        '3': '11:30',
        '4': '1:00',
        '5': '2:30',
        '6': '4:00',
        '7': '5:30',
        '8': '7:00'
    };
    const time = timeMap[timeString];

    // Combine day and time
    // noinspection UnnecessaryLocalVariableJS
    // const formattedTime = `${day} ${time}`;

    // noinspection UnnecessaryLocalVariableJS
    const formattedTime = `${dayString}${timeString}`;

    return formattedTime;
}


function getFieldValue(item, apiHeader) {
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
    return fieldValue;
}

// Function to fetch sections data from the API
async function getSections() {
    try {
        // Hardcoded sections data for testing
        // noinspection UnnecessaryLocalVariableJS
        const sectionsData = [
            {"course_id": 7, "section_num": 1, "professor_id": 1, "start": 2, "end": 24, "classroom_id": 1},
            {"course_id": 8, "section_num": 2, "professor_id": 6, "start": 3, "end": 25, "classroom_id": 1},
            // Add more data as needed
        ];

        //comAPI

        return sectionsData;
    } catch (error) {
        console.error('Error fetching sections data:', error);
        throw error; // Propagate the error to the caller
    }
}

// Function to get full data for sections
async function getFullSectionsData(initialData) {
    try {
        const fullSectionsData = [];

        // Loop through each section in the initial data
        for (const section of initialData) {
            // Make API calls to get course, professor, and classroom data
            const courseData = await comAPI('courses', 'show', 'GET', null, section.course_id);
            const professorData = await comAPI('professors', 'show', 'GET', null, section.professor_id);
            const classroomData = await comAPI('classrooms', 'show', 'GET', null, section.classroom_id);

            // Fetch time blocks data for start and end times
            const startTimeBlockData = await comAPI('time_blocks', 'show', 'GET', null, section.start);
            const endTimeBlockData = await comAPI('time_blocks', 'show', 'GET', null, section.end);

            // Parse time block responses to get formatted start and end times
            const startTime = parseTimeBlockResponse(startTimeBlockData);
            const endTime = parseTimeBlockResponse(endTimeBlockData);

            // Get field values for professors, courses, and classrooms
            const professorName = getFieldValue(professorData, 'professors');
            const courseIdentifier = getFieldValue(courseData, 'courses');
            const classroomRoom = getFieldValue(classroomData, 'classrooms');

            // Add formatted data to fullSectionsData
            fullSectionsData.push({
                course: courseIdentifier,
                professor: professorName,
                classroom: classroomRoom,
                startTime: startTime,
                endTime: endTime
                // Add other necessary properties from section if needed
            });
        }

        return fullSectionsData;
    } catch (error) {
        console.error('Error in getFullSectionsData:', error);
        return [];
    }
}

// Function to generate HTML content for each row in the table
// function generateTableRow(sectionData) {
//     const sisterID = sisterParse(sectionData.startTime); // Get sister ID
//     return `
//         <td class="drop-area" id="${sectionData.startTime}">
//             <div draggable="true" ondragstart="drag(this,event)" sister="${sisterID}">
//                 ${sectionData.course} - ${sectionData.professor}<br>
//                 ${sectionData.classroom}<br>
//                 ${sectionData.startTime} - ${sectionData.endTime}
//             </div>
//         </td>
//     `;
// }
function generateTableRow(sectionData) {
    let startTd = document.getElementById(sectionData.startTime);
    let endTd = document.getElementById(sectionData.endTime);

    let newDiv = document.createElement('div');
    newDiv.classList.add('schedule-item');
    newDiv.textContent = `${sectionData.course}\n${sectionData.classroom}\n${sectionData.professor}`;
    newDiv.id = `${sectionData.course}-${sectionData.classroom}`;
    newDiv.setAttribute("draggable", "true");
    newDiv.setAttribute("ondragstart", "drag(this, event)");

    let sisterDiv = document.createElement('div');
    sisterDiv.classList.add('sister-item');
    sisterDiv.textContent = `${sectionData.course}\n${sectionData.classroom}\n${sectionData.professor}`;
    sisterDiv.id = `${sectionData.course}-${sectionData.classroom}sister`;
    sisterDiv.setAttribute("draggable", "false");
    sisterDiv.setAttribute("ondragstart", "drag(this, event)");

    startTd.appendChild(newDiv);
    endTd.appendChild(sisterDiv);
}

// Function to populate the table with data
async function populateTable() {
    try {
        const initialData = await getSections();
        const fullSectionsData = await getFullSectionsData(initialData);

        const tableBody = document.querySelector('#schedule-box tbody');
        //tableBody.innerHTML = '';

        fullSectionsData.forEach(sectionData => {
            const row = document.createElement('tr');
            generateTableRow(sectionData);
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error populating table:', error);
    }
}

// Call populateTable function when the page loads
window.addEventListener('load', populateTable);