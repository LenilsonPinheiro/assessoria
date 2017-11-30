import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerGeneral.css'

class DatePickerGeneral extends Component {

    constructor() {
        super();
        this.state = {
            selected: moment()
        };
      }
    
    render() {
        return (
            <div>
                <DatePicker
                    selected={this.props.selected}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}

export default DatePickerGeneral;