// App.jsx
// This is the root component of our application.
// Its only job is to wrap our app with BrowserRouter
// and render the AppRoutes component, which contains all our page routes.

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;