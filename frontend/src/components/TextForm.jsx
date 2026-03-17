import { useState } from 'react';

const TextForm = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!value.trim()) {
      setError('Please enter some text.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit(value);
      setValue('');
    } catch (err) {
      setError(err.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="content">New text</label>
        <textarea
          id="content"
          rows="3"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Write something useful..."
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Add text'}
        </button>
        {error ? <span className="error">{error}</span> : null}
      </div>
    </form>
  );
};

export default TextForm;
