export function getToken(){
    return localStorage.getItem("token");
}

export function getEmail(){
    return localStorage.getItem("email");
}


export function isLoggedIn(){
    return !!getToken();
}

export function getAuth(){
    const token = getToken();
    const email = getEmail();

    return{
        isLoggedIn: isLoggedIn(),
        token: token || "",
        email: email || "",
    };
}

export function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("email");
}

export async function LoginUser(email, password) {
    const res = await fetch("http://127.0.0.1:8000/api/auth/login/",{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email, password}),
    });
    
    const data = await res.json();

    if (!res.ok) {
        throw new Error (data.detail || "Neuspesan login!");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    window.dispatchEvent(new Event("auth"));

    return data;



}