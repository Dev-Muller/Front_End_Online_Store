import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getSavedCartIDs } from '../services/savedCart';

class checkOut extends Component {
  state = {
    arrGetProducts: [],
    total: 0.00,
    isValid: false,
    isDisabled: true,
    txtFullName: '',
    txtEmail: '',
    txtCpf: '',
    txtPhone: '',
    txtCep: '',
    txtAddress: '',
    payment: '',
  };

  componentDidMount() {
    this.fetchApi();
  }

  fetchApi = () => {
    const products = getSavedCartIDs();
    const setProducts = new Set();
    const productsAndQuantity = products.reduce((acc, product) => {
      let totalPrice = 0;
      const filterProductId = products.filter((p) => {
        if (p.id === product.id) {
          totalPrice += product.price;
          return p;
        }
        return false;
      });
      return [...acc, {
        product: filterProductId[0],
        quantity: filterProductId.length,
        price: product.price,
        totalPrice,
      }];
    }, []);
    let total = 0;
    products.forEach((element) => {
      total += element.price;
    });
    const arrGetProducts = productsAndQuantity.filter(({ product }) => {
      const dupProduct = setProducts.has(product.id);
      setProducts.add(product.id);
      return !dupProduct;
    });
    this.setState({ arrGetProducts, total });
  };

  handleChange = ({ target }) => {
    const { value, name } = target;
    this.setState({ [name]: value }, this.validateFields);
  };

  validateFields = () => {
    const { txtFullName, txtEmail, txtCpf, txtPhone, txtCep, txtAddress,
      payment } = this.state;
    const isValidForm = (txtFullName !== ''
    && txtEmail !== ''
    && txtCpf !== ''
    && txtPhone !== ''
    && txtCep !== ''
    && txtAddress !== ''
    && payment !== '');
    this.setState({ isValid: !isValidForm, isDisabled: !isValidForm });
  };

  onBuy = () => {
    const { history } = this.props;
    const { isValid } = this.state;
    if (!isValid) {
      localStorage.setItem('cartProducts', []);
      history.push('/shoppingCart');
    }
  };

  render() {
    const { txtFullName, txtEmail, txtCpf, txtPhone,
      txtCep, txtAddress, isValid, total, arrGetProducts, isDisabled } = this.state;

    return (
      <div>
        <Link to="/shoppingCart">Voltar</Link>
        <h4>Revise seus Produtos</h4>
        <ul>
          { arrGetProducts
            .map(({ product: { id, thumbnail, title }, totalPrice }) => (
              <li key={ id }>
                <img src={ thumbnail } alt={ title } />
                <h3>{ title }</h3>
                <p>{ totalPrice.toFixed(2) }</p>
              </li>
            )) }
          { total.toFixed(2) }
        </ul>
        <h4>Informações do Comprador</h4>
        <input
          type="text"
          name="txtFullName"
          value={ txtFullName }
          placeholder="Nome Completo"
          onChange={ this.handleChange }
          data-testid="checkout-fullname"
        />
        <input
          type="text"
          name="txtEmail"
          value={ txtEmail }
          placeholder="Email"
          onChange={ this.handleChange }
          data-testid="checkout-email"
        />
        <input
          type="text"
          name="txtCpf"
          value={ txtCpf }
          placeholder="CPF"
          onChange={ this.handleChange }
          data-testid="checkout-cpf"
        />
        <input
          type="text"
          name="txtPhone"
          value={ txtPhone }
          placeholder="Telefone"
          onChange={ this.handleChange }
          data-testid="checkout-phone"
        />
        <input
          type="text"
          name="txtCep"
          value={ txtCep }
          placeholder="CEP"
          onChange={ this.handleChange }
          data-testid="checkout-cep"
        />
        <input
          type="text"
          name="txtAddress"
          value={ txtAddress }
          placeholder="Endereço"
          onChange={ this.handleChange }
          data-testid="checkout-address"
        />
        <h4>Método de pagamento</h4>
        <label htmlFor="ticket-payment">
          Boleto
          <input
            type="radio"
            name="payment"
            value="ticket"
            id="ticket-payment"
            onChange={ this.handleChange }
            data-testid="ticket-payment"
          />
        </label>
        <section>
          <h5>Cartão de Crédito</h5>
          <label htmlFor="visa-payment">
            Visa
            <input
              type="radio"
              name="payment"
              value="visa"
              id="visa-payment"
              onChange={ this.handleChange }
              data-testid="visa-payment"
            />
          </label>
          <label htmlFor="master-payment">
            MasterCard
            <input
              type="radio"
              name="payment"
              value="master"
              id="master-payment"
              onChange={ this.handleChange }
              data-testid="master-payment"
            />
          </label>
          <label htmlFor="elo-payment">
            Elo
            <input
              type="radio"
              name="payment"
              value="elo"
              id="elo-payment"
              onChange={ this.handleChange }
              data-testid="elo-payment"
            />
          </label>
        </section>
        <button
          type="submit"
          onClick={ this.onBuy }
          disabled={ isDisabled }
          data-testid="checkout-btn"
        >
          Comprar
        </button>
        { isValid && <p data-testid="error-msg">Campos inválidos</p> }
      </div>
    );
  }
}

checkOut.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default checkOut;
