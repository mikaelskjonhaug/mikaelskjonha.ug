import { useEffect, useRef, useState } from "react";
import { Command } from "lucide-react";
import Guestbook from "../sections/guestbook.jsx";
import logo from "../assets/new_favicon.svg";

// eslint-disable-next-line react-refresh/only-export-components
export function getNavigationAction(event, linkCount) {
  if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
    return "menu";
  }

  if (event.key === "Escape") return "close";

  const tag = event.target?.tagName;

  if (event.target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
    return null;
  }

  if (event.key === "0" && !event.metaKey && !event.ctrlKey && !event.altKey) {
    return "top";
  }

  if (event.metaKey || event.ctrlKey || event.altKey || !/^[1-9]$/.test(event.key)) {
    return null;
  }

  const index = Number(event.key) - 1;
  return index < linkCount ? index : null;
}

export default function CommandPalette({ links, socialLinks }) {
  const dialogRef = useRef(null);
  const guestbookDialogRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState(null);
  const navigationItems = [
    { label: "Hero", href: "#top", shortcut: 0 },
    ...links.map((label, index) => ({
      label,
      href: `#${label.toLowerCase()}`,
      shortcut: index + 1,
    })),
  ];
  const matches = ({ label }) => label.toLowerCase().includes(query.trim().toLowerCase());
  const navigationResults = navigationItems.filter(matches);
  const socialResults = socialLinks.filter(matches);
  const showGuestbookAction = matches({ label: "Write Guestbook Entry" });
  const shortcutModifier = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    ? "⌘"
    : "Ctrl";

  useEffect(() => {
    const onKeyDown = (event) => {
      const action = getNavigationAction(event, links.length);

      if (action === "menu") {
        event.preventDefault();
        if (guestbookDialogRef.current.open) guestbookDialogRef.current.close();
        if (!dialogRef.current.open) {
          setQuery("");
          dialogRef.current.showModal();
        }
        window.requestAnimationFrame(() => inputRef.current?.focus());
      } else if (action === "close" && dialogRef.current.open) {
        event.preventDefault();
        dialogRef.current.close();
      } else if (action === "top") {
        document.querySelector("#top")?.scrollIntoView();
        if (dialogRef.current.open) dialogRef.current.close();
      } else if (typeof action === "number") {
        document.querySelector(`#${links[action].toLowerCase()}`)?.scrollIntoView();
        if (dialogRef.current.open) dialogRef.current.close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [links]);

  const close = () => dialogRef.current.close();
  const open = () => {
    if (!dialogRef.current.open) {
      if (guestbookDialogRef.current.open) guestbookDialogRef.current.close();
      setQuery("");
      dialogRef.current.showModal();
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  };
  const openActiveResult = (event) => {
    if (event.key === "Enter") {
      // ponytail: hovered link wins, else first result
      const target = hovered
        ? resultsRef.current?.querySelector(`[data-command-item="${CSS.escape(hovered)}"]`)
        : resultsRef.current?.querySelector("[data-command-item]");
      if (target) {
        event.preventDefault();
        target.click();
      }
    }
  };

  return (
    <>
      <button type="button" className="command-trigger" onClick={open}>
        <img className="command-trigger-logo" src={logo} alt="" />
        <span className="command-trigger-label">open command palette</span>
        <span className="command-trigger-label-mobile">open command palette</span>
        <span className="command-trigger-shortcut" aria-label={`${shortcutModifier} plus K`}>
          <kbd>{shortcutModifier === "⌘" ? <Command aria-hidden="true" /> : shortcutModifier}</kbd>
          <kbd>K</kbd>
        </span>
      </button>
      <dialog
        ref={dialogRef}
        className="command-menu"
        aria-label="Quick navigation"
        onClick={(event) => event.target === event.currentTarget && close()}
      >
        <div className="command-panel">
          <header className="command-header">
            <label className="command-search">
              <strong>&gt;_</strong>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHovered(null);
                }}
                onKeyDown={openActiveResult}
                placeholder="Search commands"
                aria-label="Search commands"
              />
            </label>
            <button type="button" onClick={close} aria-label="Close quick navigation">
              esc
            </button>
          </header>
          <nav ref={resultsRef} className="command-links" aria-label="Command navigation">
            {showGuestbookAction && (
              <>
                <span className="command-group-label command-group-label-first">actions</span>
                <button
                  type="button"
                  data-command-item="write-guestbook-entry"
                  onClick={() => {
                    close();
                    guestbookDialogRef.current.showModal();
                  }}
                  onMouseEnter={() => setHovered("write-guestbook-entry")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="command-social-mark" aria-hidden="true">+</span>
                  <span>Write Guestbook Entry</span>
                  <span aria-hidden="true">↵</span>
                </button>
              </>
            )}
            {socialResults.length > 0 && (
              <span className="command-group-label">connect</span>
            )}
            {socialResults.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                data-command-item={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={close}
                onMouseEnter={() => setHovered(href)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="command-social-mark" aria-hidden="true">↗</span>
                <span>{label}</span>
                <span aria-hidden="true">↵</span>
              </a>
            ))}
            {navigationResults.length > 0 && (
              <span className="command-group-label">navigate</span>
            )}
            {navigationResults.map(({ label, href, shortcut }) => (
              <a
                key={label}
                href={href}
                data-command-item={href}
                onClick={close}
                onMouseEnter={() => setHovered(href)}
                onMouseLeave={() => setHovered(null)}
              >
                <kbd>{shortcut}</kbd>
                <span>{label}</span>
                <span aria-hidden="true">↵</span>
              </a>
            ))}
            {!showGuestbookAction && navigationResults.length === 0 && socialResults.length === 0 && (
              <p className="command-empty" role="status">No commands found</p>
            )}
          </nav>
        </div>
      </dialog>
      <dialog
        ref={guestbookDialogRef}
        className="command-menu guestbook-dialog"
        aria-label="Write guestbook entry"
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      >
        <div className="command-panel guestbook-dialog-panel">
          <header className="command-header">
            <strong>&gt;_ write guestbook entry</strong>
            <button type="button" onClick={() => guestbookDialogRef.current.close()} aria-label="Close guestbook">
              esc
            </button>
          </header>
          <div className="guestbook-dialog-body">
            <Guestbook />
          </div>
        </div>
      </dialog>
    </>
  );
}
