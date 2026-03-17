import { useState } from 'react';

const TextList = ({ items, onEdit, onDelete }) => {
  return (
    <div className="list">
      {items.length === 0 ? (
        <p className="muted">No text entries yet. Add one above.</p>
      ) : (
        items.map((item) => (
          <TextRow
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

const TextRow = ({ item, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!value.trim()) {
      setError('Content cannot be empty.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onEdit(item.id, value);
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="list-item">
      <div>
        {editing ? (
          <textarea
            rows="3"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        ) : (
          <p>{item.content}</p>
        )}
        <div className="meta">
          <span>Created: {new Date(item.createdAt).toLocaleString()}</span>
          <span>Updated: {new Date(item.updatedAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="row-actions">
        {editing ? (
          <button type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        ) : (
          <button type="button" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
        <button type="button" className="danger" onClick={() => onDelete(item.id)}>
          Delete
        </button>
        {error ? <span className="error">{error}</span> : null}
      </div>
    </article>
  );
};

export default TextList;
