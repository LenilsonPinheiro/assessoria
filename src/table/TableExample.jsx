import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertModalHeader, InsertModalFooter } from 'react-bootstrap-table';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
//import TableFooter from './TableFooter'
import './TableExample.css';

export default class TableExample extends Component {
  constructor() {
    super();
    this.state = {
      rows: []
    }
  }

  componentDidMount = () => { // console.log('token', localStorage.getItem('token'));
    axios.get('http://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas', {
      headers: {'x-access-token': localStorage.getItem('token')}
    }).then((response) => {
      this.fillTable(response.data.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  fillTable = (runners) => {
    console.log(runners);
    let rows = [];
    runners.map((runner, key) => {
      return rows.push({
          id: runner._id,
          nome: runner.nome,
          data_nascimento: moment(runner.data_nascimento).format('DD/MM/YYYY hh:mm a').toString(),
          nucleo: runner.nucleo,
          numero: runner.numero,
          tamanho_camisa: runner.tamanho_camisa,
          celular: runner.celular,
          ativo: runner.active ? 'Ativo' : 'Inativo'
      });
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

  onAfterSaveCell = (row, cellName, cellValue) => {
    console.log('row:', row);
  }
  
  
  onBeforeSaveCell = (row, cellName, cellValue) => {
    const dataToSend = Object.assign({}, row);
    
    delete dataToSend.id;

    row.ativo = true;
    if (dataToSend.ativo === "Inativo") dataToSend.ativo = false;

    console.log('row:', row);
    console.log('dataToSend', dataToSend)

    console.log('token:', localStorage.getItem('token'))
    
    axios.put(`http://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas/${row.id}`, {
      headers: {'x-access-token': localStorage.getItem('token')}
    }, {cellName: cellValue} ).then((response) => {
      this.treatResponse(response.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {

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
        <BootstrapTable
          data={this.state.rows}
          options={options}
          selectRow={this.selectRow}
          cellEdit={{
            mode: 'dbclick',
            blurToSave: true,
            beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
            afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
          }}
          striped
          hover
          condensed
          insertRow
          deleteRow
        >
          <TableHeaderColumn dataField='id' isKey>Id</TableHeaderColumn>
          <TableHeaderColumn dataField='nome'>Nome</TableHeaderColumn>
          <TableHeaderColumn dataField='data_nascimento'>Data de Nascimento</TableHeaderColumn>
          <TableHeaderColumn dataField='nucleo'>Núcleo</TableHeaderColumn>
          <TableHeaderColumn dataField='numero'>Nº</TableHeaderColumn>
          <TableHeaderColumn dataField='tamanho_camisa'>Tamanho Camisa</TableHeaderColumn>
          <TableHeaderColumn dataField='celular'>Telefone</TableHeaderColumn>
          <TableHeaderColumn dataField='ativo' editable={ { type: 'checkbox', options: { values: 'Ativo:Inativo' } } }>Status</TableHeaderColumn>
          {/* <TableHeaderColumn dataField='action' export={ false }>Delete</TableHeaderColumn> */}
        </BootstrapTable>
      </div>
    )
  }
}
