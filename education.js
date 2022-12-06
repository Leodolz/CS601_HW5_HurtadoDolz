// Constant of the url where the data will be fetched
const data_history_url = "https://cs-601-hw5-hurtado-dolz.glitch.me/my_education_history.json";

// Save ids of interests as constants for later interaction with the DOM
const academicTableId = "academicTable";
const renderItemsLabelId = "renderItemsLabel";
const academicTableBodyId = "academicTableBody";
const loadDataButtonId = "render-data-button";

// Have a "dictionary" of the fields and which label should they point at for rendering the table with data from json
const columnLabelsDict = {
    school: "School",
    major: "Program / Major",
    type: "Type",
    yearConferred: "Year Conferred",
}

// Function for modifying the DOM and reset everything right before load and/or refresh of data fetching
function prepareLoad() {
    // Do not display table
    document.getElementById(academicTableId).style.display = "none";
    // Reset the inner html from the table body, else it will keep adding columns after each refresh
    document.getElementById(academicTableBodyId).innerHTML = "";
    // Set the overlay style to display for the loading icon to appear
    document.getElementById("overlay").style.display = "initial";
}

// DOM interactions after loading was finished
function finishLoad() {
    // Hide loading icon and overlay as data was fetched
    document.getElementById("overlay").style.display = "none";
    // Set the button text to "Refresh" as data was fetched
    document.getElementById(loadDataButtonId).innerHTML = "Refresh";
}

// Function for rendering data when having the array of items that were fetched
function renderData(academicHistoryItems) {
    // Display table and set the label to reflect the current state
    document.getElementById(academicTableId).style.display = "table";
    document.getElementById(renderItemsLabelId).innerHTML = "Data loaded, to refresh please click button below!";

    // Iterate over each item on the array using ES6's style of for ... of
    for (const academicHistoryItem of academicHistoryItems) {
        // Create a row element for each item
        let tableRow = document.createElement("tr");

        // For each item, we will add td elements and add data to them for each column,
        // we iterate using for ... of and using Object.entries for having key, value pairs using ES6 feature
        // on our columnLabels dict, for iterating over each property of each item and labeling the column correctly
        for (const [key, tag] of Object.entries(columnLabelsDict)) {
            // We create a td element and have as reference
            let tableColumn = document.createElement("td");
            // We set the attribute of data label to the tag that we wish to have from this column
            tableColumn.setAttribute("data-label", tag);
            // The inner html is the data of this column
            tableColumn.innerHTML = academicHistoryItem[key];
            // We append the column to the row
            tableRow.appendChild(tableColumn);
        }

        // Once this row was populated, we append this as a child of the table body
        document.getElementById(academicTableBodyId).appendChild(tableRow);
    }
}

async function loadData() {
    // We call the method that prepares before fetching
    prepareLoad();

    // Try catch block to control any error when fetching
    try {
        // We call the fetching to the url
        const response = await fetch(data_history_url);
        // After awaiting we finished loading, we call the finishLoad method
        finishLoad();
        // If the status is NOT success (200), we show what went wrong or partially wrong
        if (response.status !== 200) {
            // We alert showing the status response, and we end the method here
            alert(`Something happened with the request!\nResponse with status: ${response.status}`);
            return;
        }
        // If we are here it means it was a success then parse the json
        response.json().then(
            // Create callback using arrow style from ES6, and we call renderData using the data parsed
            (data) => {
                renderData(data);
            }
        ).catch(
            // Arrow callback function in the case something went wrong with the json parsing from the response
            (error) => {
                // Alert the error
                alert(error);
            }
        );
    }
    // If an unhandled exception was triggered, we catch it here and have the exception as argument
    catch (exception) {
        // We reflect the current status on our label, and we call the finish load method
        document.getElementById(renderItemsLabelId).innerHTML = `Could not load data, please try again later!\nException: ${exception}`;
        finishLoad();
    }
}