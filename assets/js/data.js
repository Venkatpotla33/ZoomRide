/**
 * Mock Data for ZoomRide
 * Handles initialization of localStorage data
 */

const MOCK_CARS = [
    {
        id: 1,
        name: "Maruti Swift",
        type: "Hatchback",
        pricePerHour: 150,
        fuelType: "Petrol",
        transmission: "Manual",
        seats: 5,
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=60",
        location: "mumbai",
        rating: 4.5
    },
    {
        id: 2,
        name: "Hyundai Creta",
        type: "SUV",
        pricePerHour: 250,
        fuelType: "Diesel",
        transmission: "Automatic",
        seats: 5,
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=60",
        location: "mumbai",
        rating: 4.7
    },
    {
        id: 3,
        name: "Honda City",
        type: "Sedan",
        pricePerHour: 200,
        fuelType: "Petrol",
        transmission: "Automatic",
        seats: 5,
        image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=500&q=60",
        location: "delhi",
        rating: 4.6
    },
    {
        id: 4,
        name: "Mahindra Thar",
        type: "SUV",
        pricePerHour: 350,
        fuelType: "Diesel",
        transmission: "Manual",
        seats: 4,
        image: "https://images.unsplash.com/photo-1609520505218-742184325a24?auto=format&fit=crop&w=500&q=60",
        location: "bangalore",
        rating: 4.8
    },
    {
        id: 5,
        name: "Toyota Innova Crysta",
        type: "SUV",
        pricePerHour: 400,
        fuelType: "Diesel",
        transmission: "Automatic",
        seats: 7,
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=500&q=60",
        location: "hyderabad",
        rating: 4.9
    }
];

const MOCK_ADMIN = {
    name: "Admin User",
    email: "admin@zoomride.com",
    password: "admin", // In real app, this would be hashed
    role: "admin"
};

// Initialize Data
function initData() {
    if (!localStorage.getItem('cars')) {
        localStorage.setItem('cars', JSON.stringify(MOCK_CARS));
        console.log('Cars data initialized');
    }
    
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([MOCK_ADMIN]));
        console.log('Users data initialized');
    }

    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
        console.log('Bookings data initialized');
    }
}

// Run initialization
initData();
