import { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../lib/openai';

export function Settings() {
  const [apiKey, setApiKeyInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKeyInput(getApiKey() ?? '');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setApiKey('');
    setApiKeyInput('');
    setApiKey('');
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">API keys and preferences</p>
      </header>

      <div className="card" style={{ padding: '1.5rem', maxWidth: 480 }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 600 }}>
          OpenAI API key (for Compose with AI)
        </h2>
        <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
          Your key is stored only in this browser and never sent anywhere except to OpenAI when you use “Suggest task”.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="settings-api-key">
              API key
            </label>
            <input
              id="settings-api-key"
              type="password"
              className="form-input"
              value={apiKey}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              aria-describedby="settings-api-key-hint"
            />
            <p id="settings-api-key-hint" style={{ margin: '0.375rem 0 0', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
              Create a key at platform.openai.com
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
            {saved && (
              <span style={{ alignSelf: 'center', fontSize: '0.875rem', color: 'var(--color-done)' }}>
                Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
