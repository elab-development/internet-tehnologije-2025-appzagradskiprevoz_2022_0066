import { API_BASE } from "./services/api";


export function getToken() {
    return localStorage.getItem("token");
}

export function getEmail() {
    return localStorage.getItem("email");
}

export function isLoggedIn() {
    return !!getToken();
}

export function getAuth() {
    const token = getToken();
    const email = getEmail();

    return {
        isLoggedIn: isLoggedIn(),
        token: token || "",
        email: email || "",
    };
}

export async function logout() {
    const token = getToken();

    if (token) {
        try {
            await fetch(`${API_BASE}/auth/logout/`, {
                method: "POST",
                headers: { Authorization: `Token ${token}` },
            });
        } catch (e) { }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.dispatchEvent(new Event("auth"));
}

export async function LoginUser(email, password) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.detail || "Neuspesan login!");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email || email);
    window.dispatchEvent(new Event("auth"));

    return data;
}

export async function RegisterUser(email, password) {
    const res = await fetch(`${API_BASE}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        
        const msg =
            data.detail ||
            data.email?.[0] ||
            data.password?.[0] ||
            "Neuspesna registracija!";
        throw new Error(msg);
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email || email);
    window.dispatchEvent(new Event("auth"));

    return data;
}