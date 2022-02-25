import React from 'react';

class SelectField extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value: props.value, label: props.label, selectedValue: null
    }
    this.sendToParent = this.sendToParent.bind(this);
  }

  sendToParent = () => {
    // console.log(this.state.selectedValue);
      this.props.selectInfo(this.state.selectedValue)
  }



  render() {
    return(
        <div className="field">
            <h4>  {this.state.label}</h4>
            <select className="form-control" onChange={(e) => { this.setState({ selectedValue: e.target.value}, this.sendToParent)}} required>
              <option selected disabled value="">Choose one...</option>
              {this.props.value.map( (item, index) => {
                return <option key={index} value={item}>{item}</option>
              })}
            </select>
            <div class="invalid-feedback">
              Please select an option.
            </div>
        </div>
        )
      }
    }

export default SelectField;
