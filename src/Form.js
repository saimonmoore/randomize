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
    let items = [];
    const session = localStorage.getItem(session_name);
    try {
      items = JSON.parse(`[${session}]`);
    } catch(error) { console.log('Error parsing session')}

    return items;
  }

  handleSubmit(event) {
    const { session_name } = this.state;
    const session = this.getSession(session_name);
    this.handleSessionFound(session_name, session);

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p className="App-intro">If you know the <b>name</b> of a running session type it here:</p>
        <label>
          <input type="text" value={this.state.session_name} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Find" />
      </form>
    );
  }
}

export default Form;
