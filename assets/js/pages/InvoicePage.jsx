import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import customersAPI from "../services/customersAPI";
import invoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
  const { id = "nouveau" } = match.params;
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "ENVOYEE"
  });

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  const [editing, setEditing] = useState(false);

  const [customers, setCustomers] = useState([]);

  /**
   * Récupération des clients
   */
  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
     history.replace("/factures");
    }
  };

  /**
   * Récupération d'une facture
   * @param {*} id
   */
  const fetchInvoice = async id => {
    try {
      const { amount, status, customer } = await invoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      history.replace("/factures");
    }
  };

  /**
   * Récupération de la liste des clients à chaque chargement du composant
   */
  useEffect(() => {
    fetchCustomers();
  }, []);

  /**
   * Récupération de la bonne facture quand l'identifiant de l'URL change
   */
  useEffect(() => {
    if (id !== "nouveau") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  /**
   * Gestion des changements des inputs dans le formulaire
   * @param {*} param0
   */
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  /**
   * Gestion de la soumission du formulaire
   * @param {*} event
   */
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      if (editing) {
        await invoicesAPI.update(id, invoice);
      } else {
        await invoicesAPI.create(invoice);
        history.replace("/factures");
      }
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
  };

  return (
    <>
      {(!editing && <h1>Création d'une facture</h1>) || (
        <h1>Modification de la facture</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          label="Montant"
          type="number"
          placeholder="Montant de la facture"
          value={invoice.amount}
          onChange={handleChange}
          error={errors.amount}
        />

        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstname} {customer.lastname}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="ENVOYEE">Envoyée</option>
          <option value="PAYEE">Payée</option>
          <option value="ANNULEE">Annulée</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/factures" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
