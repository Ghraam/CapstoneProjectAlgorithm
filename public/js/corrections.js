
document.addEventListener("DOMContentLoaded", function() {
    // Get all elements with the class "drop-area"
    const dropAreas = document.querySelectorAll('td.drop-area');

// Add event listeners to each drop area
    dropAreas.forEach(dropArea => {
        // Add ondrop event handler attribute
        dropArea.setAttribute('ondrop', 'drop(this, event)');

        // Add ondragenter event handler attribute to prevent default behavior
        dropArea.setAttribute('ondragenter', 'return false');

        // Add ondragover event handler attribute to prevent default behavior
        dropArea.setAttribute('ondragover', 'return false');
    });
});
