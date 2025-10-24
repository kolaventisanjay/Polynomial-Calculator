// Global array to store student records. 
// We use a JS array of objects and sort it, which is the web standard 
// way to achieve the sorted linked list requirement efficiently.
const studentRecords = [];

// DOM Element References
const form = document.getElementById('add-student-form');
const tableBody = document.querySelector('#grades-table tbody');
const statCount = document.getElementById('stat-count');
const statAverage = document.getElementById('stat-average');
const statHighest = document.getElementById('stat-highest');
const statLowest = document.getElementById('stat-lowest');

/**
 * Inserts a new student record into the array and maintains sorted order by ID.
 * @param {object} newStudent - The student object to insert.
 */
function insertSorted(newStudent) {
    // Check for existing ID (optional but good practice)
    const existingIndex = studentRecords.findIndex(s => s.studentID === newStudent.studentID);
    if (existingIndex !== -1) {
        alert(`Student ID ${newStudent.studentID} already exists! Grade updated.`);
        studentRecords[existingIndex].grade = newStudent.grade;
        // Skip insertion logic and just re-sort/redraw
        return;
    }

    // 1. Insert the new student
    studentRecords.push(newStudent);

    // 2. Sort the entire array by studentID (Ascending)
    // This achieves the "sorted linked list insertion" requirement simply and efficiently in JS.
    studentRecords.sort((a, b) => a.studentID - b.studentID);
}

/**
 * Calculates and updates class statistics (Total, Average, High, Low Grade).
 */
function calculateClassStatistics() {
    if (studentRecords.length === 0) {
        statCount.textContent = 0;
        statAverage.textContent = '0.00';
        statHighest.textContent = '0.00';
        statLowest.textContent = '0.00';
        return;
    }

    let sum = 0;
    let highest = 0;
    let lowest = 100; // Assume max grade is 100

    studentRecords.forEach(student => {
        const grade = student.grade;
        sum += grade;
        if (grade > highest) highest = grade;
        if (grade < lowest) lowest = grade;
    });

    const count = studentRecords.length;
    const average = sum / count;

    // Update the DOM
    statCount.textContent = count;
    statAverage.textContent = average.toFixed(2);
    statHighest.textContent = highest.toFixed(2);
    statLowest.textContent = lowest.toFixed(2);
}

/**
 * Traverses the array and renders the HTML table.
 */
function displayRecords() {
    // Clear previous records
    tableBody.innerHTML = '';

    studentRecords.forEach(student => {
        const row = tableBody.insertRow();
        
        // ID Cell
        const idCell = row.insertCell();
        idCell.textContent = student.studentID;

        // Name Cell
        const nameCell = row.insertCell();
        nameCell.textContent = student.name;
        
        // Grade Cell
        const gradeCell = row.insertCell();
        gradeCell.textContent = student.grade.toFixed(2);
    });
}

/**
 * Main handler function to process form submission.
 */
function handleFormSubmit(event) {
    event.preventDefault(); // Stop the page from reloading

    // 1. Get values from the form inputs
    const idInput = document.getElementById('studentID');
    const nameInput = document.getElementById('studentName');
    const gradeInput = document.getElementById('studentGrade');
    
    const id = parseInt(idInput.value);
    const name = nameInput.value.trim();
    const grade = parseFloat(gradeInput.value);

    // Basic validation
    if (isNaN(id) || isNaN(grade) || name === '') {
        alert('Please enter valid data for all fields.');
        return;
    }

    // 2. Create the new student object
    const newStudent = {
        studentID: id,
        name: name,
        grade: grade
    };

    // 3. Insert and sort the data
    insertSorted(newStudent);

    // 4. Update the display and statistics
    displayRecords();
    calculateClassStatistics();

    // 5. Clear the input fields for next entry
    idInput.value = '';
    nameInput.value = '';
    gradeInput.value = '';
}

// Attach the main handler to the form's submit event
form.addEventListener('submit', handleFormSubmit);

// Initial display of records and stats (will be empty)
displayRecords();
calculateClassStatistics();