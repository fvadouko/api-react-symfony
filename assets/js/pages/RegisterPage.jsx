import React, { useState } from "react";
import { Link } from "react-router-dom";

import Field from "../components/forms/Field";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  /**
   * Gestion des changements des inputs dans le formulaire
   * @param {*} param0
   */
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const apiErrors = {};

    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
      setErrors(apiErrors);
      return;
    }

    try {
      await UsersAPI.register(user);

      setErrors({});
      toast.success("Vous êtes inscrit, vous pouvez vous connecter !");
      history.replace("/login");
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });

        setErrors(apiErrors);
        toast.error("Des erreurs dans otre formulaire");
      }
    }
  };

  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstname"
          label="Votre prénom"
          placeholder="Votre prénom"
          error={errors.firstname}
          value={user.firstname}
          onChange={handleChange}
        />
        <Field
          name="lastname"
          label="Votre nom"
          placeholder="Votre nom de famille"
          error={errors.lastname}
          value={user.lastname}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="Votre adresse mail"
          placeholder="Votre adresse mail"
          type="email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />
        <Field
          name="password"
          label="Votre mot de passe"
          placeholder="Votre mot de passe"
          type="password"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />
        <Field
          name="passwordConfirm"
          label="Mot de passe à confirmer"
          placeholder="Votre mot de passe"
          type="password"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            je m'inscris
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
