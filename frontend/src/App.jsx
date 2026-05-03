import { Routes, Route } from "react-router-dom";
import AppShell from "./app/AppShell";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import RoutesPage from "./pages/RoutesPage";
import RouteDetailPage from "./pages/RouteDetailPage";
import BookNowPage from "./pages/BookNowPage";
import AccountPage from "./pages/AccountPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import FAQPage from "./pages/FAQPage";
import CancellationPolicyPage from "./pages/CancellationPolicyPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import MountainAdvicePage from "./pages/MountainAdvicePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelledPage from "./pages/PaymentCancelledPage";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/routes/:slug" element={<RouteDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/book-now" element={<BookNowPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/support/faq" element={<FAQPage />} />
        <Route path="/support/cancellation-policy" element={<CancellationPolicyPage />}/>
        <Route path="/support/accessibility" element={<AccessibilityPage />} />
        <Route path="/support/terms" element={<TermsPage />} />
        <Route path="/support/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/advice" element={<MountainAdvicePage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;