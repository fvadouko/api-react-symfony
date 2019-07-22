import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import CustomersPage from "./pages/CustomersPage";
import Homepage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";

// any CSS you require will output into a single css file (app.css in this case)
require("../css/app.css");

authAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authAPI.isAuthenticated()
  );
  const NavbarWithRouter = withRouter(Navbar);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated
      }}
    >
      <HashRouter>
        <NavbarWithRouter />
        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path="/clients" component={CustomersPage} />
            <PrivateRoute path="/factures" component={InvoicesPage} />
            <Route path="/" component={Homepage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
