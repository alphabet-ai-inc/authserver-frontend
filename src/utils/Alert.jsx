export function Alert({ message, className }) {
  if (className === "d-none") return null;

  return (
    <div className={`alert ${className}`} role="alert">
      {message}
    </div>
  );
}
