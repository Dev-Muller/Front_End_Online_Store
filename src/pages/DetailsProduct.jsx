import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { savedProductLocalStorage, getEvaluation,
  savedEvaluation, getSavedCartIDs } from '../services/savedCart';
import EvaluationForm from '../components/EvaluationForm';
import RatingCard from '../components/RatingCard';

class DetailsProduct extends Component {
  state = {
    data: {},
    getEvaluationData: [],
  };

  componentDidMount() {
    this.fetchApi();
    const { match: { params: { id } } } = this.props;
    const getEvaluationData = getEvaluation(id);
    this.setState({ getEvaluationData });
    this.savedLocalS();
  }

  updateEvaluation = (evalute) => {
    const { match: { params: { id } } } = this.props;
    this.setState((prevState) => (
      { getEvaluationData: [...prevState.getEvaluationData, evalute] }), () => {
      savedEvaluation(evalute, id);
    });
  };

  fetchApi = async () => {
    const { match: { params: { id } } } = this.props;
    const data = await getProductById(id);
    this.setState({ data });
  };

  savedLocalS = () => {
    const arr = getSavedCartIDs();
    this.setState({ quantityItems: arr.length }, () => {
      localStorage.setItem('quantityItems', JSON.stringify(arr.length));
    });
  };

  addCart = () => {
    const { data } = this.state;
    savedProductLocalStorage(data);
    this.savedLocalS();
  };

  render() {
    const { quantityItems, getEvaluationData, data } = this.state;
    const { title, thumbnail, price, attributes } = data;

    return (
      <div>
        <h2 data-testid="product-detail-name">{ title }</h2>
        <p data-testid="product-detail-price">{ price }</p>
        <img src={ thumbnail } alt={ title } data-testid="product-detail-image" />
        <table>
          <tbody>
            { attributes?.map((attribute) => (
              <tr key={ attribute.id }>
                <td>{ attribute.name }</td>
                <td>{ attribute.value_name }</td>
              </tr>
            )) }
          </tbody>
        </table>
        <Link
          to="/shoppingCart"
          data-testid="shopping-cart-button"
        >
          Ir para o carrinho
        </Link>
        <p data-testid="shopping-cart-size">
          { quantityItems }
        </p>
        <button
          type="button"
          onClick={ () => this.addCart() }
          data-testid="product-detail-add-to-cart"
        >
          Adicionar ao Carrinho
        </button>
        <EvaluationForm updateEvaluation={ this.updateEvaluation } />
        <ul>
          { getEvaluationData?.map((item, index) => (
            <li key={ index }>
              <RatingCard
                email={ item.email }
                text={ item.text }
                rating={ item.rating }
              />
            </li>
          )) }
        </ul>
      </div>
    );
  }
}

DetailsProduct.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default DetailsProduct;
