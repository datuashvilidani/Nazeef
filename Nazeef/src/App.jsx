import { useState } from "react";
import "./App.css";
import MachineBlocks from "./components/Cards";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { AuthProvider, AuthGate, AuthModal } from "./AuthSystem";

function App() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <AuthProvider>
      <Header onOpenAuth={() => setShowAuth(true)} />
      <Hero />

      <AuthGate onRequestLogin={() => setShowAuth(true)}>
        <MachineBlocks />
      </AuthGate>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </AuthProvider>
  );
}

export default App;