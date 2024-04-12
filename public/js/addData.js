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
            // console.log("true", input);
            return true;
        }
    }
}

function validateClassroom(input) {
    // Validate the course entry
    if (input === "") {
        return false;
    }

    for (let i = 0; i < buildings.length; i++) {
        if (contains(input, buildings[i])) {
            // console.log("true", input);
            return true;
        }
    }
}

function contains(string,sub) {
    // Contains
    if (string.includes(sub)) {
        return true;
    } else {
        return false;
    }
}

async function addData(ident, header, name, lab, size, level, double) {
    // console.log(data, header);
    let formattedData;
    switch(header){
        case apiHeader[0]:
            formattedData = {"professor": {"name": name}};
            break;
        case apiHeader[1]:
            formattedData = {"course": {"name": name,
                    "identifier": ident, "needs_lab": lab, "course_size": size,
                    "level": level, "double_block": double}};
            break;
        case apiHeader[2]:
            formattedData = {"classroom": {"room": name,
                    "is_lab": lab, "room_capacity": size}};
            break;
        default:
            console.log("Header is not valid");
            return 2;
    }

    // console.log(formattedData);
    await comAPI(header, "create", 'POST', formattedData);

}

async function gatherData(input, header) {
    // Display the form
    let formPopup = document.getElementById('form-popup');
    let nameField = document.getElementById('name');
    let idField = document.getElementById('identifier');
    let levelField = document.getElementById('level');
    let sizeLabel = document.querySelector('#sizeContainer label');

    let nameContainer = document.getElementById('nameContainer');
    let idContainer = document.getElementById('identifierContainer');
    let labContainer = document.getElementById('labContainer');
    let sizeContainer = document.getElementById('sizeContainer');
    let levelContainer = document.getElementById('levelContainer');
    let doubleContainer = document.getElementById('doubleContainer');

    // Initialize values
    let name = "";
    let ident = "";
    let lab = 0;
    let size = 0;
    let level = 0;
    let double = 0;

    switch(header){
        case apiHeader[0]:
            // Hide Unneeded Fields
            idContainer.classList.add('hidden');
            labContainer.classList.add('hidden');
            sizeContainer.classList.add('hidden');
            levelContainer.classList.add('hidden');
            doubleContainer.classList.add('hidden');


            nameField.value = input;
            break;
        case apiHeader[1]:
            // Show Fields
            idContainer.classList.remove('hidden');
            labContainer.classList.remove('hidden');
            sizeContainer.classList.remove('hidden');
            levelContainer.classList.remove('hidden');
            doubleContainer.classList.remove('hidden');

            idField.value = input;
            nameField.value = "";

            let match = input.match(/\d+/);
            if (match) {
                let num = match[0];
                level = num.charAt(0);
                levelField.value = level;
            }

            sizeLabel.textContent = "Course Size:";

            break;
        case apiHeader[2]:
            // Show Fields
            labContainer.classList.remove('hidden');
            sizeContainer.classList.remove('hidden');

            // Hide Other Fields
            idContainer.classList.add('hidden');
            levelContainer.classList.add('hidden');
            doubleContainer.classList.add('hidden');

            sizeLabel.textContent = "Classroom Capacity:";

            nameField.value = input;

            break;
        default:
            console.log("Header is not valid");
            return 2;
    }



    formPopup.style.display = 'block';




    // JavaScript to handle form submission
    document.getElementById('myForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        // You can add your form submission logic here
        // For example, you can collect form data and send it to a server using AJAX
        // Or you can process the form data directly in JavaScript
        let formData = new FormData(this);
        // Example: Log form data to console
        for (let pair of formData.entries()) {
            // console.log(pair[0] + ': ' + pair[1]);
            switch(pair[0]) {
                case "name":
                    name = pair[1];
                    break;
                case "identifier":
                    ident = pair[1];
                    break;
                case "size":
                    size = pair[1];
                    break;
                case "level":
                    level = pair[1];
                    break;
                case "double":
                    if (pair[1]) {
                        double = 1;
                    }
                    break;
                case "lab":
                    if (pair[1]) {
                        lab = 1;
                    }
                    break;
                default:
                    console.log("Unknown field");
            }
        }
        // Close the form popup
        document.getElementById('form-popup').style.display = 'none';


        // console.log("Data: ", name, identifier, lab, size, level, double);
        await addData(ident, header, name, lab, size, level, double).then(() =>{
            // location.reload();
        });
    });
}


let form;
for (let i = 0; i < forms.length; i++) {
    form = document.getElementById(forms[i]);
    form.addEventListener('submit', async function(event) {
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
                // console.log("profs adding");
                cont = true;
                break;
            case 1: // classes
                // console.log("Validating Course: ", value);
                if (validateCourse(value)) {
                    cont = true;
                }
                // add to database if valid
                break;
            case 2: // classrooms
                // console.log("Validating Classrooms: ", value);
                if (validateClassroom(value)) {
                    cont = true;
                }
                break;
            default:
                console.log("Error?");
        }
        if (!cont) {
            alert("The data you entered is not valid: " + value);
            return null;
        }
        // console.log("Adding ", value, " to database.");
        await gatherData(value, header);

    });

}


