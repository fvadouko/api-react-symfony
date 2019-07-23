import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Field from "../components/forms/Field";
import customersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastname: "",
    firstname: "",
    email: "",
    company: ""
  });

  const [editing, setEditing] = useState(false);

  /**
   * Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
   */
  useEffect(() => {
    if (id !== "nouveau") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  const [errors, setErrors] = useState({
    lastname: "",
    firstname: "",
    email: "",
    company: ""
  });

  /**
   * Récupération du customer en fonction de l'identifiant
   * @param {*} id
   */
  const fetchCustomer = async id => {
    try {
      const { firstname, lastname, email, company } = await customersAPI.find(
        id
      );

      setCustomer({ firstname, lastname, email, company });
    } catch (error) {
      console.log(error.response);
      history.replace("/clients");
    }
  };

  /**
   * Gestion des changements des inputs dans le formulaire
   * @param {*} param0
   */
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setCustomer({ ...customer, [name]: value });
  };

  /**
   * Gestion de la soumission du formulaire
   * @param {*} event
   */
  const handleSubmit = async event => {
    event.preventDefault();

    if (editing) {
      try {
        await customersAPI.update(id, customer);
        setErrors({});
      } catch (error) {
        const apiErrors = {};
        error.response.data.violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });

        setErrors(apiErrors);
      }
    } else {
      try {
        await customersAPI.create(customer);
        setErrors({});
        history.replace("/clients");
      } catch ({ response }) {
        const { violations } = response.data;
        if (violations) {
          const apiErrors = {};
          violations.forEach(({ propertyPath, message }) => {
            apiErrors[propertyPath] = message;
          });

          setErrors(apiErrors);
        }
      }
    }
  };
  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="lastname"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastname}
          onChange={handleChange}
          error={errors.lastname}
        />
        <Field
          name="firstname"
          label="Prénom(s) de famille"
          placeholder="Prénom(s) du client"
          value={customer.firstname}
          onChange={handleChange}
          error={errors.firstname}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Adresse mail du client"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/clients" className="btn btn-link">
            Retour à liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
