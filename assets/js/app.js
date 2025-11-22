/**
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Featured Cars on Home Page
    const featuredContainer = document.getElementById('featured-cars-container');
    if (featuredContainer) {
        loadFeaturedCars();
    }

    // Handle Search Form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const location = document.getElementById('location').value;
            const pickup = document.getElementById('pickup-date').value;
            const dropoff = document.getElementById('dropoff-date').value;

            // Redirect to cars page with query params
            window.location.href = `cars.html?location=${location}&pickup=${pickup}&dropoff=${dropoff}`;
        });
    }
});

function loadFeaturedCars() {
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    const featuredContainer = document.getElementById('featured-cars-container');

    // Show top 3 cars
    const featuredCars = cars.slice(0, 3);

    featuredContainer.innerHTML = featuredCars.map(car => `
        <div class="col-md-4 mb-4">
            <div class="card car-card h-100 border-0 shadow-sm">
                <img src="${car.image}" class="card-img-top" alt="${car.name}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${car.name}</h5>
                        <span class="badge bg-success">₹${car.pricePerHour}/hr</span>
                    </div>
                    <p class="text-muted small mb-2">${car.type} • ${car.fuelType} • ${car.transmission}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="text-warning">
                            <i class="bi bi-star-fill"></i> ${car.rating}
                        </div>
                        <a href="cars.html" class="btn btn-outline-success btn-sm">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}
