export default function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ display: "block", marginBottom: 6 }}>{label}</label>}
      <input {...props} style={{ width: "100%" }} />
    </div>
  );
}