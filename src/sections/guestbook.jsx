import { useEffect, useState } from "react";

const guestbookUrl = `${import.meta.env.VITE_BACKEND_URL}/guestbook`;
console.log(guestbookUrl)
export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(guestbookUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Guestbook request failed");
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEntries((current) => [
            ...current.filter((item) => item.local),
            ...data,
          ]);
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") setLoadFailed(true);
      });

    return () => controller.abort();
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const entry = data.get("entry").trim();
    const name = data.get("name").trim();
    const id = crypto.randomUUID();

    if (!entry) return;

    setEntries((current) => [
      { id, entry, name, created_at: new Date().toISOString(), local: true },
      ...current,
    ]);
    form.reset();

    fetch(guestbookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry, name }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Guestbook submission failed");
        setEntries((current) => current.map((item) =>
          item.id === id ? { ...item, local: false } : item
        ));
      })
      .catch(() => {
        setEntries((current) => current.map((item) =>
          item.id === id ? { ...item, failed: true } : item
        ));
      });
  };

  return (
    <div className="section-layout">
      <header className="section-header">
        <span>guestbook.log</span>
        <h2>Guestbook</h2>
      </header>
      <div className="guestbook-content">
        <form className="guestbook-form" onSubmit={submit}>
          <label>
            <span>name <small>(optional)</small></span>
            <input name="name" autoComplete="name" maxLength="35" placeholder="Your name" />
          </label>
          <label>
            <span>entry</span>
            <textarea name="entry" rows="3" required maxLength="228" placeholder="Leave a short note" />
          </label>
          <button type="submit">Submit <span aria-hidden="true"></span></button>
        </form>

        <div className="guestbook-feed" aria-live="polite">
          {loadFailed && (
            <p className="guestbook-notice">Previous entries are unavailable. You can still sign.</p>
          )}
          {!loadFailed && entries.length === 0 && (
            <p className="guestbook-notice">No entries yet. Leave the first one.</p>
          )}
          {entries.map((item) => (
            <article className="guestbook-entry" key={item.id}>
              <div className="guestbook-entry-body">
                {(item.name || item.created_at) && (
                  <header className="guestbook-entry-header">
                    {item.name && <strong>{item.name}</strong>}
                    {item.created_at && (
                      <time dateTime={item.created_at}>
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    )}
                  </header>
                )}
                <p>{item.entry}</p>
                {(item.local || item.failed) && (
                  <footer>
                    {item.local && !item.failed && <span>saving…</span>}
                    {item.failed && <span className="guestbook-error">not saved</span>}
                  </footer>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
