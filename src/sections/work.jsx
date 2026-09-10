import { useState } from "react";
import { Baby } from "lucide-react";
import EntryDropdown from "../components/entry-dropdown";
import dungeonLogo from "../assets/dungeonart.jpg";
import hortusLogo from "../assets/Hortus-logo.webp";
import qwenLogo from "../assets/qwen_logo.png";
import riscvCpu from "../assets/RISCVcpu.jpg";
import snakeLogo from "../assets/snakelogo.jpg";
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

const projects = [
  {
    logo: riscvCpu,
    title: "RISC-V CPU",
    type: "Computer Architecture",
    tools: ["Logism", "Java"],
    overview: "2 stage pipelined CPU with hazard detection, branch prediction, and a custom instruction set.",
  },
  {
    logo: qwenLogo,
    title: "LLM Fine-tuning",
    type: "Model training",
    tools: ["Python", "PyTorch", "QWEN"],
    overview: "Full fine-tune of Qwen2.5-0.5B-Instruct on ML exam multiple-choice questions, improving accuracy 2x while preserving general reasoning.",
  },
  {
    logo: Baby,
    title: "Beebo",
    type: "Web App",
    tools: ["Python", "FastAPI", "React", "PostgreSQL"],
    overview: "Full stack web application.",
    link: "https://github.com/mikaelskjonhaug/Beebo",
  },
  {
    logo: snakeLogo,
    title: "Snake AI",
    type: "Reinforcement learning",
    tools: ["Python", "NumPy", "Pygame", "OpenAI Gym"],
    overview: "Trained DQN agent in custom OpenAI Gym Snake enviornment to achive high scores.",
    link: "https://github.com/mikaelskjonhaug/snake-ai",
  },
  {
    logo: dungeonLogo,
    title: "Procedural Roguelike",
    type: "Game systems",
    tools: ["Java"],
    overview: "Built a seed-driven 2D roguelike with procedural worlds, turn-based combat, and custom save-state serialization.",
  },
];

export default function Work() {
  const [showAll, setShowAll] = useState(false);

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
      <header className="section-header">
        <span>projects.json</span>
        <h2>Projects</h2>
      </header>
      <div className="entries">
        {projects.slice(0, 2).map((project) => (
          <EntryDropdown
            key={project.title}
            name="project"
            logo={project.logo}
            title={project.title}
            type={project.type}
            tools={project.tools}
            overview={project.overview}
            link={project.link}
            linkLabel="View project"
          />
        ))}
        <div
          className={`projects-more${showAll ? " is-open" : ""}`}
          aria-hidden={!showAll}
          inert={!showAll}
        >
          <div className="projects-more-inner">
            {projects.slice(2).map((project) => (
              <EntryDropdown
                key={project.title}
                name="project"
                logo={project.logo}
                title={project.title}
                type={project.type}
                tools={project.tools}
                overview={project.overview}
                link={project.link}
                linkLabel="View project"
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="projects-toggle"
          aria-expanded={showAll}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less ↑" : "Show more ↓"}
        </button>
      </div>
    </div>
  );
}
