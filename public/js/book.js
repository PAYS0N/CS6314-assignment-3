window.addEventListener("load", () => {
    setupBookListeners()
    updateBookForm()
});


function setupBookListeners() {
    document.querySelector("#one-way-trip-radio").addEventListener("change", () => {
        updateBookForm()
    })
    document.querySelector("#round-trip-radio").addEventListener("change", () => {
        updateBookForm()
    })
    document.querySelector('#booking-form').addEventListener("submit", (e) => {
        submitBookForm(e)
    })
}

function updateBookForm() {
    tripIsOneWay = document.querySelector("#one-way-trip-radio").checked
    tripIsRound = document.querySelector("#round-trip-radio").checked
    returnDateGroup = document.querySelector("#return-date-group")
    returnDate = document.querySelector("#return-date")
    if (tripIsOneWay) {
        returnDateGroup.style.display = 'none';
        returnDate.value = '';
        returnDate.required = false
    } else if (tripIsRound) {
        returnDateGroup.style.display = 'block';
        returnDate.required = true
    }

}

function submitBookForm(e) {
    e.preventDefault()
    const formData = new FormData(document.querySelector("#booking-form"));
    const origin = formData.get("origin")
    const destination = formData.get("destination")
    const departure = formData.get("depart-date")
    const arrival = formData.get("return-date")
    const dateRegex = /^(2024-(09|10|11)-[0-3][0-9]|2024-12-01)$/
    const cityRegex = /^[A-Za-z\s]+,\s*(TX|CA)$/
    if (!cityRegex.test(origin)) {
        alert("Must start at a city in TX or CA.")
    }
    else if (!cityRegex.test(destination)) {
        alert("Must end at a city in TX or CA.")
    }
    else if (!dateRegex.test(departure)) {
        alert("Must depart from Sep 1, 2024 to Dec 1st, 2024.")
    }
    else if (arrival != "") {
        if (!dateRegex.test(arrival)) {
            alert("Must return from Sep 1, 2024 to Dec 1st, 2024.")
        }
        else {
            displayBookResults(origin, destination, departure, arrival)
        }
    }
    else {
        displayBookResults(origin, destination, departure, arrival)
    }
}

function displayBookResults(o, des, dep, arr) {
    const outputDiv = document.querySelector("#booking-output")
    outputDiv.textContent = "Origin: " + o + "\nDestination: " + des + "\nDeparture: " + dep
    if (arr != "") {
        outputDiv.textContent += "\nReturn: " + arr
    }
}
