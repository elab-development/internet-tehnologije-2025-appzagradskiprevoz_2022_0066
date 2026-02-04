export default function Input({label, type="text", value, onChange, placeholder}) {
    return (
        <div style = {{ marginBottom: 12}}>
            <label style = {{display:"block", marginBottom: 6}}>{label}</label>
            <input
                type = {type}
                value = {value}
                onChange = {onChange}
                placeholder = {placeholder}
                style = {{
                    padding: 10,
                    width: "100%",
                    borderRadius: 10,
                    border: "1px solid #ccc",
                }}
            />
        </div>
    );
}