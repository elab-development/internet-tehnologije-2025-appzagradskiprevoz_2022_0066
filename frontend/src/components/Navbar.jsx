import {Link} from "react-router-dom"

export default function Navbar(){
    return (
        <nav 
            style={{
                display: "flex",
                gap: 16,
                padding: 16,
                borderBottom: "1px solid #ddd"
            }}
        >
            <Link to = "/">Home</Link>
            <Link to = "/lines">Lines</Link>
            <Link to = "/login">Login</Link>

        </nav>
    )


}