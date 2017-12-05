import React from 'react';
import { Modal, Button, HelpBlock, FormControl, ControlLabel, FormGroup, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import shortid from 'shortid';
import axios from 'axios';
//import Alert from 'react-s-alert';
import MaskedFormControl from 'react-bootstrap-maskedinput'
import cpf from 'cpf';
import emailvalidator from 'email-validator';

import DatePickerGeneral from '../datepicker/DatePickerGeneral';
import Validator from './Validator';

export default class InsertModal extends Validator {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: 'Inserir Atleta',
      showModal: false,
      startDate: '',
      validationResult: {},
      fieldOnlyNumbers: '',
      cpf: '',
      celular: '',
    };

    this.fieldWriteOnlyNumbers = this.fieldWriteOnlyNumbers.bind(this);
  }

  componentDidMount() {
    this.fillNucleoDropdown();
    this.fillTamanhoDropdown();
  }

  onChangeStartDate = (value, formattedValue) => {console.log(value)
    this.setState({
      startDate: value ? value.split('T')[0] + 'T12:00:00.000Z' : '', // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue, // Formatted String, ex: "11/19/2016"
    });
  }

  componentWillReceiveProps(nextProps) {
    this.fillNucleoDropdown();
    this.fillTamanhoDropdown();
    const showModal = nextProps.modal.showModal;

    this.setState({ showModal });


    const atleta = nextProps.modal.atleta;
    
    if (atleta !== null && atleta._id && showModal) {
      console.log(atleta);
      this.fillModalToEdit(atleta);
    }
  }

  fillModalToEdit = (atleta) => {
    setTimeout(() => {
      if(this.nome){
        this.nome.value = atleta.nome;
        this.email.value = atleta.email;
        this.nucleo.value = atleta.nucleo;
        this.camisa.value = atleta.tamanho_camisa;
        this.status.value = atleta.ativo ? 0 : 1;
        this.setState({
          cpf: atleta.cpf,
          celular: atleta.celular,
          fieldOnlyNumbers: atleta.numero,
          startDate: atleta.data_nascimento,
        })
      }
    }, 1000);
  }
