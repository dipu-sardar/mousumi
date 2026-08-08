import { AppProvider } from "./context/AppContext.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import Receipt from "./components/Receipt.jsx";

export default function App() {
  return (
    <AppProvider>
      {/* Hidden on screen; becomes the page content only inside the print dialog. */}
      <Receipt />
      <AppShell />
    </AppProvider>
  );
}
