import React, { Component } from 'react';
import { Modal, Button, HelpBlock, FormControl, ControlLabel, FormGroup } from 'react-bootstrap';

export default class CpfEditor extends React.Component {
    constructor(props) {
      super(props);
      this.updateData = this.updateData.bind(this);
      this.state = { cpf: props.defaultValue };
      console.log(props);
      console.log(this);
    }
    updateData = () => {
      this.props.onUpdate( this.cpf );
    }
    render() {
      return (
        <span>
          <form>
            <FormGroup >
              <ControlLabel>CPF*</ControlLabel>
              <FormControl
                type="text"
                maxLength="11"
                inputRef={(input) => { this.cpf = input }}
                defaultValue={this.state.cpf}
              />
            </FormGroup>
          <button
            className='btn btn-info btn-xs textarea-save-btn'
            onClick={ this.updateData }>
            save
          </button>
          </form>
        </span>
      );
    }
  }