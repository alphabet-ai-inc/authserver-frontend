export function Header({ jwtToken, handleLogin }) {
  if (jwtToken) return null;

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <button className="btn btn-success" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
