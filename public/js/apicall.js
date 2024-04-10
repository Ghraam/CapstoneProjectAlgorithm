
// API Specification
export const apiSpec =

    {
        "sections": {
            "index": {
                "url": "/sections.json",
                "method": "GET",
                "description": "Get all sections"
            },
            "show": {
                "url": "/sections/:id.json",
                "method": "GET",
                "description": "Get a single section"
            },
            "create": {
                "url": "/sections.json",
                "method": "POST",
                "description": "Create a new section"
            },
            "update": {
                "url": "/sections/:id.json",
                "method": "PUT",
                "description": "Update a section"
            },
            "destroy": {
                "url": "/sections/:id.json",
                "method": "DELETE",
                "description": "Delete a section"
            }
        },
        "classrooms": {
            "index": {
                "url": "/classrooms.json",
                "method": "GET",
                "description": "Get all classrooms"
            },
            "show": {
                "url": "/classrooms/:id.json",
                "method": "GET",
                "description": "Get a single classroom"
            },
            "create": {
                "url": "/classrooms.json",
                "method": "POST",
                "description": "Create a new classroom"
            },
            "update": {
                "url": "/classrooms/:id.json",
                "method": "PUT",
                "description": "Update a classroom"
            },
            "destroy": {
                "url": "/classrooms/:id.json",
                "method": "DELETE",
                "description": "Delete a classroom"
            }
        },
        "course_preferences": {
            "index": {
                "url": "/course_preferences.json",
                "method": "GET",
                "description": "Get all course preferences"
            },
            "show": {
                "url": "/course_preferences/:id.json",
                "method": "GET",
                "description": "Get a single course preference"
            },
            "create": {
                "url": "/course_preferences.json",
                "method": "POST",
                "description": "Create a new course preference"
            },
            "update": {
                "url": "/course_preferences/:id.json",
                "method": "PUT",
                "description": "Update a course preference"
            },
            "destroy": {
                "url": "/course_preferences/:id.json",
                "method": "DELETE",
                "description": "Delete a course preference"
            }
        },
        "courses": {
            "index": {
                "url": "/courses.json",
                "method": "GET",
                "description": "Get all courses"
            },
            "show": {
                "url": "/courses/:id.json",
                "method": "GET",
                "description": "Get a single course"
            },
            "create": {
                "url": "/courses.json",
                "method": "POST",
                "description": "Create a new course"
            },
            "update": {
                "url": "/courses/:id.json",
                "method": "PUT",
                "description": "Update a course"
            },
            "destroy": {
                "url": "/courses/:id.json",
                "method": "DELETE",
                "description": "Delete a course"
            }
        },
        "professors": {
            "index": {
                "url": "/professors.json",
                "method": "GET",
                "description": "Get all professors"
            },
            "show": {
                "url": "/professors/:id.json",
                "method": "GET",
                "description": "Get a single professor"
            },
            "create": {
                "url": "/professors.json",
                "method": "POST",
                "description": "Create a new professor"
            },
            "update": {
                "url": "/professors/:id.json",
                "method": "PUT",
                "description": "Update a professor"
            },
            "destroy": {
                "url": "/professors/:id.json",
                "method": "DELETE",
                "description": "Delete a professor"
            }
        },
        "time_blocks": {
            "index": {
                "url": "/time_blocks.json",
                "method": "GET",
                "description": "Get all time blocks"
            },
            "show": {
                "url": "/time_blocks/:id.json",
                "method": "GET",
                "description": "Get a single time block"
            },
            "create": {
                "url": "/time_blocks.json",
                "method": "POST",
                "description": "Create a new time block"
            },
            "update": {
                "url": "/time_blocks/:id.json",
                "method": "PUT",
                "description": "Update a time block"
            },
            "destroy": {
                "url": "/time_blocks/:id.json",
                "method": "DELETE",
                "description": "Delete a time block"
            }
        },
        "time_preferences": {
            "index": {
                "url": "/time_preferences.json",
                "method": "GET",
                "description": "Get all time preferences"
            },
            "show": {
                "url": "/time_preferences/:id.json",
                "method": "GET",
                "description": "Get a single time preference"
            },
            "create": {
                "url": "/time_preferences.json",
                "method": "POST",
                "description": "Create a new time preference"
            },
            "update": {
                "url": "/time_preferences/:id.json",
                "method": "PUT",
                "description": "Update a time preference"
            },
            "destroy": {
                "url": "/time_preferences/:id.json",
                "method": "DELETE",
                "description": "Delete a time preference"
            }
        },
        "algorithm": {
            "generate": {
                "url": "/generate",
                "method": "POST",
                "description": "Start the algorithm to generate a schedule"
            },
            // Not implemented (404)
            "status": {
                "url": "/status",
                "method": "GET",
                "description": "Get the status of the algorithm"
            }
        }
    };

let hostname = window.location.hostname;

// Replace 'BASE_URL' with the actual base URL of your API
const BASE_URL = 'http://' + hostname + ':3000';

// Function to make a generic API request
async function makeRequest(header, subsection, method, data = null, id = null) {
    const endpoint = apiSpec[header][subsection];
    let url = `${BASE_URL}${endpoint.url}`;

    if (id) {
        url = url.replace(':id', id);
    }

    const headers = {
        'Content-Type': 'application/json',
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

    if (method === 'DELETE' || method === 'POST') {
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

// Function to wait for the promise returned by makeRequest and return an array of elements
export async function comAPI(header, subsection, method, data = null, id = null) {
    const jsonData = await makeRequest(header, subsection, method, data, id);

    if (method !== 'GET') {
        return null;
    }

    if (!jsonData) {
        console.error('Failed to fetch data.');
        return [];
    }

    return jsonData;
}

// document.getElementById('testButton').addEventListener('click', function() {
//     console.log("Starting");
//     const header = "professors";
//     const sub = "index";
//
//     const data = fetchData(header, sub, 'GET');
//
//     console.log(data);
//
//     console.log("Finished");
//
// });


// // Example usage:
// document.getElementById('testButton').addEventListener('click', function() {
//     console.log("Starting request");
//     const displayFields = ['name']; // Define which fields to display
//     const tableName = "Professors"; // Define the table name
//     fetchData('professors', 'index', 'GET', displayFields, tableName);
// });
