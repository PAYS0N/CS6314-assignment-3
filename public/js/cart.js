window.onload = async function onwindowload() {
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
