import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn, InsertButton, InsertModalHeader, InsertModalFooter} from 'react-bootstrap-table';

import './TableExample.css';

var student = [{
    id: 1,
    name: "Lenilson",
    telephone: "(85) 99733-1000",
    status: 'Ativo'
}, {
    id: 2,
    name: "Ivo",
    telephone: "24",
    status: 'Pendente'
}, {
    id: 3,
    name: "Helderrr",
    telephone: "02424242424",
    status: 'Ativo'
}];

const options = {
    /*onRowClick: function(row) {
      alert(`You click row id: ${row.id}`);
    },*/
    /*onRowDoubleClick: function(row) {
      alert(`You double click row id: ${row.id}`);
    },*/
    /* insertBtn(onClick){
        return (
          <InsertButton
            btnText='Inserir'
            btnContextual='btn-success'
            className='my-custom-class'
            btnGlyphicon='glyphicon-edit'
           onClick={ options.createCustomModalHeader() }/>
        );
      }
    , */
    handleInsertButtonClick(onClick) {
        // Custom your onClick event here,
        // it's not necessary to implement this function if you have no any process before onClick
        console.log('This is my custom function for InserButton click event');
        onClick();
      },
    beforeClose(e) {
        alert(`[Custom Event]: Before modal close event triggered!`);
      },
    handleModalClose(closeModal) {
        // Custom your onCloseModal event here,
        // it's not necessary to implement this function if you have no any process before modal close
        console.log('This is my custom function for modal close event');
        closeModal();
    },
    createCustomModalHeader(closeModal, save) {
        return (
            <InsertModalHeader
            className='my-custom-class'
            title='Inserir'
            beforeClose={ this.beforeClose }
            onModalClose={ () => this.handleModalClose() }/>
            // hideClose={ true } to hide the close button
        );
    }
}

const selectRow = {
    mode: 'checkbox',
    //showOnlySelected: true
  };

export default class TableExample extends Component {
    constructor() {
        super();
        this.state = {}
    }

  render() {
    return (
      <div>
          { /*<InsertButton
            btnText='insert customizado'
            btnContextual='btn-warning'
            className='my-custom-class'
            btnGlyphicon='glyphicon-edit'
            onClick={ () => this.handleInsertButtonClick() }
          /> */}
         <BootstrapTable data={ student } options={ options } selectRow={ selectRow } striped hover condensed insertRow deleteRow>
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
