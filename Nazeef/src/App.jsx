import { useState } from "react";
import "./App.css";
import MachineBlocks from "./components/Cards";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { AuthProvider, AuthGate, AuthModal, NotificationProvider } from "./AuthSystem";
import AboutUs from "./components/About";
import ContactUs from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Header onOpenAuth={() => setShowAuth(true)} />
        <Hero />

        <AuthGate onRequestLogin={() => setShowAuth(true)}>
          <MachineBlocks />
        </AuthGate>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        <AboutUs />
        <ContactUs />
        <Footer />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
