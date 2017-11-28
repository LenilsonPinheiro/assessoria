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
    axios.get('https://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas', {
      headers: { 'x-access-token': localStorage.getItem('token') }
    }).then((response) => {
      this.fillTable(response.data.data)
    })
      .catch(function (error) {
        console.log(error);
      });
  }


  fillTable = (runners) => {

    var nucleos = JSON.parse(localStorage.getItem('nucleos'));
    var tamanhos = JSON.parse(localStorage.getItem('tamanhos'));
    
    console.log('nucleos fillTable', nucleos);
    let rows = [];

    runners.map((runner, key) => {
      return rows.push({
        id: runner._id,
        nome: runner.nome,
        /*data_nascimento: moment(runner.data_nascimento).format('DD/MM/YYYY hh:mm a').toString(),*/

        /*data_nascimento: moment(runner.data_nascimento).format('YYYY-MM-DD').toString(),*/
        data_nascimento: moment(runner.data_nascimento).format('DD-MM-YYYY').toString(),

        nucleo: runner.nucleo,
        nucleoDescricao: nucleos.find((element, index, array) => {
          return element._id == runner.nucleo
        }).Descricao,
        numero: runner.numero,
        tamanho_camisaDescricao: tamanhos.find((element, index, array) => {
          return element._id == runner.tamanho_camisa
        }).Descricao,
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
        beforeClose={this.beforeClose}
        beforeSave={this.beforeSave}
        onModalClose={() => this.handleModalClose(closeModal)}
        onSave={() => this.handleSave(save)}
      />
    )
  }

  handleSave = (save) => {
    var dataToSend = { 
      
      /*_id,assessoria,numero,cpf,data_nascimento,celular,tamanho_camisa,nucleo,nome,ativo*/
    }
    console.log("token do salvar: ",this);
    axios.post("https://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas/", {
      headers: {
      'x-access-token': localStorage.getItem('token')
    }}, dataToSend).then((response) => {
      this.treatResponse(response.data);
    }).catch(function (error) {
      console.log(error);
    });
    console.log("token do salvar: ",localStorage.getItem('token'));
    save();
  }

  onAfterSaveCell = (row, cellName, cellValue) => {/*
    var id = row.id;

    axios.put("https://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas/"+id, row, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    }).then(a => {
      console.log(a);
    }).catch(e => {
      console.log(e);
    })

    console.log('row:', row);
  */}


  onBeforeSaveCell = (row, cellName, cellValue) => {
    var dataToSend = Object.assign({}, row);
    var dataToSendid = dataToSend.id;
    var id = row.id;

    console.log('data to send: ', dataToSend);
    console.log('token: ', localStorage.getItem('token'));
    console.log('id: ', id);

        
    console.log('Row data antes do tratamento: ', row);
    console.log('CELLNAME antes do tratamento: ', cellName);
    
   if(cellName === row.data_nascimento) {
    
    console.log('Dentro do IF: ', row);
    console.log('Dentro do IF: ', cellName);
    console.log('Row data Dentro do IF: ', row);
    console.log('CELLNAME Dentro do IF: ', cellName);
    
    var dtTratada = moment(dataToSend.data_nascimento.toString(), 'DD/MM/YYYY');
    var dtOriginal = dtTratada.format('YYYY-MM-DD');

    console.log('Data antes DENTRO DO IF:', dtTratada);
    console.log('Data depois DENTRO DO IF:', dtOriginal);

     row.data_nascimento = dtOriginal;
   }

   

   console.log('Data antes FORA DO IF:', dtTratada);
   console.log('Data depois FORA DO IF:', dtOriginal);

   console.log('DEPOIS do IF: ', row);
   console.log('DEPOIS do IF: ', cellName);

   console.log('data to send: ', dataToSend);
   console.log('token: ', localStorage.getItem('token'));
   console.log('id: ', id);

        axios.put("https://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas/"+id, row, {
          headers: {
            'x-access-token': localStorage.getItem('token')
          }
        }).then(a => {
          console.log(a);
        }).catch(e => {
          console.log(e);
        })

        var dtTratada = moment(dataToSend.data_nascimento.toString(), 'DD/MM/YYYY');
        var dtOriginal = dtTratada.format('YYYY-MM-DD');
        row.data_nascimento = dtOriginal;
        
        
        console.log('row:', row);
        console.log('CELLVALUE data depois:',cellValue )
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
        /*deleteRow*/
        >
          <TableHeaderColumn dataField='id' isKey >Id</TableHeaderColumn>
          <TableHeaderColumn dataField='nome'>Nome</TableHeaderColumn>
          <TableHeaderColumn dataField='data_nascimento'>Data de Nascimento</TableHeaderColumn>
          {/*<TableHeaderColumn dataField='nucleo' hidden >Núcleo</TableHeaderColumn>*/}
          <TableHeaderColumn dataField='nucleoDescricao'>Núcleo</TableHeaderColumn>
          <TableHeaderColumn dataField='numero'>Nº</TableHeaderColumn>
          {/*<TableHeaderColumn dataField='tamanho_camisa' hidden >Tamanho Camisa</TableHeaderColumn>*/}
          <TableHeaderColumn dataField='tamanho_camisaDescricao'>Tamanho Camisa</TableHeaderColumn>
          <TableHeaderColumn dataField='celular'>Telefone</TableHeaderColumn>
          <TableHeaderColumn dataField='ativo' hidden  editable={{ type: 'checkbox', options: { values: 'Ativo:Inativo' } }}>Status</TableHeaderColumn>
          {/*<TableHeaderColumn dataField='ativo' hidden hiddenOnInsert editable={{ type: 'checkbox', options: { values: 'Ativo:Inativo' } }}>Status</TableHeaderColumn>*/}
          {/* <TableHeaderColumn dataField='action' export={ false }>Delete</TableHeaderColumn> */}
        </BootstrapTable>
      </div>
    )
  }
}
