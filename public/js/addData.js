// Add data to the database from editdata.html

import { classroomFormat, buildings, profFormat, courseFormat, courseDesignations } from './validateData.js';
import { comAPI, apiSpec } from "./apicall.js";

const apiHeader = ['professors', 'courses', 'classrooms'];
const forms = ['professors', 'classes', 'classrooms'];

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

function addData(data, header) {
    console.log(data, header);
    comAPI(header, "create", 'POST', data);

}


let form;
for (let i = 0; i < forms.length; i++) {
    form = document.getElementById(forms[i]);
    form.addEventListener('submit', function(event) {
        // Prevent default action
        event.preventDefault();

        // Get input data
        const input = document.getElementById(forms[i] + 'Input');

        // Add to database
        let value = input.value;
        let header = apiHeader[i];
        let cont = false;
        switch (i) {
            case 0: // professors
                console.log("profs adding");
                break;
            case 1: // classes
                if (validateCourse(value)) {
                    cont = true;
                }
                // add to database if valid
                break;
            case 2: // classrooms
                console.log("classrooms adding");
                break;
            default:
                console.log("Error?");
        }
        if (!cont) {
            alert("The data you entered is not valid: " + value);
            return null;
        }
        console.log("Adding ", value, " to database.");
        addData(value, header);

        // Add to page
        const display = document.getElementById(forms[i] + 'Display');
        const span = document.createElement('span');
        span.textContent = input.value;
        const comma = document.createTextNode(', ');
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

    });

}


