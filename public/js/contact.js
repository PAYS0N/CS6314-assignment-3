window.addEventListener("load", () => {
    setupContactListeners()
});

function setupContactListeners() {
    document.querySelector('#contact-form').addEventListener("submit", (e) => {
        submitContactForm(e)
    })
}

function displayContactResults(fn, ln, p, g, e, c) {
    const outputDiv = document.querySelector("#contact-output")
    outputDiv.textContent = "Name: " + fn + " " + ln + "\nPhone: " + p + "\nGender: " + g + "\nEmail: " + e + "\nComment: " + c
}

function submitContactForm(e) {
    e.preventDefault()
    const formData = new FormData(document.querySelector("#contact-form"));
    const firstName = formData.get("first-name")
    const lastName = formData.get("last-name")
    const phone = formData.get("phone")
    const email = formData.get("email")
    const comment = formData.get("comment")
    const nameRegex = /^[A-Z][a-zA-Z]*$/
    const phoneRegex = /^\(\s?\d{3}\s?\)\s?\d{3}\s?-\s?\d{4}$/
    const emailRegex = /^.*@.*\..*$/
    const commentRegex = /^.{10}.*$/
    if (firstName === lastName) {
        alert("First and last name must be different.")
    }
    else if (!nameRegex.test(firstName)) {
        alert("First name must start with a capital letter, and contain only letters.")
    }
    else if (!nameRegex.test(lastName)) {
        alert("Last name must start with a capital letter, and contain only letters.")
    }
    else if (!phoneRegex.test(phone)) {
        alert("Phone number must be formatted like so: (###)###-####")
    }
    else if (!emailRegex.test(email)) {
        alert("Email must contain '@' and then '.'.")
    }
    else if (!commentRegex.test(comment)) {
        alert("Comment must be at least 10 characters long.")
    }
    else {
        displayContactResults(firstName, lastName, phone, formData.get("gender"), email, comment)
        writeResultsToJson(firstName, lastName, phone, formData.get("gender"), email, comment)
    }
}

function writeResultsToJson(firstName, lastName, phone, gender, email, comment) {
    const userInput = {firstName, lastName, phone, gender, email, comment}
    const jsonUserInput = JSON.stringify(userInput, null, 2)
    const blobUserIput = new Blob([jsonUserInput], { type: "application/json" })
    const urlToBlob = URL.createObjectURL(blobUserIput);

    const a = document.createElement("a");
    a.href = urlToBlob;
    a.download = "contact-data.json";
    a.click();
}