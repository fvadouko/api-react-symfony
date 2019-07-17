import moment from "moment";
import React, { useEffect, useState } from "react";

import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";

const STATUS_CLASSES = {
  PAYEE: "success",
  ENVOYEE: "primary",
  ANNULEE: "danger"
};

const STATUS_LABELS = {
  PAYEE: "Payée",
  ENVOYEE: "Envoyée",
  ANNULEE: "Annulée"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.log("oooooooooooooops !!!!", error.response);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  const handleDelete = async id => {
    console.log(id);
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    try {
      await InvoicesAPI.delete(id);
    } catch (error) {
      setInvoices(originalInvoices);
      console.log("oooooooooooooops !!!!", error.response);
    }
  };

  const handleChangePage = page => {
    setCurrentPage(page);
  };

  const itemsPerPage = 8;

  const filteredInvoices = invoices.filter(
    i =>
      i.customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  // Gestion du format de date
  const formatDate = str => moment(str).format("DD/MM/YYYY");

  return (
    <>
      <h1>Liste des factures</h1>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {paginatedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>
                <a href="#">
                  {invoice.customer.firstname} {invoice.customer.lastname}
                </a>
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center">{invoice.amount.toLocaleString()}</td>
              <td>
                <button className="btn btn-sm btn-primary mr-1">Editer</button>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {itemsPerPage < filteredInvoices.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredInvoices.length}
          onChangePage={handleChangePage}
        />
      )}
    </>
  );
};

export default InvoicesPage;
