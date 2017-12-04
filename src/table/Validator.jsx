import { Component } from 'react';

export default class Validator extends Component {
  validate(condition, key, message = 'Campo Obrigatório') {
    const { validationResult } = this.state;

    validationResult[`${key}ValidationState`] = condition ? 'error' : null;
    validationResult[`${key}Message`] = condition ? message : null;

    this.setState(
      {
        ...this.state,
        validationResult: {
          ...this.state.validationResult,
          validationResult,
        },
      });

    return !condition;
  }
}
