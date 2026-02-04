export default function Button ({ children, type="button", onClick}){
    return(
        <button 
            type = {type}
            onClick = {onClick}
            style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #222",
                background: "#111",
                color: "white",
                cursor:"pointer",
            }}
        >
            {children}
        </button>
    );
}