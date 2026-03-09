export default function Button({ children, classname = "", onClick }) {
    return (
        <button
            className="{classname}"
            onClick={onClick}
        >
            {children}
        </button>
    );
}