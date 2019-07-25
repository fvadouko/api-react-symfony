import React, { useContext, useState } from "react";

import Field from "../components/forms/Field";
import AuthContext from "../contexts/AuthContext";
import authAPI from "../services/authAPI";
import { toast } from "react-toastify";

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
      toast.success("Vous êtes connecté");
      history.replace("/clients");
    } catch (error) {
      setError(
        "Aucun compte ne possède cette adresse ou les informations ne correspondent pas"
      );
      toast.error("Une erreur est survenue !");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          id="username"
          label="Adresse email"
          value={credentials.username}
          onChange={handleChange}
          type="email"
          placeholder="Adresse email de connexion"
          error={error}
        />
        <Field
          name="password"
          id="password"
          label="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
          type="password"
          error={error}
        />

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
