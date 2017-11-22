import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertButton, InsertModalHeader, InsertModalFooter } from 'react-bootstrap-table';
import axios from 'axios';
//import TableFooter from './TableFooter'
import './TableExample.css';

export default class TableExample extends Component {
  constructor() {
    super();
    this.state = {
      rows: []
    }
  }

  runners = [{
    id: 1,
    name: "Teste2",
    telephone: 99733.1000,
    status: 'Ativo'
  }, {
    id: 2,
    name: "Teste",
    telephone: 999889988,
    status: "Inativo"
  }];

  selectRow = {
    mode: 'checkbox',
    //showOnlySelected: true
  };

  

  componentDidMount = () => { //  console.log('token', localStorage.getItem('token'));
    axios.get('http://labrih-assessoriaesportiva.herokuapp.com/runners/', {
      headers: {'x-access-token': localStorage.getItem('token')}
    }).then((response) => {
      this.fillTable(response.data.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  fillTable = (runners) => {
    let rows = [];
    runners.map((runner, key) => {
      console.log()
      rows.push({
          id: key + 1,
          name: runner.name,
          telephone: runner.cellphone,
          status: runner.active ? 'Ativo' : 'Inativo'
      })
    });
    this.setState({ rows })
  };

  createCustomModalHeader = (closeModal, save) => {
    return (
      <InsertModalHeader
      className='my-custom-class'
      title='Novo Atleta'
    />
    )
  }

  createCustomModalFooter = (closeModal, save) => {
    return (
      <InsertModalFooter
        className='my-custom-class'
        saveBtnText='Salvar'
        closeBtnText='Sair'
        closeBtnContextual='btn-info'
        saveBtnContextual='btn-success'
        closeBtnClass='my-close-btn-class'
        saveBtnClass='my-save-btn-class'
        beforeClose={ this.beforeClose }
        beforeSave={ this.beforeSave }
        onModalClose={ () => this.handleModalClose(closeModal) }
        onSave={ () => this.handleSave(save) }
      />
    )
  }

  handleSave(save) {
    // Custom your onSave event here,
    // it's not necessary to implement this function if you have no any process before save
    const dataToSend = {
      //cellphone: this.,
      name: 'contato'
    }
    axios.post('http://labrih-assessoriaesportiva.herokuapp.com/runners', dataToSend).then((response) => {
      this.treatResponse(response.data);
    }).catch(function (error) {
      console.log(error);
    });
    save();
  }

  render() {

    console.log(this.props)

    const options = {
      insertText: 'Inserir',
      deleteText: 'Excluir',
      saveText: 'Salvar',
      closetext: 'Fechar',
      insertModalHeader: this.createCustomModalHeader,      
      insertModalFooter: this.createCustomModalFooter,
      handleInsertButtonClick(onClick) {
        // Custom your onClick event here,
        // it's not necessary to implement this function if you have no any process before onClick
        console.log('This is my custom function for InserButton click event');
        onClick();
      },
      beforeClose(e) {
        alert(`[Custom Event]: Before modal close event triggered!`);
      },
      beforeSave(e) {
        alert(`[Custom Event]: Modal save event triggered!`);
      },
      handleModalClose(closeModal) {
        // Custom your onCloseModal event here,
        // it's not necessary to implement this function if you have no any process before modal close
        console.log('This is my custom function for modal close event');
        closeModal();
      },
      /* insertModalHeader(closeModal, save) {
        return (
         
            
        )
      } */
    }

    return (
      <div>
        <BootstrapTable data={this.state.rows} options={options} selectRow={this.selectRow} striped hover condensed insertRow deleteRow>
          <TableHeaderColumn dataField='id' isKey>Id</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>Nome</TableHeaderColumn>
          <TableHeaderColumn dataField='telephone'>Telefone</TableHeaderColumn>
          <TableHeaderColumn dataField='status'>Status</TableHeaderColumn>
          {/* <TableHeaderColumn dataField='action' export={ false }>Delete</TableHeaderColumn> */}
        </BootstrapTable>
      </div>
    )
  }
}
