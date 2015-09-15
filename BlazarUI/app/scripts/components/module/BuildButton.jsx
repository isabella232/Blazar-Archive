import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import Icon from '../shared/Icon.jsx';
import $ from 'jquery';

class BuildButton extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: false, textStatus: ''};
  }

  build() {
    this.setState({
      loading: true
    });
    $.ajax({
      url: `${config.apiRoot}/build/module/${this.props.moduleId}`,
      type: 'POST'
    }).then(() => {
      this.setState({
        loading: false,
        textStatus: ''
      });
    },
    (data, textStatus, jqXHR) => {
      this.setState({
        loading: false,
        textStatus: jqXHR
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <Button bsStyle="primary" disabled><Icon type="fa" name="circle-o-notch" classNames="fa-spin" /> Build Now</Button>;
    } else {
      return (
        <div>
          <span>{this.state.textStatus} </span>
          <Button bsStyle="primary" onClick={this.build.bind(this)}> Build Now</Button>
        </div>
      );
    }
  }
}

BuildButton.propTypes = {
  moduleId: PropTypes.number.isRequired
};

export default BuildButton;
