import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EvaluationForm extends Component {
  state = {
    email: '',
    text: '',
    rating: '',
    isError: false,
    isDisabled: true,
  };

  handleInputChange = ({ target }) => {
    const { value } = target;
    this.setState({ [target.name]: value }, this.validateFields);
  };

  validateFields = () => {
    const { email, rating } = this.state;
    const verifyEmail = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    const validEmail = verifyEmail.test(email);
    const validate = (email !== '' && rating !== '' && validEmail);
    this.setState({ isDisabled: !validate, isError: !validate });
  };

  handleButton = () => {
    const { email, rating, text } = this.state;
    const { updateEvaluation } = this.props;
    updateEvaluation({ email, rating, text });
    this.setState({ email: '', text: '', rating: '', isDisabled: true });
  };

  render() {
    const { isDisabled, isError, text, email } = this.state;

    return (
      <div>
        <form>
          <label htmlFor="txtEmail">
            <input
              placeholder="Email"
              id="txtEmail"
              name="email"
              value={ email }
              data-testid="product-detail-email"
              onChange={ this.handleInputChange }
            />
          </label>
          <input
            name="rating"
            value="1"
            type="radio"
            data-testid="1-rating"
            onChange={ this.handleInputChange }
          />
          <input
            name="rating"
            value="2"
            type="radio"
            data-testid="2-rating"
            onChange={ this.handleInputChange }
          />
          <input
            name="rating"
            value="3"
            type="radio"
            data-testid="3-rating"
            onChange={ this.handleInputChange }
          />
          <input
            name="rating"
            value="4"
            type="radio"
            data-testid="4-rating"
            onChange={ this.handleInputChange }
          />
          <input
            name="rating"
            value="5"
            type="radio"
            data-testid="5-rating"
            onChange={ this.handleInputChange }
          />
          <label htmlFor="txtText">
            <textarea
              id="txtText"
              name="text"
              value={ text }
              placeholder="Descrição"
              data-testid="product-detail-evaluation"
              onChange={ this.handleInputChange }
            />
          </label>
          <label htmlFor="button">
            <button
              name="button"
              type="button"
              data-testid="submit-review-btn"
              onClick={ this.handleButton }
              disabled={ isDisabled }
            >
              Avaliar
            </button>
          </label>
        </form>
        { isError && <p data-testid="error-msg">Campos inválidos</p> }
      </div>
    );
  }
}

EvaluationForm.propTypes = {
  updateEvaluation: PropTypes.func.isRequired,
};

export default EvaluationForm;
