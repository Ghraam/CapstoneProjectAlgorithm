
// Get all elements with the class "drop-area"
const dropAreas = document.querySelectorAll('td.drop-area');

// Add event listeners to each drop area
dropAreas.forEach(dropArea => {
    // Add ondrop event handler
    dropArea.ondrop = function(event) {
        drop(this, event);
    };

    // Add ondragenter event handler to prevent default behavior
    dropArea.ondragenter = function() {
        return false;
    };

    // Add ondragover event handler to prevent default behavior
    dropArea.ondragover = function() {
        return false;
    };
});