window.onload = async function () {
    document.querySelector("#booking-button").addEventListener("click", completeBooking);

    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    for (const item of cart) {
        if (item.type === "hotel") {
            revealHotelLabels();
            const htmlHotel = createHotelObj(
                item.hotelId,
                item.hotelName,
                item.city,
                item.checkin,
                item.checkout,
                item.pricePerNight,
                item.rooms,
                item.adults,
                item.children,
                item.infants
            );
            document.querySelector("#hotels-tbody").appendChild(htmlHotel);
        } else if (item.type === "car") {
            revealCarLabels();
            const htmlCar = createCarObj(
                item.carId,
                item.city,
                item.carType,
                item.checkin,
                item.checkout,
                item.pricePerDay
            );
            document.querySelector("#cars-tbody").appendChild(htmlCar);
        }
    }
};

// --- Create table rows ---
function createHotelObj(id, name, city, checkin, checkout, pricePerNight, rooms, adults, children, infants) {
    const tr = document.createElement("tr");
    tr.appendChild(createTextCell(id));
    tr.appendChild(createTextCell(name));
    tr.appendChild(createTextCell(city));
    tr.appendChild(createTextCell(checkin));
    tr.appendChild(createTextCell(checkout));
    tr.appendChild(createTextCell(adults));
    tr.appendChild(createTextCell(children));
    tr.appendChild(createTextCell(infants));
    tr.appendChild(createTextCell(rooms));
    tr.appendChild(createTextCell(pricePerNight));

    const days = (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24);
    tr.appendChild(createTextCell(pricePerNight * rooms * days));

    return tr;
}

function createCarObj(id, city, carType, checkin, checkout, pricePerDay) {
    const tr = document.createElement("tr");
    tr.appendChild(createTextCell(id));
    tr.appendChild(createTextCell(city));
    tr.appendChild(createTextCell(carType));
    tr.appendChild(createTextCell(checkin));
    tr.appendChild(createTextCell(checkout));
    tr.appendChild(createTextCell(pricePerDay));

    const days = (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24);
    tr.appendChild(createTextCell(pricePerDay * days));

    return tr;
}

// --- Helper functions ---
function createTextCell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
}

function revealHotelLabels() {
    document.querySelector("#hotels-table").classList.remove("hidden");
}

function revealCarLabels() {
    document.querySelector("#cars-table").classList.remove("hidden");
}

// --- Complete Booking ---
async function completeBooking() {
    const userId = sessionStorage.getItem("userId") || (() => {
        const id = "user-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
        sessionStorage.setItem("userId", id);
        return id;
    })();

    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const hotelBookings = [];
    const carBookings = [];
    const allBookingNumbers = []; // <-- collect all numbers here

    cart.forEach(item => {
        const bookingNumber = Date.now() + Math.floor(Math.random() * 1000);
        allBookingNumbers.push(bookingNumber); // <-- push here

        if (item.type === "hotel") {
            const days = (new Date(item.checkout) - new Date(item.checkin)) / (1000 * 60 * 60 * 24);
            const totalPrice = item.pricePerNight * item.rooms * days;
            hotelBookings.push({
                userId,
                bookingNumber,
                type: "hotel",
                hotelId: item.hotelId,
                hotelName: item.hotelName,
                city: item.city,
                checkin: item.checkin,
                checkout: item.checkout,
                adults: item.adults,
                children: item.children,
                infants: item.infants,
                rooms: item.rooms,
                pricePerNight: item.pricePerNight,
                totalPrice
            });
        } else if (item.type === "car") {
            const days = (new Date(item.checkout) - new Date(item.checkin)) / (1000 * 60 * 60 * 24);
            const totalPrice = item.pricePerDay * days;
            carBookings.push({
                userId,
                bookingNumber,
                type: "car",
                carId: item.carId,
                city: item.city,
                carType: item.carType,
                checkin: item.checkin,
                checkout: item.checkout,
                pricePerDay: item.pricePerDay,
                totalPrice
            });
        }
    });

    try {
        if (hotelBookings.length) {
            await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookings: hotelBookings })
            });
        }

        if (carBookings.length) {
            await fetch("/api/carbookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookings: carBookings })
            });
        }

        // alert with all booking numbers
        sessionStorage.removeItem("cart");
        alert("Booking successful! Your booking numbers: " + allBookingNumbers.join(", "));
    } catch (err) {
        console.error(err);
        alert("Error connecting to server.");
    }
}

