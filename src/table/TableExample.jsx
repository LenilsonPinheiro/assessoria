import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, InsertModalHeader, InsertModalFooter } from 'react-bootstrap-table';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
//import TableFooter from './TableFooter'
import './TableExample.css';

import CpfEditor from  './CpfEditor';

import cpf from 'cpf';
import emailvalidator from 'email-validator';

export default class TableExample extends Component {
  constructor() {
    super();
    this.state = {
      rows: [],
      //tamanho_camisa: ['P', 'M', 'G', 'GG', 'XG'],
    }
  }

  componentDidMount = () => { // console.log('token', localStorage.getItem('tokenAssessoria'));

    
    var tamanhos = JSON.parse(localStorage.getItem('tamanhos'));
    var nucleos = JSON.parse(localStorage.getItem('nucleos'));

    let tamanho_camisa = [];
    tamanhos.map(tamanho => {
      tamanho_camisa.push(tamanho.Descricao);
    });
    let nucleos_desc = [];
    nucleos.map(nucleo => {
      nucleos_desc.push(nucleo.Descricao);
    });

    this.setState({
      tamanho_camisa,
      nucleos_desc
    });

    this.loadData();
  }

  loadData = () => {
    axios.get('https://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas', {
      headers: { 'x-access-token': localStorage.getItem('tokenAssessoria') }
    }).then((response) => {
      this.fillTable(response.data.data)
    })
      .catch(function (error) {
        console.log(error);
      });
  }


