window.addEventListener("load", () => {
    developDom()
    setupContactListeners()
});

function developDom() {
    const main = document.querySelector("#main")
    const form = document.createElement("form")
    form.textContent = "Cars"
    form.id = "cars-form"
    main.appendChild(form)
    form.appendChild(makeStandardFormGroup("text", "city", "City: "))
    form.appendChild(makecarDropdown())
    form.appendChild(makeStandardFormGroup("date", "checkin-date", "Check-in: "))
    form.appendChild(makeStandardFormGroup("date", "checkout-date", "Check-out: "))
    const button = document.createElement("button")
    button.type = "submit"
    button.id = "cars-button"
    button.textContent = "Submit"
    form.appendChild(button)
    const divOut = document.createElement("div")
    divOut.classList.add("form-output")
    divOut.id = "cars-output"
    main.appendChild(divOut)
    
}

function makeStandardFormGroup(type, name, labeltext) {
    const group = document.createElement("div")
    group.classList.add("form-group")
    const label = document.createElement("label")
    label.for = name
    label.textContent = labeltext
    group.appendChild(label)
    const input = document.createElement("input")
    input.type = type
    input.id = name
    input.name = name
    input.required = true
    group.appendChild(input)
    return group
}

function makecarDropdown() {
    const group = document.createElement("div")
    group.classList.add("form-group")
    const label = document.createElement("label")
    label.for = "car-type"
    label.textContent = "Select Car Type:"
    group.appendChild(label)
    const select = document.createElement("select")
    select.id = "car-type"
    select.name = "car-type"
    const option1 = document.createElement("option")
    option1.value = "economy"
    option1.textContent = "Economy"
    const option2 = document.createElement("option")
    option2.value = "suv"
    option2.textContent = "SUV"
    const option3 = document.createElement("option")
    option3.value = "compact"
    option3.textContent = "Compact"
    const option4 = document.createElement("option")
    option4.value = "midsize"
    option4.textContent = "Midsize"
    select.appendChild(option1)
    select.appendChild(option2)
    select.appendChild(option3)
    select.appendChild(option4)
    group.appendChild(select)
    return group
}

function setupContactListeners() {
    document.querySelector('#cars-form').addEventListener("submit", (e) => {
        submitContactForm(e)
    })
}

function isValidDate(dateStr) {
    const givenDate = new Date(dateStr)
    const startDate = new Date("2024-09-01")
    const endDate = new Date("2024-12-01")
    return givenDate >= startDate && givenDate <= endDate
}

function displayContactResults(c, t, chi, cho) {
    const outputDiv = document.querySelector("#cars-output")
    outputDiv.textContent = "City: " + c + "\nType: " + t + "\nCheck in: " + chi + "\nCheck Out: " + cho
}

function submitContactForm(e) {
    e.preventDefault()
    const formData = new FormData(document.querySelector("#cars-form"));
    const city = formData.get("city")
    const type = formData.get("car-type")
    const checkin = formData.get("checkin-date")
    const checkout = formData.get("checkout-date")

    if (!isValidDate(checkin)) {
        alert("Must check in from Sep 1, 2024 to Dec 1, 2024.")
    }
    else if (!isValidDate(checkout)) {
        alert("Must check in from Sep 1, 2024 to Dec 1, 2024.")
    }
    else {
        displayContactResults(city, type, checkin, checkout)
    }
}
