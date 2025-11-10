window.onload = async function onwindowload() {
    document.querySelector("#hotel-button").addEventListener("click", completeHotelBooking)
    document.querySelector("#flight-button").addEventListener("click", completeFlightBooking)

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    for (const element of cart) {
        if (element.type === "hotel") {
            revealHotelLabels();
            const availableRooms = await getHotelRooms(element.hotelId);
            const htmlHotel = createHotelObj(
                element.hotelId,
                element.hotelName,
                element.city,
                element.checkin,
                element.checkout,
                element.pricePerNight,
                availableRooms,
                element.rooms,
                element.adults,
                element.children,
                element.infants
            );
            document.querySelector("#hotels-output").appendChild(htmlHotel);
        }
        if (element.type === "flight") {
            revealFlightLabels();
            const flightDetails = await getFlightDetails(element.flightId);
            const htmlFlight = createFlightObj(
                element.flightId,
                flightDetails.origin,
                flightDetails.destination,
                flightDetails.departureDate,
                flightDetails.arrivalDate,
                flightDetails.departureTime,
                flightDetails.arrivalTime,
                flightDetails.price,
                element.adults,
                element.children,
                element.infants,
                element.adults+element.children+element.infants
            );
            document.querySelector("#flights-output").appendChild(htmlFlight);
        }
    }
};

function createHotelObj(id, name, city, checkin, checkout, price, availableRooms, roomsNeeded, adults, children, infants) {
    const trHotel = document.createElement('tr')
    trHotel.appendChild(createTextCell(id))
    trHotel.appendChild(createTextCell(name))
    trHotel.appendChild(createTextCell(city))
    trHotel.appendChild(createTextCell(checkin))
    trHotel.appendChild(createTextCell(checkout))
    trHotel.appendChild(createTextCell(adults))
    trHotel.appendChild(createTextCell(children))
    trHotel.appendChild(createTextCell(infants))
    trHotel.appendChild(createTextCell(roomsNeeded))
    trHotel.appendChild(createTextCell(price))
    trHotel.appendChild(createTextCell(price * roomsNeeded))
    return trHotel
}

function createTextCell(text) {
    const divText = document.createElement('td')
    divText.textContent = text
    return divText
}

function createButtonCell(text) {
    const tdText = document.createElement('td')
    const buttonText = document.createElement('button')
    buttonText.textContent = text
    tdText.appendChild(buttonText)
    return tdText
}

function revealHotelLabels() {
    document.querySelector("#hotels-table").classList.remove("hidden")
    document.querySelector("#hotel-button").classList.remove("hidden")
}

async function getHotelRooms(id) {
    const xmlHotels = await getHotels()

    xmlHotels.hotels.hotel.forEach(hotel => {

        if (hotel.hotelId[0] === id) {
            return hotel.availableRooms[0]
        }
        else {
            // console.log(hotel.city[0])
        }
    });

}

async function getHotels() {
    try {
        const response = await fetch('/api/hotels')

        const xmlHotels = await response.json()
        return xmlHotels
    } catch (err) {
        console.error('Error fetching hotels:', err)
    }
}

async function completeHotelBooking() {
    let userId = sessionStorage.getItem('userId');
    if (!userId) {
        userId = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        sessionStorage.setItem('userId', userId);
    }

    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const bookings = cart.map(item => {
        const bookingNumber = Date.now() + Math.floor(Math.random() * 1000);
        const totalPrice = item.pricePerNight * item.rooms;
        return {
            userId,
            bookingNumber,
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
        };
    });

    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookings })
        });

        if (!response.ok) {
            const text = await response.text(); // can be HTML
            console.error('Server error:', text);
            return;
        }

        const result = await response.json();

        if (result.success) {
            sessionStorage.removeItem('cart');
            alert('Booking successful! Your booking numbers: ' + bookings.map(b => b.bookingNumber).join(', '));
        } else {
            alert('Booking failed: ' + result.error);
        }
    } catch (err) {
        console.error(err);
        alert('Error connecting to server.');
    }
}

async function getFlightDetails(id) {
    try {
        const response = await fetch('/api/flights')
        const flights = await response.json()
        return flights.find(flight => flight.flightId == id)

        
    } catch (err) {
        console.error('Error fetching flights:', err)
    }
}

function createFlightObj(id, origin, dest, depdate, arrdate, deptime, arrtime, price, seats, adults, children, infants) {
    const trFlight = document.createElement('tr')
    trFlight.appendChild(createTextCell(id))
    trFlight.appendChild(createTextCell(origin))
    trFlight.appendChild(createTextCell(dest))
    trFlight.appendChild(createTextCell(depdate))
    trFlight.appendChild(createTextCell(arrdate))
    trFlight.appendChild(createTextCell(deptime))
    trFlight.appendChild(createTextCell(arrtime))
    trFlight.appendChild(createTextCell(price))
    trFlight.appendChild(createTextCell(seats))
    return trFlight
}

function createTextCell(text) {
    const divText = document.createElement('td')
    divText.textContent = text
    return divText
}

function createButtonCell(text) {
    const tdText = document.createElement('td')
    const buttonText = document.createElement('button')
    buttonText.textContent = text
    tdText.appendChild(buttonText)
    return tdText
}

function revealFlightLabels() {
    document.querySelector("#flight-button").classList.remove("hidden")
    document.querySelector("#flights-table").classList.remove("hidden")
}

function completeFlightBooking() {
    alert("incomplete")
}