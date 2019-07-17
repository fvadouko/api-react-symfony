import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/HomePage';
import { HashRouter, Switch, Route } from "react-router-dom";
import CustomersPage from './pages/CustomersPage';
import CustomersPageWithPagination from './pages/CustomerPageWithPagination';
import InvoicesPage from './pages/InvoicesPage';

// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

const App = () => {
    return <HashRouter> 
        <Navbar />
        <main className="container pt-5">
            <Switch>
                <Route path="/clients" component={CustomersPage} />
                <Route path="/factures" component={InvoicesPage} />
                <Route path="/" component={Homepage} />
            </Switch>
        </main>
    </HashRouter>;
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);