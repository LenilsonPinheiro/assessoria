import React, { Component } from 'react';
import logo from './logo.svg';
import LogoAndroid from './img/images.fw.png';
import LogoApple from './img/ios_app_store.fw.png';
import LinhaV from './img/LinhaV.png';
import TableExample from './table/TableExample'
import axios from 'axios';
import './App.css';

import { Button } from 'react-bootstrap';

class App extends Component {

  constructor() {
    super();
    this.state = {
      content: <div className="counters counters-text-light">
        <div className="col-md-4 col-sm-4">
          <div className="counter">
            <p>App do aluno. Escolha uma das opções disponíveis.</p>
            <img src={LogoAndroid} alt="logo Android" />
            <img src={LogoApple} alt="logo Apple" />
          </div>
        </div>
        <div className="col-md-4 col-sm-4">
          <div className="counter">
            <img src={LinhaV} />
          </div>
        </div>
        <div className="col-md-4 col-sm-4">
          <div className="counter">
            <p>Área Restrita a acessoria.</p>
            <label>
              <p>Email:<input ref={input => this.email = input} type="text" name="Email" /></p>
            </label>
            <label>
              <p>Senha:<input ref={input => this.password = input} type="password" name="Senha" /></p>
            </label>
            <p>
              <Button onClick={this.login}>Login</Button>
            </p>
          </div>
        </div>
      </div>
    };
  }

  componentDidMount() {
    this.email.value = 'contato@labrih.com.br';
    this.password.value = 'contato'
  }

  login = () => {
    const dataToSend = {
      email: 'contato@labrih.com.br',
      password: 'contato'
    }
    axios.post('http://labrih-assessoriaesportiva.herokuapp.com/authenticate', dataToSend).then((response) => {
      this.treatResponse(response.data);
    }).catch(function (error) {
      console.log(error);
    });
}

treatResponse = (token) => {
  localStorage.setItem('token', token);
  this.setState({ content: <div className="panel panel-default"><TableExample /></div> });
}

  render() {
    return (
      <div className="App">

        <section className="page-header">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1>Assesoria</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-primary mb-none">
          <div className="container">
            <div className="row">
              {this.state.content}
            </div>
          </div>
        </section>


        <div className="footer-copyright">
          <div className="container">
            <div className="row">
              <div>
                © Copyright 2017 <a href="\assessoria">ASSESSORIA</a>. Todos os direitos reservados.
                  </div>
            </div>
          </div>
        </div>

      </div>

    );
  }
}

export default App;
