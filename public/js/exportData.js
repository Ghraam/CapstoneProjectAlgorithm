import { comAPI, apiSpec } from "./apicall.js";

// Function to convert data to CSV format
function convertToCSV(data) {
    const headers = Object.keys(data[0]).join(',');
    let csv = headers + '\n';
    for (const section of data) {
        const values = Object.values(section).join(',');
        csv += values + '\n';
    }
    return csv;
}

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
    const formattedTime = `${day} ${time}`;

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
                first_block: startTime,
                second_block: endTime,
                // Add other necessary properties from section if needed
            });
        }

        return fullSectionsData;
    } catch (error) {
        console.error('Error in getFullSectionsData:', error);
        return [];
    }
}

// Function to fetch data from API and handle export
async function fetchDataAndExport(format) {
    try {
        // Fetch initial data from API
        const initialData = await getSections();
        const data = await getFullSectionsData(initialData);

        // Convert data based on selected format
        let convertedData;
        if (format === 'csv') {
            convertedData = convertToCSV(data);
            downloadFile(convertedData, 'Schedule.csv', 'text/csv');
        } else {
            throw new Error('Invalid export format');
        }
    } catch (error) {
        console.error('Error fetching or exporting data:', error);
    }
}

// Function to download a file with the specified content and filename
function downloadFile(content, filename, contentType) {
    // Parse the filename to get the name and extension parts
    const parts = filename.split('.');
    const name = parts[0];
    const extension = parts.slice(1).join('.');

    // Get current date and time
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentTime = new Date().toISOString().slice(11, 19).replace(/:/g, "-");

    // Create a new file name with date and time
    const newFilename = `${name}_${currentDate}_${currentTime}.${extension}`;

    // Create a Blob from the content
    const blob = new Blob([content], { type: contentType });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const a = document.createElement('a');

    // Set the href and download attributes
    a.href = url;
    a.download = newFilename;

    // Append the link to the body and trigger the click event
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}


document.getElementById('exportCSVButton').addEventListener('click', () => {
    fetchDataAndExport('csv');
});