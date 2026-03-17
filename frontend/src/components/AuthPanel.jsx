import { useState } from 'react';

const AuthPanel = ({ onLogin, onRegister }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        await onRegister(email, password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
        <p className="muted">
          {mode === 'login'
            ? 'Sign in to manage your text entries.'
            : 'Register once to start saving text entries.'}
        </p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => setMode((prev) => (prev === 'login' ? 'register' : 'login'))}
          >
            {mode === 'login' ? 'Need an account?' : 'Have an account?'}
          </button>
          {error ? <span className="error">{error}</span> : null}
        </div>
      </form>
    </div>
  );
};

export default AuthPanel;
