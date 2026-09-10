import { useEffect, useRef, useState } from "react";
import "./index.css";
import CommandPalette from "./components/command-palette.jsx";
import MobileTabBar from "./components/mobile-tab-bar.jsx";
import Work from "./sections/work.jsx";
import Guestbook from "./sections/guestbook.jsx";
import HomePage from "./sections/home-page.jsx";
import { posts } from "./blog/index.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const socialIcons = { GitHub: faGithub, LinkedIn: faLinkedin, Email: faEnvelope };

const links = ["Blog", "Work", "Guestbook"];
const pageIds = ["hero", "blog", "work", "projects", "guestbook"];
const socialLinks = [
  { label: "GitHub", href: "https://github.com/mikaelskjonhaug" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mikaelskjonhaug" },
  { label: "Email", href: "mailto:mikaelsk@berkeley.edu" },
];

// eslint-disable-next-line react-refresh/only-export-components
export function getPageFromHash(hash) {
  const page = hash.slice(1);
  return pageIds.includes(page) ? page : "hero";
}

// eslint-disable-next-line react-refresh/only-export-components
export function getNavigationPage(activePage, page) {
  const nextPage = getPageFromHash(`#${page}`);
  return nextPage === activePage ? null : nextPage;
}

function Navbar({ activePage, onNavigate }) {
  const navLinks = ["Home Page", ...links];

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <span className="monogram" aria-label="ms.">
        <span>m</span>s<span>.</span>
      </span>
      <div className="nav-links">
        {navLinks.map((label, index) => {
          const page = label === "Home Page" ? "hero" : label.toLowerCase();

          return <button key={label} type="button" data-page={page} onClick={() => onNavigate(page)}>
            <span>./ {label}</span>
            <kbd>{index}</kbd>
          </button>;
        })}
      </div>
      <MobileTabBar activePage={activePage} onNavigate={onNavigate} />
      <CommandPalette links={links} socialLinks={socialLinks} onNavigate={onNavigate} />
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Mikael Skjonhaug</span>
      <div className="site-footer-social" aria-label="Social links">
        {socialLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label === "Email" ? "Email Mikael" : label}
          >
            <FontAwesomeIcon icon={socialIcons[label]} />
          </a>
        ))}
      </div>
    </footer>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState(() => (
    typeof window === "undefined" ? "hero" : getPageFromHash(window.location.hash)
  ));
  const mainRef = useRef(null);

  useEffect(() => {
    const syncPage = () => setActivePage(getPageFromHash(window.location.hash));

    window.addEventListener("hashchange", syncPage);
    window.addEventListener("popstate", syncPage);
    return () => {
      window.removeEventListener("hashchange", syncPage);
      window.removeEventListener("popstate", syncPage);
    };
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [activePage]);

  const navigate = (page) => {
    const nextPage = getNavigationPage(activePage, page);
    if (!nextPage) return;

    const url = nextPage === "hero" ? `${window.location.pathname}${window.location.search}` : `#${nextPage}`;

    window.history.pushState(null, "", url);
    setActivePage(nextPage);
  };

  return (
    <div id="top">
      <div className="site-shell">
        <Navbar activePage={activePage} onNavigate={navigate} />
        <main ref={mainRef} id="page-content" className="site-main">
          {activePage === "hero" && <>
            <HomePage name="mikaelskjonhaug" />
          </>}
          {activePage === "blog" && <section id="blog" className="portfolio-section">
            <div className="section-layout">
              <header className="section-header">
                <span>blog.db</span>
                <h2>Blog</h2>
              </header>
              <table className="blog-table">
                <thead>
                  <tr>
                    <th scope="col">id</th>
                    <th scope="col">title</th>
                    <th scope="col">date</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td className="section-empty" colSpan={3}>
                        0 rows
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id}>
                        <td colSpan={3}>
                          <details className="blog-post">
                            <summary>
                              <span className="blog-cell-id">{post.id}</span>
                              <span className="blog-cell-title">{post.title}</span>
                              <span className="blog-cell-date">{post.date}</span>
                            </summary>
                            <p className="blog-body">{post.body}</p>
                          </details>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>}
          {activePage === "work" && <section id="work" className="portfolio-section">
            <Work />
          </section>}
          {activePage === "projects" && <section id="projects" className="portfolio-section">
            <Work />
          </section>}
          {activePage === "guestbook" && <section id="guestbook" className="portfolio-section">
            <Guestbook />
          </section>}
          <Footer />
        </main>
      </div>
    </div>
  );
}
