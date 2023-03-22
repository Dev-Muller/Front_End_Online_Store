import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';
import { savedProductLocalStorage, getSavedCartIDs } from '../services/savedCart';
import '../styles/Home.css';

class Home extends React.Component {
  state = {
    query: '',
    category: '',
    results: [],
    categories: [],
    quantityItems: '',
    isResearch: false,
    isResearchEmpty: false,
  };

  componentDidMount() {
    this.getCategoriesData();
    this.quantityItemsCart();
  }

  getCategoriesData = async () => {
    const categories = await getCategories();
    this.setState({ categories });
  };

  onInputRadioClick = async ({ target }) => {
    const { query } = this.state;
    const data = await getProductsFromCategoryAndQuery(target.id, query);
    const { results } = data;
    const verifyResults = (results.length === 0);
    this.setState({ ...data, isResearch: true, isResearchEmpty: verifyResults });
  };

  handleInputChange = ({ target }) => {
    const { value, name } = target;
    this.setState({ [name]: value });
  };

  btnSearch = async () => {
    const { category, query } = this.state;
    const data = await await getProductsFromCategoryAndQuery(category, query);
    const { results } = data;
    const verifyResults = (results.length === 0);
    this.setState({ ...data, isResearch: true, isResearchEmpty: verifyResults });
  };

  addCart = (product) => {
    savedProductLocalStorage(product);
    this.quantityItemsCart();
  };

  quantityItemsCart = () => {
    const arr = getSavedCartIDs();
    this.setState({ quantityItems: arr.length }, () => {
      localStorage.setItem('quantityItems', JSON.stringify(arr.length));
    });
  };

  render() {
    const { query, results, categories, quantityItems, isResearch,
      isResearchEmpty } = this.state;
    const arrResults = (results.map((product) => (
      <li key={ product.id }>
        <Link
          to={ `detailsProduct/${product.id}` }
          data-testid="product-detail-link"
        >
          <ProductCard { ...product } />
        </Link>
        <button
          type="button"
          onClick={ () => this.addCart(product) }
          data-testid="product-add-to-cart"
        >
          Adiciona ao Carrinho
        </button>
      </li>
    )));
    const noResearch = (
      <p data-testid="home-initial-message">
        Digite algum termo de pesquisa ou escolha uma categoria.
      </p>);
    const notFound = (<p>Nenhum produto foi encontrado</p>);

    return (
      <div className="container-main">
        <ul>
          { categories.map((categoria) => (
            <li key={ categoria.id }>
              <label htmlFor={ categoria.id }>
                <input
                  type="radio"
                  name="category"
                  value={ categoria.id }
                  id={ categoria.id }
                  onChange={ this.handleInputChange }
                  onClick={ this.onInputRadioClick }
                  data-testid="category"
                />
                { categoria.name }
              </label>
            </li>
          )) }
        </ul>
        <div className="container-main-query">
          <section className="container-query">
            <div className="container-cart">
              <Link to="/shoppingCart" data-testid="shopping-cart-button">
                Carrinho de compras
              </Link>
              <p data-testid="shopping-cart-size">
                { quantityItems }
              </p>
            </div>
            <input
              type="text"
              name="query"
              value={ query }
              onChange={ this.handleInputChange }
              data-testid="query-input"
            />
            <button
              type="submit"
              onClick={ this.btnSearch }
              data-testid="query-button"
            >
              Pesquisar
            </button>
          </section>
          <ul>
            { !isResearch && noResearch }
            { results.length > 0 && arrResults }
            { isResearchEmpty && notFound }
          </ul>
        </div>
      </div>

    );
  }
}

export default Home;
