import React, { Component } from 'react';
import logo from './logo.svg';
import LogoAndroid from './img/images.fw.png';
import LogoApple from './img/ios_app_store.fw.png';
import LinhaV from  './img/LinhaV.png';
import TableExample from './table/TableExample'

import './App.css';

import {Button} from 'react-bootstrap';

class App extends Component {

  constructor() {
    super();
    this.state = {
      content: <div class="counters counters-text-light">
      <div class="col-md-4 col-sm-4">
        <div class="counter">
        <p>App do aluno. Escolha uma das opções disponíveis.</p>
          <img src={LogoAndroid} alt="logo Android" />
          <img src={LogoApple} alt="logo Apple" />
          
          

          
        </div>
      </div>
      <div class="col-md-4 col-sm-4">
        <div class="counter">
          <img src={LinhaV} />
        </div>
      </div>
      <div class="col-md-4 col-sm-4">
        <div class="counter">
        <p>Área Restrita a acessoria.</p>
          <label>
            <p>Email:<input type="text" name="Email" /></p>
          </label>
          <label>
            <p>Senha:<input type="password" name="Senha" /></p>
          </label>
          <p>
            <Button onClick={this.onClickLogin}>Login</Button>
          </p>							
        </div>
      </div>
    </div>
    };
  }

  onClickLogin = () => {
    this.setState({ content: 

      <div class="panel panel-default">
        <TableExample />
      </div>
     })
  }

  render() {
    return (
      <div className="App">
        
        <section class="page-header">
          <div class="container">
              <div class="row">
                  <div class="col-md-12">
                      <h1>Assesoria</h1>
                  </div>
              </div>
          </div>
        </section>

        <section class="section section-primary mb-none">
            <div class="container">
                <div class="row">
                    {this.state.content}
                </div>
              </div>
        </section>


        <div class="footer-copyright">
          <div class="container">
              <div class="row">
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
