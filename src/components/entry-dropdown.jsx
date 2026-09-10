const slugify = (s) => s.toLowerCase().replace(/\s+/g, "_");

function Row({ slug, field, comma, children }) {
  return (
    <div className="json-row" title={`${slug}.${field}`}>
      <span className="json-key">{field}</span>
      <span className="json-punct">:</span>
      <span className="json-value">
        {children}
        {comma && <span className="json-punct">,</span>}
      </span>
    </div>
  );
}

export default function EntryDropdown({ logo, title, type, typeKey = "type", tools, toolsKey = "tools", overview, link, linkLabel, name }) {
  const Logo = logo;
  const slug = slugify(title);

  return (
    <details className="entry json-entry" name={name}>
      <summary>
        <span className="json-brace">{"{"}</span>
        <span className="json-row json-row-head">
          <span className="json-key">logo</span>
          <span className="json-punct">:</span>
          <span className="json-logo" title={`${slug}.logo`}>
            {typeof Logo === "string"
              ? <img src={Logo} alt="" />
              : <span className="project-icon"><Logo aria-hidden="true" /></span>}
          </span>
          <span className="json-punct">,</span>
          <span className="json-key">title</span>
          <span className="json-punct">:</span>
          <span className="json-string" title={`${slug}.title`}>"{title}"</span>
          <span className="json-punct json-comma-head">,</span>
          <span className="json-fold" aria-hidden="true">…</span>
        </span>
        {/* Inside <summary> so it stays visible when collapsed; flex order
            below puts it under the expanded fields. */}
        <span className="json-brace json-brace-close" aria-hidden="true">{"}"}</span>
      </summary>

      <div
        className="entry-details"
        onClick={(event) => {
          if (!event.target.closest("a")) event.currentTarget.closest("details").open = false;
        }}
      >
        <Row slug={slug} field={typeKey} comma>
          <span className="json-string">"{type}"</span>
        </Row>

        <Row slug={slug} field={toolsKey} comma>
          {Array.isArray(tools) ? (
            <>
              <span className="json-punct">[</span>
              {tools.map((t, i) => (
                <span key={t}>
                  <span className="json-string">"{t}"</span>
                  {i < tools.length - 1 && <span className="json-punct">, </span>}
                </span>
              ))}
              <span className="json-punct">]</span>
            </>
          ) : (
            <span className="json-string">"{tools}"</span>
          )}
        </Row>

        <Row slug={slug} field="overview" comma={Boolean(link)}>
          <span className="json-string">"{overview}"</span>
        </Row>

        {link && (
          <Row slug={slug} field="link">
            <a href={link} target="_blank" rel="noopener noreferrer">
              {linkLabel} ↗
            </a>
          </Row>
        )}
      </div>
    </details>
  );
}
