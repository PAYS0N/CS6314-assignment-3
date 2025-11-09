window.addEventListener("load", () => {
    setupFlightListeners();
});

function setupFlightListeners() {
    document.querySelector("#passenger-icon").addEventListener("click", () => {
        document.querySelector("#flight-form").style.display = "block";
    });
    
    document.querySelector("#flight-form").addEventListener("submit", (e) => {
        submitFlightForm(e);
    });
}

function displayFlightResults(adults, children, infants) {
    const outputDiv = document.querySelector("#flight-output");
    outputDiv.textContent =
        `Adults: ${adults}, Children: ${children}, Infants: ${infants}`;
}

function submitFlightForm(e) {
    e.preventDefault();
    const formData = new FormData(document.querySelector("#flight-form"));
    const adults = parseInt(formData.get("adults"), 10);
    const children = parseInt(formData.get("children"), 10);
    const infants = parseInt(formData.get("infants"), 10);

    const numRegex = /^[0-4]$/;

    if (!numRegex.test(adults) || !numRegex.test(children) || !numRegex.test(infants)) {
        alert("Number of passengers in any category cannot exceed 4.");
    }
    else {
        displayFlightResults(adults, children, infants);
    }
}
