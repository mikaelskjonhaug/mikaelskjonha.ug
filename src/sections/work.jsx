import EntryDropdown from "../components/entry-dropdown";
import hortusLogo from "../assets/Hortus-logo.webp";
import washingtonLogo from "../assets/Washington_logo.webp";

const experiences = [
  {
    logo: hortusLogo,
    title: "Software Engineer",
    company: "Hortus AI",
    overview: "Lead Engineer primarily working on the backend for Hortus Trellis.",
    duration: "Aug 2025 — Present",
    link: "https://trellis.hortus.ai/",
  },
  {
    logo: washingtonLogo,
    title: "Assistant Coach",
    company: "Washington Justice",
    overview: "Assistant Coach for the Overwatch League team, Washington Justice.",
    duration: "Aug 2018 — Dec 2019",
    link: "https://www.washington-justice.com/",
  },
];

export default function Work() {
  return (
    <div className="section-layout">
      <header className="section-header">
        <span>work.json</span>
        <h2>Work</h2>
      </header>
      <div className="entries">
        {experiences.map((experience) => (
          <EntryDropdown
            key={experience.company}
            name="experience"
            logo={experience.logo}
            title={experience.company}
            type={experience.title}
            typeKey="role"
            tools={experience.duration}
            toolsKey="duration"
            overview={experience.overview}
            link={experience.link}
            linkLabel={`Visit ${experience.company}`}
          />
        ))}
      </div>
    </div>
  );
}