  fillTable = (runners) => {
    console.log(runners);
    var nucleos = JSON.parse(localStorage.getItem('nucleos'));
    var tamanhos = JSON.parse(localStorage.getItem('tamanhos'));
    
    console.log('tamanhos fillTable', tamanhos);
    let rows = [];

    runners.map((runner, key) => {
      return rows.push({
        id: runner._id,
        nome: runner.nome,
        email: runner.email,
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
        ativo: runner.ativo === true ? 'Ativo' : 'Inativo',
        cpf: runner.cpf,
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
    
    var dataToSend = {}
    save();
  }


  findNucleo = (nucleDesc) => {
    var nucleos = JSON.parse(localStorage.getItem('nucleos'));

    const nucleoDescricao = nucleos.find((element, index, array) => {
      return element.Descricao == nucleDesc
    })._id;

    return nucleoDescricao;
  }

  findTamanho = (tamanhoDesc) => {
    var tamanhos = JSON.parse(localStorage.getItem('tamanhos'));

    const tamDescricao = tamanhos.find((element, index, array) => {
      return element.Descricao == tamanhoDesc
    })._id;

    return tamDescricao;
  }

  onAfterInsertRow = (row) => {
    console.log("row", row);

    
    var dataToSend = {
      celular: row.celular,
      numero: row.numero,
      cpf: row.cpf,
      data_nascimento: row.data_nascimento,
      nome: row.nome,
      email: row.email,
      nucleo: this.findNucleo(row.nucleoDescricao),
      tamanho_camisa: this.findTamanho(row.tamanho_camisaDescricao),
      ativo: row.ativo,

    }
    let newRowStr = '';
    console.log('dataToSend', dataToSend);

    axios.post("https://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas/", dataToSend, {
      headers: {
      'x-access-token': localStorage.getItem('tokenAssessoria')
    }}).then((response) => {
      this.treatResponse(response.data);
    }).catch(function (error) {
      console.log(error);
      alert(error.response.data.data.message);
      this.loadData();
    });
    console.log("tokenAssessoria do salvar: ",localStorage.getItem('token'));
    }

  onAfterSaveCell = (row, cellName, cellValue) => {
    console.log('depois do salvar')
  }


  onBeforeSaveCell = (row, cellName, cellValue) => {
    console.log('beforesave', row);
    var id = row.id;

    let data = cellValue;

    if(cellName === 'data_nascimento') {

      if(cellValue.split('-').length > 1 && cellValue.split('-')[2].length == 4) {
        let dd = cellValue.split('-')[0];
        let mm = cellValue.split('-')[1];
        let yyyy = cellValue.split('-')[2];

        data = yyyy + '-' + mm + '-' + dd;
      } else {
        if(cellValue.split('/').length > 1) {
          if(cellValue.split('/')[2].length == 4) {
            let dd = cellValue.split('/')[0];
            let mm = cellValue.split('/')[1];
            let yyyy = cellValue.split('/')[2];
    
            data = yyyy + '-' + mm + '-' + dd;
          } else {
            let bar = '/'
            data = data.split("/").join("-");
          }
        }
      }

      data = data + 'T12:00:00.000Z';

    }
    else{
      if(cellName === 'nucleoDescricao') {
        cellName = 'nucleo';
        data = this.findNucleo(cellValue);
      } else {
        if(cellName === 'ativo') {
          data = cellValue === "Ativo" ? true : false;
        } else {
          if(cellName === 'tamanho_camisaDescricao') {
            cellName = 'tamanho_camisa';
            data = this.findTamanho(cellValue);
          }
        }
    }
  }

    const dataToSend = {
      [id]: id,
      [cellName]: data
    }
    

    console.log('dataToSend', dataToSend)

    axios.put("https://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas/"+id, dataToSend, {
      headers: {'x-access-token': localStorage.getItem('tokenAssessoria')}
    }).then(response => {
      console.log(response.data);
    }).catch(e => {
      console.log(e);
    });
  }

  handleModalClose = (closeModal) => {
    console.log('This is my custom function for modal close event');
    closeModal();
  }

  createCustomModalBody = (columns, validateState, ignoreEditable) => {
    console.log(columns);
    console.log(validateState);
    console.log(ignoreEditable)
  }


  ObrigatorioValidator = (value, row) => {
    if (value==="") {
      return "CAMPO OBRIGATÓRIO";
    }
    return true;
  }

  EMAILValidator = (value, row) => {
    if (!emailvalidator.validate(value)) {
      return "EMAIL INVÁLIDO";
    }
    return true;
  }

  CPFValidator = (value, row) => {
    if (!cpf.validate(value)) {
      return "CPF INVÁLIDO";
    }
    return true;
  }

  TELEFONEValidator = (value, row) => {
    //const nan = isNaN(parseInt(value, 11));
    if (! isNaN(value) && value.length >= 11) {
      return true;
    }
    return "TELEFONE INVÁLIDO";
  }

  cpfFormater = (cell) => {
    return `CPF :${cell}`
  }


  render() {
    const createPriceEditor = (onUpdate, props) => (<CpfEditor onUpdate={ onUpdate } {...props}/>);

    const options = {
      insertText: 'Inserir',
      deleteText: 'Excluir',
      saveText: 'Salvar',
      closetext: 'Fechar',
      insertModalHeader: this.createCustomModalHeader,
      insertModalFooter: this.createCustomModalFooter,
      afterInsertRow: this.onAfterInsertRow, // A hook for after insert rows
      insertModalBody: this.createCustomModalBody
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
          >
          <TableHeaderColumn  dataField='id' isKey hidden hiddenOnInsert autoValue={true}>Id</TableHeaderColumn>
          <TableHeaderColumn dataField='nome' placeholder= '(ddd)9999-9999' editable={ { validator: this.ObrigatorioValidator, placeholder: '(ddd)9999-9999'} }>Nome</TableHeaderColumn>
          <TableHeaderColumn dataField='email' editable={ { validator: this.EMAILValidator } }>Email</TableHeaderColumn>
          <TableHeaderColumn 
            dataField='cpf' 
            dataFormat={this.cpfFormater} 
            editable={ { validator: this.CPFValidator } } 
            customEditor={ { getElement: createPriceEditor, customEditorParameters: { cpf: cpf  } } }>CPF</TableHeaderColumn>
          <TableHeaderColumn dataField='data_nascimento' editable={ { validator: this.ObrigatorioValidator } }>Data de Nascimento</TableHeaderColumn>
          {<TableHeaderColumn dataField='nucleo' hidden hiddenOnInsert>Núcleo</TableHeaderColumn>}
          <TableHeaderColumn dataField='nucleoDescricao' editable={ { type:'select', options: {values: this.state.nucleos_desc} } }>Núcleo</TableHeaderColumn>
          <TableHeaderColumn dataField='numero' editable={ { validator: this.ObrigatorioValidator } }>Nº Tênis </TableHeaderColumn>
          {<TableHeaderColumn dataField='tamanho_camisa' hidden hiddenOnInsert>Tamanho Camisa</TableHeaderColumn>}
          <TableHeaderColumn dataField='tamanho_camisaDescricao' editable={ { type:'select', options: {values: this.state.tamanho_camisa} } }>Tamanho Camisa</TableHeaderColumn>
          <TableHeaderColumn dataField='celular' editable={ {type:'number', placeholder: '(ddd)9999-9999', validator: this.TELEFONEValidator } }>Telefone</TableHeaderColumn>
          <TableHeaderColumn dataField='ativo' editable={{ type: 'checkbox', options: { values: 'Ativo:Inativo' } }}>Status</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}
