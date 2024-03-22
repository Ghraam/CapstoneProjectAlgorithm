// Add data to the database from editdata.html

import { classroomFormat, buildings, profFormat, courseFormat, courseDesignations } from './validateData.js';

function validateCourse(input) {
    // Validate the course entry
    if (input === "") {
        return false;
    }

    for (let i = 0; i < courseDesignations.length; i++) {
        if (contains(input, courseDesignations[i])) {
            console.log("true", input);
        }


    }

}

function contains(sub, string) {
    // Contains
    return !!string.includes(sub);
}


export function updateDisplay(formId) {
    var display = document.getElementById(formId + 'Display');
    var input = document.getElementById(formId + 'Input');
    var span = document.createElement('span');
    span.textContent = input.value;
    var comma = document.createTextNode(', ');
    span.addEventListener('click', function() {
        if (span.nextSibling) {
            display.removeChild(span.nextSibling); // remove the following comma
        } else if (span.previousSibling) {
            display.removeChild(span.previousSibling); // remove the preceding comma if it's the last element
        }
        display.removeChild(span);
    });
    if (display.textContent !== '') {
        display.appendChild(comma);
    }
    display.appendChild(span);
    input.value = '';
}

