import React, { Component } from 'react';
//import logo from './logo.svg';
/*import LogoAndroid from './img/images.fw.png';
import LogoApple from './img/ios_app_store.fw.png';*/

import LogoAndroid from './img/GooglePlay.fw.png';
import LogoApple from './img/AppleStore.fw.png';
import Logo4Throtte from './img/logo2peq.fw.png';

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
            <a href="https://play.google.com/store/apps/details?id=br.com.labrih.fourthrotte" target="_blank"><img alt="4THROTTE" src="./img/GooglePlay.fw.png" class="img-responsive" ></img></a>
            <a href="https://play.google.com/store/apps/details?id=br.com.labrih.fourthrotte" target="_blank"><img alt="4THROTTE" src="./img/AppleStore.fw.png" class="img-responsive" ></img></a>
          </div>
        </div>
        <div className="col-md-4 col-sm-4">
          <div className="counter">
            <img src={LinhaV} alt="linhaV" />
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

  componentDidMount = () => {
    //localStorage.clear();

    //console.log(localStorage.getItem('tokenAssessoria'))
    if (localStorage.getItem('tokenAssessoria') !== null && localStorage.getItem('tokenAssessoria') !== '') {
      this.setTable();
    }
    this.email.value = 'labrih';
    this.password.value = 'labrih';
  }

  login = () => {
    const dataToSend = {
      usuario: this.email.value,
      senha: this.password.value
    }
    axios.post('http://labrih-assessoriaesportiva.herokuapp.com/autenticar', dataToSend)
    .then((response) => {
      localStorage.setItem('tokenAssessoria', response.data);
      return response.data;
    }).then(tokenAssessoria => {
      var cabecalho = {
        headers: {
          'x-access-token': tokenAssessoria
        }      
      }
      return axios.get('http://labrih-assessoriaesportiva.herokuapp.com/assessoria/nucleos', cabecalho);
    }).then(nucleoPromisse => {
      console.log('nucleos login', nucleoPromisse.data.data);
      localStorage.setItem('nucleos', JSON.stringify(nucleoPromisse.data.data));
    }).then(() => {
      var cabecalho = {
        headers: {
          'x-access-token': localStorage.getItem('tokenAssessoria')
        }      
      }
      return axios.get('http://labrih-assessoriaesportiva.herokuapp.com/assessoria/tamanhoscamisa', cabecalho);
    }).then(tamanhos => {
      console.log('tamanhos login', tamanhos.data.data);
      localStorage.setItem('tamanhos', JSON.stringify(tamanhos.data.data));
    }).then(() => {
      this.setTable();
      this.setState({ logOutButton: <Button onclick={this.logOut}>Sair</Button> });
    }).catch(function (error) {
      console.log(error);
      alert("Login ou Senha inválidos.");
    });
  }

  setTable = () => {
    this.setState({ content: <div className="panel panel-default"><TableExample /></div> });
  }

  logOut = () => {
    /*localStorage.clear();*/
    window.location.reload(true);

  }

  render() {
    return (
      <div className="App">

        <section className="page-header">
          <div className="container">
            <div className="row">
              <img src={Logo4Throtte} alt="4Throtte" title="4Throtte" />
              <div className="col-md-12">
                <h1>Assesoria XptOoo
                  <p>{this.state.logOutButton}</p>
                </h1>
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
                © Copyright 2017 <a href="\assessoria">ASSESSORIA</a>. | Todos os direitos reservados.
                  </div>
            </div>
          </div>
        </div>

      </div>

    );
  }
}

export default App;
