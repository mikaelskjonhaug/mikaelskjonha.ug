import { useState } from "react";
import { Baby } from "lucide-react";
import EntryDropdown from "../components/entry-dropdown";
import dungeonLogo from "../assets/dungeonart.jpg";
import snakeLogo from "../assets/snakelogo.jpg";
import riscvCpu from "../assets/RISCVcpu.jpg";
import qwenLogo from "../assets/qwen_logo.png";

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
    tools: ["Python", "PyTorch", "Transformers"],
    overview: "Full fine-tune of Qwen2.5-0.5B-Instruct on ML exam multiple-choice questions, improving accuracy 2x while preserving general reasoning.",
  },
  {
    logo: Baby,
    title: "Beebo",
    type: "Web App",
    tools: ["Python", "FastAPI", "React", "PostgreSQL"],
    overview: "WIP — a SaaS platform for parents to track and analyze their baby's growth, health, and development.",
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

export default function Projects() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="section-layout">
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
