window.addEventListener("load", () => {
    document.querySelector("#stays-form").addEventListener("submit", (e) => {
        submitStaysForm(e)
    });
});

function isValidCity(city) {
    city = city.trim()
    const parts = city.split(",")
    if (parts.length !== 2) return false
    const state = parts[1].trim()
    if (state === "TX" || state === "CA") {
        return true
    }
    return false
}

function isValidDate(dateStr) {
    const givenDate = new Date(dateStr)
    const startDate = new Date("2024-09-01")
    const endDate = new Date("2024-12-01")
    return givenDate >= startDate && givenDate <= endDate
}

function calculateRooms(a, c) {
    return Math.ceil((+a + +c) / 2)
}

function submitStaysForm(e) {
    e.preventDefault()

    const formData = new FormData(document.querySelector("#stays-form"));
    const city = formData.get("city")
    const checkin = formData.get("checkin-date")
    const checkout = formData.get("checkout-date")
    const adults = formData.get("adults")
    const children = formData.get("children")
    const infants = formData.get("infants")

    if (!isValidCity(city)) {
        alert("City must be a city in TX or CA.")
    }
    else if (!isValidDate(checkin)) {
        alert("Must check in from Sep 1, 2024 to Dec 1, 2024.")
    }
    else if (!isValidDate(checkout)) {
        alert("Must check in from Sep 1, 2024 to Dec 1, 2024.")
    }
    else if (checkout <= checkin) {
        alert("Check-out must be after check-in.")
    }
    else {
        const staysOutput = document.querySelector("#stays-output")
        staysOutput.textContent = 
            "City: " + city +
            "\nCheck-in: " + checkin +
            "\nCheck-out: " + checkout +
            "\nAdults: " + adults + ", Children: " + children + ", Infants: " + infants +
            "\nRooms needed: " + calculateRooms(adults, children);

    }
}
