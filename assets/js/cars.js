/**
 * Cars Listing & Booking Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    loadCars();
    setupFilters();
    setupBooking();

    // Check for query params from Home page
    const urlParams = new URLSearchParams(window.location.search);
    const locationParam = urlParams.get('location');
    const pickupParam = urlParams.get('pickup');
    const dropoffParam = urlParams.get('dropoff');

    if (locationParam) {
        document.getElementById('filter-location').value = locationParam;
        filterCars();
    }

    if (pickupParam) document.getElementById('booking-pickup').value = pickupParam;
    if (dropoffParam) document.getElementById('booking-dropoff').value = dropoffParam;
});

function loadCars(carsToLoad = null) {
    const cars = carsToLoad || JSON.parse(localStorage.getItem('cars')) || [];
    const grid = document.getElementById('cars-grid');
    const noResults = document.getElementById('no-results');

    grid.innerHTML = '';

    if (cars.length === 0) {
        noResults.classList.remove('d-none');
        return;
    } else {
        noResults.classList.add('d-none');
    }

    cars.forEach(car => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card car-card h-100 border-0 shadow-sm">
                <img src="${car.image}" class="card-img-top" alt="${car.name}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${car.name}</h5>
                        <span class="badge bg-success">₹${car.pricePerHour}/hr</span>
                    </div>
                    <p class="text-muted small mb-2">
                        <i class="bi bi-geo-alt-fill"></i> <span class="text-capitalize">${car.location}</span> • 
                        ${car.type} • ${car.fuelType}
                    </p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="text-warning">
                            <i class="bi bi-star-fill"></i> ${car.rating}
                        </div>
                        <button class="btn btn-success w-100 ms-3" onclick="openBookingModal(${car.id})">Book Now</button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });
}

function setupFilters() {
    const form = document.getElementById('filter-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        filterCars();
    });
}

function filterCars() {
    const location = document.getElementById('filter-location').value.toLowerCase();
    const type = document.getElementById('filter-type').value;
    const fuel = document.getElementById('filter-fuel').value;

    let cars = JSON.parse(localStorage.getItem('cars')) || [];

    if (location) {
        cars = cars.filter(car => car.location.toLowerCase() === location);
    }
    if (type) {
        cars = cars.filter(car => car.type === type);
    }
    if (fuel) {
        cars = cars.filter(car => car.fuelType === fuel);
    }

    loadCars(cars);
}

// Booking Logic
let selectedCarId = null;
const carDetailsModal = new bootstrap.Modal(document.getElementById('carDetailsModal'));

function openBookingModal(carId) {
    if (!authService.isAuthenticated()) {
        // Save return URL and redirect to login
        window.location.href = 'login.html';
        return;
    }

    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    const car = cars.find(c => c.id === carId);

    if (!car) return;

    selectedCarId = carId;

    // Populate Modal
    document.getElementById('modal-car-name').textContent = car.name;
    document.getElementById('modal-car-image').src = car.image;
    document.getElementById('modal-car-price').textContent = car.pricePerHour;
    document.getElementById('modal-car-type').textContent = car.type;
    document.getElementById('modal-car-fuel').textContent = car.fuelType;
    document.getElementById('modal-car-transmission').textContent = car.transmission;
    document.getElementById('modal-car-seats').textContent = car.seats;
    document.getElementById('modal-car-location').textContent = car.location;
    document.getElementById('modal-car-rating').textContent = car.rating;
    document.getElementById('modal-car-id').value = car.id;

    carDetailsModal.show();
}

// Payment & Booking Logic
let pendingBooking = null;
const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
const processingModal = new bootstrap.Modal(document.getElementById('processingModal'));
const bookingSuccessModal = new bootstrap.Modal(document.getElementById('bookingSuccessModal'));

function setupBooking() {
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const pickup = document.getElementById('booking-pickup').value;
        const dropoff = document.getElementById('booking-dropoff').value;

        if (!pickup || !dropoff) {
            toastService.show("Please select both pick-up and drop-off dates", "error");
            return;
        }

        // Calculate Duration and Price
        const start = new Date(pickup);
        const end = new Date(dropoff);
        const hours = Math.abs(end - start) / 36e5; // Hours difference

        const cars = JSON.parse(localStorage.getItem('cars')) || [];
        const car = cars.find(c => c.id === selectedCarId);
        const totalAmount = Math.ceil(hours * car.pricePerHour);

        // Store pending booking
        pendingBooking = {
            id: Date.now(),
            userId: authService.currentUser.id,
            carId: selectedCarId,
            pickupDate: pickup,
            dropoffDate: dropoff,
            amount: totalAmount,
            status: 'Pending Payment',
            timestamp: new Date().toISOString()
        };

        // Show Payment Modal
        document.getElementById('payment-amount').textContent = `₹${totalAmount}`;
        carDetailsModal.hide();
        paymentModal.show();
    });

    // Handle Payment Submission
    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();

        paymentModal.hide();
        processingModal.show();

        // Simulate Payment Delay
        setTimeout(() => {
            processingModal.hide();

            // 90% Success Rate Simulation
            if (Math.random() > 0.1) {
                completeBooking();
            } else {
                toastService.show("Payment Failed! Please try again.", "error");
                paymentModal.show();
            }
        }, 2000);
    });
}

function completeBooking() {
    if (!pendingBooking) return;

    pendingBooking.status = 'Confirmed';

    // Save to LocalStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(pendingBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show Success
    bookingSuccessModal.show();
    pendingBooking = null;
}

// Expose functions to global scope for onclick handlers
window.openBookingModal = openBookingModal;
