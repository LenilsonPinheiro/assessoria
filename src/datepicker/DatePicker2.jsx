import React, { Component } from 'react';
import DatePicker from 'react-bootstrap-date-picker';
import { FormGroup, ControlLabel } from 'react-bootstrap';

export default class DatePicker2 extends Component {
    constructor() {
        super();
        this.state = {
            valueStart: '',
            valueEnd: '',
            validationResult: {},
    }
}

onChangeStartDate = (value, formattedValue) => {
    this.setState({
      valueStart: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue, // Formatted String, ex: "11/19/2016"
    });
  }

componentDidUpdate = () => {
    // Access ISO String and formatted values from the DOM.
    var hiddenInputElement = document.getElementById("example-datepicker");
    console.log(hiddenInputElement.value); // ISO String, ex: "2016-11-19T12:00:00.000Z"
    console.log(hiddenInputElement.getAttribute('data-formattedvalue')) // Formatted String, ex: "11/19/2016"
}

render() {
    return (
        <div>
            <DatePicker
                id={'startDate'}
                dayLabels={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']}
                monthLabels={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                value={this.state.valueStart}
                onChange={this.onChangeStartDate}
                placeholder={"data inicial"}
            />
        </div>
    )
}
}
