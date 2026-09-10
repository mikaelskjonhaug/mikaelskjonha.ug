import { useEffect, useState } from "react";
import "./index.css";
import CommandMenu from "./components/command-menu.jsx";
import Experience from "./sections/experience.jsx";
import Guestbook from "./sections/guestbook.jsx";
import Hero from "./sections/hero.jsx";
import Projects from "./sections/projects.jsx";
import Skills from "./sections/skills.jsx";
import { posts } from "./blog/index.js";

const links = ["Blog", "Experience", "Projects", "Skills", "Guestbook"];
const socialLinks = [
  { label: "GitHub", href: "https://github.com/mikaelskjonhaug" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mikaelskjonhaug" },
  { label: "Email", href: "mailto:mikaelsk@berkeley.edu" },
];

function Navbar() {
  const navLinks = ["Hero", ...links];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav className={`site-nav${scrolled ? " is-scrolled" : ""}`} aria-label="Primary navigation">
      <span className="monogram" aria-label="ms.">
        <span>m</span>s<span>.</span>
      </span>
      <div className="nav-links">
        {navLinks.map((label, index) => (
          <a key={label} href={label === "Hero" ? "#top" : `#${label.toLowerCase()}`}>
            <span>./ {label}</span>
            <kbd>{index}</kbd>
          </a>
        ))}
      </div>
      <CommandMenu links={links} socialLinks={socialLinks} />
    </nav>
  );
}
export default function App() {
  return (
    <div id="top">
      <div className="site-shell">
        <Navbar />
        <main className="site-main">
          <Hero name="mikaelskjonhaug" socialLinks={socialLinks} />
          <section id="blog" className="portfolio-section">
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
          </section>
          <section id="experience" className="portfolio-section">
            <Experience />
          </section>
          <section id="projects" className="portfolio-section">
            <Projects />
          </section>
          <section id="skills" className="portfolio-section">
            <Skills />
          </section>
          <section id="guestbook" className="portfolio-section">
            <Guestbook />
          </section>
          <footer className="site-footer">
            <span>© {new Date().getFullYear()} Mikael Skjonhaug</span>
            <a href="#top">Back to top ↑</a>
          </footer>
        </main>
      </div>
    </div>
  );
}
