import React, { Component } from 'react';
//import logo from './logo.svg';
/*import LogoAndroid from './img/images.fw.png';
import LogoApple from './img/ios_app_store.fw.png';*/

import LogoAndroid from './img/GooglePlay.fw.png';
import LogoApple from './img/AppleStore.fw.png';

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
            <img src={LogoAndroid} alt="Download para Android" title="Download para Android" onClick="javascript:window.location='https://play.google.com/store/apps/details?id=br.com.labrih.fourthrotte'"/>
            
            {/*https://play.google.com/store/apps/details?id=br.com.labrih.fourthrotte*/}
            <img src={LogoApple} alt="Download para Apple" title="Download para IOS" onclick="javascript:window.location='https://play.google.com/store/apps/details?id=br.com.labrih.fourthrotte'"/>
          </div>
          
        </div>
        <div className="col-md-4 col-sm-4">
          <div className="counter">
            <img src={LinhaV} alt="linhaV"/>
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
    localStorage.clear();
    console.log(localStorage.getItem('token'))
    console.log(localStorage.getItem('token') !== '')
    if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== '' ) {
      this.setTable();      
    }
    /*this.email.value = 'labrih';
    this.password.value = 'labrih'*/
  }

  login = () => {
    const dataToSend = {
      /*usuario: 'labrih',
      senha: 'labrih'*/

      usuario: this.email.value,
      senha: this.password.value

    }
    axios.post('http://labrih-assessoriaesportiva.herokuapp.com/autenticar', dataToSend).then((response) => {
      this.treatResponse(response.data);
    }).catch(function (error) {
      /*console.log(error);*/
      alert("Login ou Senha inválidos.");
    });
}

treatResponse = (token) => { 
  
  localStorage.setItem('token', token);
  this.setTable();
  this.setState({logOutButton: <Button onclick= {this.logOut}>LogOut</Button>});
}

setTable = () => {
  this.setState({ content: <div className="panel panel-default"><TableExample /></div> });
}

logOut = () => {
  localStorage.clear();
  window.location.reload();
}

  render() {
    return (
      <div className="App">

        <section className="page-header">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1>Assesoria {this.state.logOutButton} </h1>

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
