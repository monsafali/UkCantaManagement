
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AuthInitializer from "./components/AuthInitializer";

ReactDOM.createRoot(document.getElementById("root")).render(
   <BrowserRouter>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </BrowserRouter>
);
