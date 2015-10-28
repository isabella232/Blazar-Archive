import React, {Component, PropTypes} from 'react';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import {bindAll} from 'underscore';

class FeedbackForm extends Component {

  constructor() {
    bindAll(this, 'toggleShow', 'submitFeedback', 'handleNameChange', 'handleMessageChange');
    this.state = {
      visable: false,
      nameValue: '',
      messageValue: '',
      submitDisabled: true,
      submitted: false
    }
  }

  toggleShow() {
    this.setState({
      visable: !this.state.visable,
      submitted: false
    });
  }

  getContainerClassName() {
    if (this.state.visable) {
      return 'feedback-container visable';
    } else {
      return 'feedback-container';
    }
  }

  handleNameChange() {
    this.setState({
      nameValue: this.refs.name.getValue(),
      submitDisabled: !(this.refs.name.getValue() && this.refs.message.getValue())
    });
  }

  handleMessageChange() {
    this.setState({
      messageValue: this.refs.message.getValue(),
      submitDisabled: !(this.refs.name.getValue() && this.refs.message.getValue())
    });
  }

  submitFeedback() {
    let name = this.state.nameValue;
    let message = this.state.messageValue;
    let url = window.location.href;
    let userAgent = navigator.userAgent;
    console.log(name, message, url, userAgent);
    this.setState({
      submitted: true,
      nameValue: '',
      messageValue: ''
    });
  }

  renderContent() {
    if (this.state.submitted) {
      return this.renderThanks();
    }
    else {
      return this.renderForm();
    }
  }

  renderThanks() {
    return (
      <div>
        <p>Thanks for your help in improving Blazar!</p>
        <p>To join the conversation, hit up #blazar in Slack.</p>
      </div>
    );
  }

  renderForm() {
    return (
      <div>
        <Input
          type="text"
          label="Name"
          ref="name"
          value={this.state.nameValue}
          onChange={this.handleNameChange} />
        <Input
          className="message-area"
          type="textarea"
          label="Message"
          ref="message"
          help="The URL of the page you are on (and other data) will be submitted with this form."
          value={this.state.messageValue}
          onChange={this.handleMessageChange} />
        <Button bsStyle="info" block disabled={this.state.submitDisabled} onClick={this.submitFeedback}>Submit</Button>
      </div>
    );
  }

  render() {
    return (
      <div className={this.getContainerClassName()}>
        <div className="feedback-title" onClick={this.toggleShow}>
          Give Feedback
        </div>
        <div className="feedback-form">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

export default FeedbackForm;
