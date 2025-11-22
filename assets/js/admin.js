/**
 * Admin Dashboard Logic
 */

// Global variables
let carModal;
let deleteModal;
let carToDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    if (!authService.isAdmin()) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize Modals
    carModal = new bootstrap.Modal(document.getElementById('addCarModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));

    loadAdminCars();
    loadAdminBookings();
    setupCarForm();
});

function loadAdminCars() {
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    const tableBody = document.getElementById('admin-cars-table');

    tableBody.innerHTML = '';

    cars.forEach(car => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${car.image}" alt="${car.name}" width="80" class="rounded"></td>
            <td class="fw-bold">${car.name}</td>
            <td>${car.type}</td>
            <td>₹${car.pricePerHour}</td>
            <td class="text-capitalize">${car.location}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editCar(${car.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete(${car.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function loadAdminBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('admin-bookings-table');

    if (!tableBody) return;

    tableBody.innerHTML = '';

    bookings.reverse().forEach(booking => {
        const car = cars.find(c => c.id === booking.carId);
        const user = users.find(u => u.id === booking.userId);
        const tr = document.createElement('tr');

        const statusBadge = booking.status === 'Confirmed' ? 'bg-success' : 'bg-warning';

        tr.innerHTML = `
            <td>
                <div class="fw-bold">${user ? user.name : 'Unknown'}</div>
                <small class="text-muted">${user ? user.email : ''}</small>
            </td>
            <td>${car ? car.name : 'Unknown Car'}</td>
            <td>
                <small>${new Date(booking.pickupDate).toLocaleDateString()} - ${new Date(booking.dropoffDate).toLocaleDateString()}</small>
            </td>
            <td class="fw-bold">₹${booking.amount}</td>
            <td><span class="badge ${statusBadge}">${booking.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteBooking(${booking.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function setupCarForm() {
    const form = document.getElementById('car-form');

    // Reset form when modal opens for adding
    document.getElementById('addCarModal').addEventListener('show.bs.modal', (e) => {
        if (!e.relatedTarget) return; // If triggered by JS (edit), don't reset
        if (e.relatedTarget.getAttribute('data-bs-target')) { // If triggered by button
            form.reset();
            document.getElementById('car-id').value = '';
            document.getElementById('carModalTitle').textContent = 'Add New Car';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('car-id').value;
        const cars = JSON.parse(localStorage.getItem('cars')) || [];

        const newCar = {
            id: id ? parseInt(id) : Date.now(),
            name: document.getElementById('car-name').value,
            type: document.getElementById('car-type').value,
            fuelType: document.getElementById('car-fuel').value,
            transmission: document.getElementById('car-transmission').value,
            seats: parseInt(document.getElementById('car-seats').value),
            pricePerHour: parseInt(document.getElementById('car-price').value),
            location: document.getElementById('car-location').value,
            image: document.getElementById('car-image').value,
            rating: 4.5 // Default rating
        };

        if (id) {
            // Update existing
            const index = cars.findIndex(c => c.id == id);
            if (index !== -1) {
                cars[index] = { ...cars[index], ...newCar };
            }
        } else {
            // Add new
            cars.push(newCar);
        }

        localStorage.setItem('cars', JSON.stringify(cars));
        carModal.hide();
        loadAdminCars();
        toastService.show(id ? "Car updated successfully!" : "Car added successfully!");
    });

    // Setup Delete Confirmation
    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        if (carToDeleteId) {
            let cars = JSON.parse(localStorage.getItem('cars')) || [];
            cars = cars.filter(c => c.id !== carToDeleteId);
            localStorage.setItem('cars', JSON.stringify(cars));
            deleteModal.hide();
            loadAdminCars();
            toastService.show("Car deleted successfully!");
        }
    });
}

function editCar(id) {
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    const car = cars.find(c => c.id === id);

    if (car) {
        document.getElementById('car-id').value = car.id;
        document.getElementById('car-name').value = car.name;
        document.getElementById('car-type').value = car.type;
        document.getElementById('car-fuel').value = car.fuelType;
        document.getElementById('car-transmission').value = car.transmission;
        document.getElementById('car-seats').value = car.seats;
        document.getElementById('car-price').value = car.pricePerHour;
        document.getElementById('car-location').value = car.location;
        document.getElementById('car-image').value = car.image;

        document.getElementById('carModalTitle').textContent = 'Edit Car';
        carModal.show();
    }
}

function confirmDelete(id) {
    carToDeleteId = id;
    deleteModal.show();
}

function deleteBooking(id) {
    if (confirm("Are you sure you want to delete this booking?")) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadAdminBookings();
        toastService.show("Booking deleted successfully!");
    }
}

// Expose to window
window.editCar = editCar;
window.confirmDelete = confirmDelete;
window.deleteBooking = deleteBooking;
