import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faDatabase, faFileCode, faHouse } from "@fortawesome/free-solid-svg-icons";

const tabs = [
  { page: "hero", label: "Home", icon: faHouse },
  { page: "blog", label: "Blog", icon: faDatabase },
  { page: "work", label: "Work", icon: faFileCode },
  { page: "guestbook", label: "Guestbook", icon: faBookOpen },
];

export default function MobileTabBar({ activePage, onNavigate }) {
  const handleKeyDown = (event, index) => {
    const next = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (next === undefined) return;

    event.preventDefault();
    event.currentTarget.parentElement.children[next].focus();
    onNavigate(tabs[next].page);
  };

  return (
    <div className="mobile-tab-bar" role="tablist" aria-label="Pages">
      {tabs.map(({ page, label, icon }, index) => (
        <button
          key={page}
          type="button"
          role="tab"
          aria-selected={activePage === page}
          aria-label={label}
          tabIndex={activePage === page || (activePage === "hero" && index === 0) ? 0 : -1}
          onClick={() => onNavigate(page)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          <FontAwesomeIcon icon={icon} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
