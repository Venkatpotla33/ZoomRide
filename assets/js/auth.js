/**
 * Authentication Service
 * Handles Login, Signup, Logout and Session Management
 */

class AuthService {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.updateUI();
    }

    register(name, email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.find(u => u.email === email)) {
            return { success: false, message: "Email already registered" };
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // In real app, hash this!
            role: 'user'
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true, message: "Registration successful! Please login." };
    }

    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = { ...user };
            delete this.currentUser.password; // Don't store password in session
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUI();
            return { success: true, user: this.currentUser };
        }

        return { success: false, message: "Invalid email or password" };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        window.location.href = 'index.html';
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    updateUI() {
        const navLinks = document.getElementById('nav-links');
        if (!navLinks) return;

        if (this.currentUser) {
            let adminLink = this.isAdmin() ? `<li class="nav-item"><a class="nav-link" href="admin.html">Admin</a></li>` : '';

            navLinks.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="cars.html">Find Cars</a></li>
                ${adminLink}
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                        ${this.currentUser.name}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="bookings.html">My Bookings</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="authService.logout()">Logout</a></li>
                    </ul>
                </li>
            `;
        } else {
            navLinks.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="cars.html">Find Cars</a></li>
                <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
                <li class="nav-item"><a class="nav-link btn btn-success ms-2 text-white" href="signup.html">Sign Up</a></li>
            `;
        }
    }
}

const authService = new AuthService();
