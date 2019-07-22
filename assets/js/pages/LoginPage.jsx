import React, { useState, useContext } from "react";

import authAPI from "../services/authAPI";
import CustomersApi from "../services/customersAPI";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await authAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/clients");
    } catch (error) {
      setError(
        "Aucun compte ne possède cette adresse ou les informations ne correspondent pas"
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Adresse email</label>
          <input
            value={credentials.username}
            onChange={handleChange}
            type="email"
            name="username"
            id="username"
            placeholder="Adresse email de connexion à saisir"
            className={"form-control" + (error && " is-invalid")}
          />
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            value={credentials.password}
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            placeholder="Mot de passe à saisir"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
