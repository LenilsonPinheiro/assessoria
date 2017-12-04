import React, { Component } from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

export default class AtletaTable extends Component {
  constructor() {
    super();
    this.state = {
      auxModifyOrderingCode: true,
    };

    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.updateTable();
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    this.updateTable();
  }

  onClickEdit(idArea) {
    //this.props.showModal(idArea);
  }

  onClickRemove(idArea) {
    //GenericController.doRequest('delete', `/api/area/${idArea}`, this.treatDeleteResponse, null, true);
  }

  fillTable = (response) => {
    //const areas = response.data.content;
    const rows = [];
    var nucleos = JSON.parse(localStorage.getItem('nucleos'));
    var tamanhos = JSON.parse(localStorage.getItem('tamanhos'));

    console.log('response', response)

    response.map((runner, key) => {
      return rows.push(
        <tr className="clickable">
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {runner._id}
        </td>
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {runner.nome}
        </td>
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {runner.email}
        </td>
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {runner.cpf}
        </td>
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {moment(runner.data_nascimento).format('DD-MM-YYYY').toString()}
        </td>
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {nucleos.find((element, index, array) => {
            return element._id == runner.nucleo
          }).Descricao}
        </td>
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {runner.numero}
        </td>
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {tamanhos.find((element, index, array) => {
            return element._id == runner.tamanho_camisa
          }).Descricao}
        </td>
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {runner.celular}
        </td>
        <td onDoubleClick={() => this.onClickEdit(runner._id)}>
          {runner.ativo === true ? 'Ativo' : 'Inativo'}
        </td>
        </tr>
        )
    }),

    this.setState({
      tableRows: rows,
    });
  }

  treatDeleteResponse = (response) => {
    if (!response.status) {
      Alert.error('erro');
    } else {
      Alert.success('sucesso');
      this.updateTable();
    }
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

  updateTable = () => {
    this.loadData();
    //GenericController.doRequest('get', '/api/area/', this.props.fillTable);
  }

  render() {
    return (
      <div>
        <Button bsStyle='primary' className='includeButton' onClick={this.props.toogleModal}>Inserir </Button>
        <Row>
          <Col md={12} >
            {/*<div className="includeButton">{this.props.addButton}</div>*/}
            <Table bordered condensed hover className="iseqchart">
              <thead>
                <tr>
                  <th className="column_code_width" >ID</th>
                  <th className="column_code_width" >Nome</th>
                  <th className="column_title_width">Email</th>
                  <th className="column_title_width">CPF</th>
                  <th className="column_title_width">Data de Nascimento</th>
                  <th className="column_code_width">Núcleo</th>
                  <th className="column_code_width">Nº Tenis</th>
                  <th className="column_code_width">Tamanho Camiseta</th>
                  <th className="column_title_width">Telefone</th>
                  <th className="column_code_width">Status</th>
                  {/*<th className="column_code_width">
                    {T.translate('actions')}
      </th>*/}
                </tr>
              </thead>
              <tbody>
                {this.state.tableRows}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

