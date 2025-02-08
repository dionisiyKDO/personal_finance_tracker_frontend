import { writable } from 'svelte/store';

export const user = writable<User | null>(null);

export interface User {
    username: string;
    token: string;
}

type LoginResponse = {
    token: string;
    error?: string;
}

// Function to log in
export async function login(username: string, password: string): Promise<boolean> {
    try {
        const response = await fetch('/api/auth/login/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
        });

		if (!response.ok) {
            const data = await response.json();
            const error = data.error || "Failed to fetch user info";
            console.log(error);
            return false; // Login failed
        }

		const data = await response.json() as LoginResponse;
		const receivedToken = data.token;

		const usr = { token: receivedToken, username: username };
		
		localStorage.setItem('token', usr.token);
		localStorage.setItem('username', usr.username);

		user.set({token: usr.token, username: usr.username});

		return true; // Login successful
        
    } catch (error) {
        console.error('Error during login:', error);
        return false; // Login failed
    }
}

// Function to initialize the token from localStorage
export function initializeToken(): void {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
        user.set({token: storedToken, username: storedUsername});
    }
}

// Function to log out
export function logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    user.set(null);
}
