import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem("uksummit-theme");
  return savedTheme || "winter";
}

function AppShell({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("uksummit-theme", theme);
  }, [theme]);

  function handleToggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "winter" ? "summer" : "winter"
    );
  }

  return (
    <div className="site-shell">
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}

export default AppShell;