/*
  fillModalToEdit = (response) => {
    const area = response.data;
    this.setModalTitleToEdit(area.idArea);
    this.setSchemaToEdit(area);
  }

  setModalTitleToEdit(idArea) {
    this.setState({ modalTitle: T.translate('editSomething', { name: T.translate('area'), code: idArea }) });
  }

  fillSchemaDropdown = (response) => {
    const items = response.data.map(
            schema => <option key={shortid.generate()} value={schema}>{schema}</option>,
        );
    this.setState({ schemaDropdownOptions: items });
  }

  setSchemaToEdit(area) {
    this.schema.value = area.schema;
    this.fillOtherFields(area);
  }

  fillOtherFields(area) {
    this.title.value = area.titulo.trim();
    const description = area.descricao;
    this.description.value = description ? description.trim() : description;
    this.status.value = T.translate(area.status ? 'true' : 'false');
  }  

  checkIfTitleIsValid = (dataTosend, response) => {
    console.log("dataTosend: ", dataTosend);
    console.log("response: ", response);
    if ((response.data.content.length === 0 && !dataTosend.idArea) ||
    (response.data.content.length > 0 &&
    response.data.content[0].idArea === dataTosend.idArea) ||
    (response.data.content.length === 0 &&
    dataTosend.idArea)) {
      GenericController.doRequest(dataTosend.idArea ? 'put' : 'post', '/api/area/', this.treatResponse, dataTosend);
    } else {
      this.validate(true, 'title', T.translate('titleAlreadyExists'));
    }
  }

  treatResponse = (response) => {
    if (response.status) {
      Alert.success(T.translate('operationSuccessful'));
      GenericController.doRequest('get', this.props.url, this.props.fillTable);
    } else {
      Alert.error(T.translate('operationFailed'));
    }
    this.closeModal();
  }

  isValid(data) {
    const titleIsValid = this.validate(data.title === '' || data.title.length > 150, 'title', T.translate('fieldWithMaximumSize', { required: 'obrigatório', size: '150' }));
    const schemaIsValid = this.validate(data.schema === '0', 'schema');
    const descriptionIsValid = this.validate(data.description !== '' && data.description.length > 250, 'description', T.translate('fieldWithMaximumSize', { size: '250' }));
    return titleIsValid && descriptionIsValid && schemaIsValid;
  } */

  toogleModal = () => {
    this.props.setTable();
    this.props.closeModal();
    this.setState({
      validationResult: {},
    });
  }

  treatResponse = (response) => {
    if (!response.success) {
      alert('erro');
    } else {
      alert('Ação realizada com sucesso!');
      this.toogleModal();
    }
    
  }

  onSubmit = () => {
    const data = {
      nome: this.nome.value.trim(),
      ativo: this.status.value === '0',
      cpf: this.state.cpf.split('.').join('').split('-').join(''),
      email: this.email.value,
      nucleo: this.nucleo.value,
      tamanho_camisa: this.camisa.value,
      numero: this.numero.value,
      celular: this.state.celular.split('(').join('').split(')').join('').split('-').join('').split('_').join(''),
      data_nascimento: this.state.startDate,
    };

    const dateIsValid = this.validate(data.data_nascimento === '', 'date', 'Campo Obrigatório');
    const nameIsValid = this.validate(data.nome === '', 'nome', 'Campo Obrigatório');
    const emailIsValid = this.validate(!emailvalidator.validate(data.email), 'email', 'Email Inválido' || data.email === '', 'email', 'Campo Obrigatório');
    const numeroIsValid = this.validate(data.numero === '', 'numero', 'Campo Obrigatório');
    const nucleoIsValid = this.validate(data.nucleo === '0', 'nucleo', 'Campo Obrigatório');
    const tamanhoIsValid = this.validate(data.tamanho_camisa === '0', 'tamanho', 'Campo Obrigatório');
    const celularIsValid = this.validate(data.celular === '' || data.celular.length < 11, 'celular', 'Campo Obrigatório');

    const cpfIsValid = this.validate(!cpf.validate(data.cpf), 'cpf', 'CPF Inválido' || data.celular === '', 'cpf', 'Campo Obrigatório');

    if(dateIsValid && nameIsValid && emailIsValid && 
      numeroIsValid && nucleoIsValid && tamanhoIsValid && 
      celularIsValid && cpfIsValid) {

        if (this.props.modal.atleta !== null && this.props.modal.atleta._id) {
          console.log('puting')
          axios.put("https://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas/"+this.props.modal.atleta._id, data, {
            headers: {'x-access-token': localStorage.getItem('tokenAssessoria')}
          }).then(response => {
            console.log(response)
            this.treatResponse(response.data);
          }).catch(e => {
            console.log(e);
          });

        } else {
          console.log('posting')
          axios.post("https://labrih-assessoriaesportiva.herokuapp.com/assessoria/atletas/", data, {
            headers: {
            'x-access-token': localStorage.getItem('tokenAssessoria')
          }}).then((response) => {
            this.treatResponse(response.data);
          }).catch(function (error) {
            alert(error.response.data.message);
            //this.loadData();
          });
          console.log("tokenAssessoria do salvar: ",localStorage.getItem('tokenAssessoria'));
        }

    }
    
  }

  onPhoneChanged = (e) => {
    this.setState({celular: e.target.value});
  }

  onCPFChanged = (e, value) => {
    this.setState({cpf: e.target.value});
  }

  fieldWriteOnlyNumbers(e) {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      this.setState({ fieldOnlyNumbers: e.target.value });
    }
  }

  fillNucleoDropdown = () => {
    var nucleos = JSON.parse(localStorage.getItem('nucleos'));

    if(nucleos){
      const items = nucleos.map(
        nucleo => <option key={shortid.generate()} value={nucleo._id}>{nucleo.Descricao}</option>,
      );

      this.setState({ nucleoDropdownOptions: items });
    }
  }

  fillTamanhoDropdown = () => {
    var tamanhos = JSON.parse(localStorage.getItem('tamanhos'));

    if(tamanhos){
      const items = tamanhos.map(
        tamanho => <option key={shortid.generate()} value={tamanho._id}>{tamanho.Descricao}</option>,
      );

      this.setState({ tamanhoDropdownOptions: items });
    }
  }

  onChangeInitialDate(value) {
    this.setState({
      initialDate: value,
    });
  }

  render() {
    const { validationResult } = this.state;

    return (
      <Modal show={this.state.showModal}>
        <Modal.Header>
          <Modal.Title>{this.state.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FormGroup validationState={validationResult.nomeValidationState}>
              <ControlLabel>Nome*</ControlLabel>
              <FormControl
                type="text"
                maxLength="150"
                inputRef={(input) => { this.nome = input; }}
              />
              <HelpBlock>{validationResult.nomeMessage}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={validationResult.emailValidationState}>
              <ControlLabel>Email*</ControlLabel>
              <FormControl
                type="text"
                maxLength="50"
                inputRef={(input) => { this.email = input; }}
              />
              <HelpBlock>{validationResult.emailMessage}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={validationResult.cpfValidationState}>
              <ControlLabel>CPF*</ControlLabel>
              <MaskedFormControl 
                type='text' 
                name='cpf' 
                mask='111.111.111-11'
                value={this.state.cpf}
                onChange={this.onCPFChanged}
                inputRef={(input) => { this.cpf = input; }}/>
                
              <HelpBlock>{validationResult.cpfMessage}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={validationResult.dateValidationState}>
              <ControlLabel>Data de Nascimento*</ControlLabel>
                  <DatePicker
                  id={'startDate'}
                  dayLabels={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']}
                  monthLabels={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                  value={this.state.startDate}
                  onChange={this.onChangeStartDate}
                  placeholder={'Data de Nascimento'}
                /> 
              <HelpBlock>{validationResult.dateMessage}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={validationResult.nucleoValidationState}>
              <ControlLabel>Nucleo*</ControlLabel>
              <FormControl
                inputRef={(input) => { this.nucleo = input; }}
                componentClass="select"
              >
                <option value="0">{'Selecione um núcleo'}</option>
                {this.state.nucleoDropdownOptions}
              </FormControl>
              <HelpBlock>{validationResult.nucleoMessage}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={validationResult.numeroValidationState}>
              <ControlLabel>Nº Tenis*</ControlLabel>
              <FormControl
                type="text"
                maxLength="2"
                inputRef={(input) => { this.numero = input; }}
                value={this.state.fieldOnlyNumbers}
                onChange={this.fieldWriteOnlyNumbers}
              />
              <HelpBlock>{validationResult.numeroMessage}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={validationResult.tamanhoValidationState}>
              <ControlLabel>Tamanho Camiseta*</ControlLabel>
              <FormControl
                inputRef={(input) => { this.camisa = input; }}
                componentClass="select"
              >
                <option value="0">{'Selecione um tamanho'}</option>
                {this.state.tamanhoDropdownOptions}
              </FormControl>
              <HelpBlock>{validationResult.tamanhoMessage}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={validationResult.celularValidationState}>
              <ControlLabel>Telefone*</ControlLabel>
              <MaskedFormControl 
                type='text' 
                name='phoneNumber' 
                mask='(11)11111-1111'
                value={this.state.celular}
                onChange={this.onPhoneChanged}/>
              <HelpBlock>{validationResult.celularMessage}</HelpBlock>
            </FormGroup>

            <FormGroup validationState={validationResult.statusValidationState}>
              <ControlLabel>Status</ControlLabel>
              <FormControl
                inputRef={(input) => { this.status = input; }}
                componentClass="select"
              >
                <option value="0">{'Ativo'}</option>
                <option value="1">{'Inativo'}</option>
              </FormControl>
              <HelpBlock>{validationResult.statusMessage}</HelpBlock>
            </FormGroup>



            <FormGroup validationState={validationResult.statusValidationState}>
              <ControlLabel>Legenda:  * Campos obrigatórios.</ControlLabel>
            </FormGroup>



          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.toogleModal}>Cancelar</Button>
          <Button bsStyle="success" onClick={this.onSubmit}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}
