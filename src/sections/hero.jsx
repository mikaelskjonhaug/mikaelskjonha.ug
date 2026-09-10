import { useEffect, useState } from "react";
const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function Hero({ name }) {
  const letters = name.split("");
  const finalName = `${name.slice(0, -2)}.ug`;
  const firstMIdx = letters.findIndex((letter) => letter.toLowerCase() === "m");
  const firstSIdx = letters.findIndex((letter) => letter.toLowerCase() === "s");
  const [typedIdx, setTypedIdx] = useState(-1);
  const [extraSuffix, setExtraSuffix] = useState("");
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${backendURL}/activity`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Activity request failed");
        return response.json();
      })
      .then((data) => {
        if (
          Number.isInteger(data.privateCommits) &&
          Array.isArray(data.publicRepositories) &&
          data.publicRepositories.every(
            (repository) =>
              typeof repository.name === "string" && Number.isInteger(repository.commits),
          )
        ) {
          setActivity(data);
        }
      })
      .catch(() => { });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedIdx(name.length - 3);
      setExtraSuffix(".ug");
      return;
    }

    let index = -1;
    const timeouts = [];
    const later = (callback, delay) => {
      timeouts.push(window.setTimeout(callback, delay));
    };

    const typeNext = () => {
      index += 1;
      setTypedIdx(index);

      if (index < name.length - 1) {
        later(typeNext, Math.floor(Math.random() * 90) + 65);
        return;
      }

      later(() => setTypedIdx((current) => current - 1), 420);
      later(() => setTypedIdx((current) => current - 1), 560);
      later(() => setExtraSuffix("."), 760);
      later(() => setExtraSuffix(".u"), 870);
      later(() => setExtraSuffix(".ug"), 980);
    };

    typeNext();
    return () => timeouts.forEach(window.clearTimeout);
  }, [name]);

  return (
    <header className="hero">
      <p className="hero-kicker">hello, i&apos;m</p>
      <h1 className="hero-name" aria-label={finalName}>
        <span aria-hidden="true">
          {letters.slice(0, typedIdx + 1).map((character, index) => (
            <span
              className={index === firstMIdx || index === firstSIdx ? "typed-initial" : undefined}
              key={`${character}-${index}`}
            >
              {character}
            </span>
          ))}
          <span className="typed-suffix">{extraSuffix}</span>
          <span className="typing-caret" />
        </span>
      </h1>
      <aside className="hero-activity" aria-live="polite" aria-busy={!activity}>
        <span className="hero-activity-label">activity / 7d</span>
        <div className={`hero-activity-content${activity ? " is-loaded" : ""}`}>
          {activity ? (
            <p>
              {activity.publicRepositories.length > 0 && (
                <span className="hero-activity-line">
                  <strong>
                    {activity.publicRepositories[0].commits} commit
                    {activity.publicRepositories[0].commits === 1 ? "" : "s"}
                  </strong>{" "}
                  in{" "}
                  <a
                    className="hero-activity-repo"
                    href={`https://github.com/${encodeURI(activity.publicRepositories[0].name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="hero-activity-owner">
                      {activity.publicRepositories[0].name.split("/")[0]}/
                    </span>
                    {activity.publicRepositories[0].name.split("/").slice(1).join("/")}
                  </a>
                  {","}
                </span>
              )}
              {activity.publicRepositories.slice(1).map(({ name: repositoryName, commits }) => (
                <span className="hero-activity-line" key={repositoryName}>
                  <strong>
                    {commits} commit{commits === 1 ? "" : "s"}
                  </strong>{" "}
                  in{" "}
                  <a
                    className="hero-activity-repo"
                    href={`https://github.com/${encodeURI(repositoryName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="hero-activity-owner">
                      {repositoryName.split("/")[0]}/
                    </span>
                    {repositoryName.split("/").slice(1).join("/")}
                  </a>
                  {","}
                </span>
              ))}
              <span className="hero-activity-line">
                <strong>
                  {activity.privateCommits} commit{activity.privateCommits === 1 ? "" : "s"}
                </strong>{" "}
                in private repositories.
              </span>
            </p>
          ) : (
            <p>loading…</p>
          )}
        </div>
      </aside>
    </header>
  );
}
