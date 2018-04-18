import React, { Component } from 'react';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = { session_name: "" };

    this.handleSessionFound = props.sessionHandler;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const session_name = event.target.value;
    this.setState({ session_name });
  }

  getSession(session_name) {
    let session = null;
    const raw_session = localStorage.getItem(session_name);
    if (!raw_session) return null;

    try {
      session = JSON.parse(raw_session);
    } catch(error) { console.log('Error parsing session')}

    return session;
  }

  handleSubmit(event) {
    event.preventDefault();

    const { session_name } = this.state;
    const session = this.getSession(session_name);

    if (!session || !session.items.length) {
      this.setState({ errors: `No randomization found for '${session_name}'` });
      return;
    }

    this.handleSessionFound(session_name, session.items, session.paddingLength);
    this.setState({ errors: null});
  }

  render() {
    const { errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="App-form">
        <p className="App-form-element">
        <label>
           If you know the <b>name</b> of a running randomization type it here:
          <input type="text" value={this.state.session_name} onChange={this.handleChange} />
        </label>
        </p>
        <p className="App-form-element">
          <input type="submit" value="Find" />
        </p>
        {errors && 
          <span className="App-error">{errors}</span>
        }
      </form>
    );
  }
}

export default Form;
