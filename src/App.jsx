import { AuthContextProvider } from "./context/AuthContext";
import Auth from "./layout/Auth";

const App = () => {
  return (
    <div className="bg-neutral-900 h-screen py-5 select-none overflow-hidden relative">
      <div className="bg-neutral-50 h-full  2xl:mx-40">
        {/* The chat and message menus */}
        <div id="chat-menu"></div>
        <div id="message-menu"></div>

        {/* Left border */}
        <div className="2xl:w-40 h-full bg-neutral-900 z-40 fixed left-0"></div>
        
        {/* Authentication context provider */}
        <AuthContextProvider>
          {/* Main content area */}
          <div className="bg-neutral-800 h-full grow flex overflow-hidden">
            {/* Authentication component */}
            <Auth />
          </div>
        </AuthContextProvider>

        {/* Right border */}
        <div className="2xl:w-40 h-full bg-neutral-900 z-40 fixed top-5 right-0"></div>
      </div>
    </div>
  );
};

export default App; // Exporting the App component for use in other parts of the application
