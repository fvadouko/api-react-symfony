import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Positionne le token JWT sur Axios
 * @param {string} token Le token JWT
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param {object} credentials
 */
function authenticate(credentials) {
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then(response => response.data.token)
    .then(token => {
      window.localStorage.setItem("authToken", token);
      setAxiosToken(token);
    });
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

export default {
  setup,
  authenticate,
  isAuthenticated,
  logout
};
