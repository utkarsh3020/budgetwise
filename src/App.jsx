import { Outlet } from "react-router-dom";
import "./App.css";
import { Navbar, Sidebar } from "./components";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="flex h-screen dark:bg-black">
      <Toaster position="top-center" reverseOrder={false} />
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
