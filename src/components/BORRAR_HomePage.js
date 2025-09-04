import { useAuthSession } from '../hooks/useAuthSession';

export function HomePage({ backendUrl }) {
  const {
    jwtToken,
    sessionChecked,
    setIsLoggedInExplicitly
  } = useAuthSession(backendUrl);

  if (!sessionChecked) return <div>Loading session...</div>;

  return (
    <div>
      {!jwtToken ? (
        <button onClick={() => setIsLoggedInExplicitly(true)}>Login</button>
      ) : (
        <div>Welcome back!</div>
      )}
    </div>
  );
}
