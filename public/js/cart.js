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

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    remainingCart = cart.filter(item => item.type != 'hotel');
    cart = cart.filter(item => item.type === 'hotel');


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
            sessionStorage.setItem('cart', JSON.stringify(remainingCart));
            alert('Booking successful! Your booking numbers: ' + bookings.map(b => b.bookingNumber).join(', '));
            window.location.reload();
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

function createFlightObj(id, origin, dest, depdate, arrdate, deptime, arrtime, price, adults, children, infants) {
    const trFlight = document.createElement('tr')
    trFlight.appendChild(createTextCell(id))
    trFlight.appendChild(createTextCell(origin))
    trFlight.appendChild(createTextCell(dest))
    trFlight.appendChild(createTextCell(depdate))
    trFlight.appendChild(createTextCell(arrdate))
    trFlight.appendChild(createTextCell(deptime))
    trFlight.appendChild(createTextCell(arrtime))
    trFlight.appendChild(createTextCell(Math.round(10 *(price*adults + price*children*.7 + price*infants*.1))/10))
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

async function completeFlightBooking() {
    let userId = sessionStorage.getItem('userId');
    if (!userId) {
        userId = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        sessionStorage.setItem('userId', userId);
    }

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let flightCart = cart.filter(item => item.type === 'flight');
    let remainingCart = cart.filter(item => item.type !== 'flight');

    if (flightCart.length === 0) {
        alert("No flights in cart!");
        return;
    }

    const allPassengers = [];
    
    for (const flight of flightCart) {
        const totalPassengers = flight.adults + flight.children + flight.infants;
        const flightDetails = await getFlightDetails(flight.flightId);
        
        alert(`Please enter information for ${totalPassengers} passenger(s) for flight ${flight.flightId} (${flightDetails.origin} to ${flightDetails.destination})`);
        
        const passengers = [];
        
        // Collect info for adults
        for (let i = 0; i < flight.adults; i++) {
            const passenger = collectPassengerInfo(`Adult ${i + 1}`);
            if (!passenger) return; // User cancelled
            passenger.type = 'adult';
            passengers.push(passenger);
        }
        
        // Collect info for children
        for (let i = 0; i < flight.children; i++) {
            const passenger = collectPassengerInfo(`Child ${i + 1}`);
            if (!passenger) return; // User cancelled
            passenger.type = 'child';
            passengers.push(passenger);
        }
        
        // Collect info for infants
        for (let i = 0; i < flight.infants; i++) {
            const passenger = collectPassengerInfo(`Infant ${i + 1}`);
            if (!passenger) return; // User cancelled
            passenger.type = 'infant';
            passengers.push(passenger);
        }
        
        allPassengers.push({
            flightId: flight.flightId,
            passengers: passengers
        });
    }

    // Create bookings
    const bookings = flightCart.map((item, index) => {
        const bookingNumber = 'FL-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        const flightDetails = getFlightDetails(item.flightId);
        
        return flightDetails.then(details => {
            const totalPrice = details.price * item.adults + 
                             details.price * item.children * 0.7 + 
                             details.price * item.infants * 0.1;
            
            return {
                userId,
                bookingNumber,
                flightId: item.flightId,
                origin: details.origin,
                destination: details.destination,
                departureDate: details.departureDate,
                arrivalDate: details.arrivalDate,
                departureTime: details.departureTime,
                arrivalTime: details.arrivalTime,
                adults: item.adults,
                children: item.children,
                infants: item.infants,
                totalSeats: item.adults + item.children + item.infants,
                totalPrice: totalPrice,
                passengers: allPassengers[index].passengers
            };
        });
    });

    try {
        const resolvedBookings = await Promise.all(bookings);
        
        const response = await fetch('/api/flight-bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookings: resolvedBookings })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Server error:', text);
            alert('Booking failed. Please try again.');
            return;
        }

        const result = await response.json();

        if (result.success) {
            sessionStorage.setItem('cart', JSON.stringify(remainingCart));
            
            // Display booking confirmation
            let confirmationMsg = 'Flight booking successful!\n\n';
            resolvedBookings.forEach(booking => {
                confirmationMsg += `Booking Number: ${booking.bookingNumber}\n`;
                confirmationMsg += `Flight: ${booking.origin} to ${booking.destination}\n`;
                confirmationMsg += `Departure: ${booking.departureDate} at ${booking.departureTime}\n`;
                confirmationMsg += `Arrival: ${booking.arrivalDate} at ${booking.arrivalTime}\n`;
                confirmationMsg += `Total Price: $${booking.totalPrice.toFixed(2)}\n`;
                confirmationMsg += `Passengers:\n`;
                booking.passengers.forEach(p => {
                    confirmationMsg += `  - ${p.firstName} ${p.lastName} (${p.type})\n`;
                });
                confirmationMsg += '\n';
            });
            
            alert(confirmationMsg);
            window.location.reload();
        } else {
            alert('Booking failed: ' + result.error);
        }
    } catch (err) {
        console.error(err);
        alert('Error connecting to server.');
    }
}

function collectPassengerInfo(passengerLabel) {
    const firstName = prompt(`Enter first name for ${passengerLabel}:`);
    if (!firstName) return null;
    
    const lastName = prompt(`Enter last name for ${passengerLabel}:`);
    if (!lastName) return null;
    
    const dob = prompt(`Enter date of birth for ${passengerLabel} (YYYY-MM-DD):`);
    if (!dob) return null;
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dob)) {
        alert('Invalid date format. Please use YYYY-MM-DD');
        return null;
    }
    
    const ssn = prompt(`Enter SSN for ${passengerLabel} (XXX-XX-XXXX):`);
    if (!ssn) return null;
    
    // Validate SSN format
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
    if (!ssnRegex.test(ssn)) {
        alert('Invalid SSN format. Please use XXX-XX-XXXX');
        return null;
    }
    
    return {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: dob,
        ssn: ssn
    };
}