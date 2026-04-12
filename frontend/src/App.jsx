import { Routes, Route } from "react-router-dom";
import AppShell from "./app/AppShell";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import RoutesPage from "./pages/RoutesPage";
import BookNowPage from "./pages/BookNowPage";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/book-now" element={<BookNowPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
