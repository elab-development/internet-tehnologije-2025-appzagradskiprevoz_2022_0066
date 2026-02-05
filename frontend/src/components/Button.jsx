export default function Button({ children, classname = "", onClick }) {
    return (
        <button
            className="{classname}"
            //type={type}
            onClick={onClick}
        >
            {children}
        </button>
    );
}