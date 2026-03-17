import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createText,
  deleteText,
  fetchTexts,
  loginUser,
  registerUser,
  updateText
} from './api/textApi.js';
import TextForm from './components/TextForm.jsx';
import TextList from './components/TextList.jsx';
import AuthPanel from './components/AuthPanel.jsx';

const DEFAULT_LIMIT = 8;

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail') || '');

  const [texts, setTexts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const result = await fetchTexts({
        token,
        page: pagination.page,
        limit: pagination.limit,
        q: search
      });
      setTexts(result.items);
      setPagination((prev) => ({
        ...prev,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }));
      setError('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [token, pagination.page, pagination.limit, search]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const stats = useMemo(() => {
    const total = pagination.total;
    const lastUpdated = texts[0]?.updatedAt ? new Date(texts[0].updatedAt).toLocaleString() : '—';
    return { total, lastUpdated };
  }, [pagination.total, texts]);

  const handleLogin = async (email, password) => {
    const result = await loginUser(email, password);
    setToken(result.token);
    setUserEmail(result.user.email);
    localStorage.setItem('token', result.token);
    localStorage.setItem('userEmail', result.user.email);
  };

  const handleRegister = async (email, password) => {
    await registerUser(email, password);
    return handleLogin(email, password);
  };

  const handleLogout = () => {
    setToken('');
    setUserEmail('');
    setTexts([]);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  };

  const handleCreate = async (content) => {
    await createText(token, content);
    await refresh();
  };

  const handleUpdate = async (id, content) => {
    await updateText(token, id, content);
    await refresh();
  };

  const handleDelete = async (id) => {
    await deleteText(token, id);
    await refresh();
  };

  const handleSearch = (value) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearch(value);
  };

  const handlePageChange = (direction) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(Math.max(prev.page + direction, 1), Math.max(prev.totalPages, 1))
    }));
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>MERN Text CRUD</h1>
          <p className="subtitle">Clean architecture demo with auth, pagination, and search.</p>
        </div>
        <div className="stats">
          <div>
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>
          <div>
            <span>Last updated</span>
            <strong>{stats.lastUpdated}</strong>
          </div>
        </div>
      </header>

      {!token ? (
        <section className="card">
          <AuthPanel onLogin={handleLogin} onRegister={handleRegister} />
        </section>
      ) : (
        <>
          <section className="card auth-bar">
            <div>
              <strong>{userEmail}</strong>
              <span className="muted">Signed in</span>
            </div>
            <button type="button" className="ghost" onClick={handleLogout}>
              Logout
            </button>
          </section>

          <section className="card">
            <TextForm onSubmit={handleCreate} />
          </section>

          <section className="card">
            <div className="toolbar">
              <input
                className="search"
                type="search"
                placeholder="Search text..."
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
              />
              <div className="pagination">
                <button type="button" onClick={() => handlePageChange(-1)} disabled={pagination.page <= 1}>
                  Prev
                </button>
                <span>
                  Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
                </span>
                <button
                  type="button"
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </button>
              </div>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <TextList items={texts} onEdit={handleUpdate} onDelete={handleDelete} />
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default App;
