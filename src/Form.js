import React, { Component } from 'react';
import Storage from './Storage.js';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = { session_name: "" };

    this.handleSessionFound = props.sessionHandler;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.storage = new Storage();
  }

  handleChange(event) {
    const session_name = event.target.value;
    this.setState({ session_name });
  }

  getSession(session_name, fn) {
    this.storage.getItem(session_name, (error, session) => {
      if (error) return fn(error, null);
      if (!session) return fn(null, null);
      if (!session.items.length) return fn(null, null);

      fn(null, session);
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { session_name } = this.state;
    this.getSession(session_name, (error, session) => {
      if (error) {
        this.setState({ errors: `Failed to get randomization for '${session_name}'...error: ${error}` });
        return;
      }

      if (!session || !session.items.length) {
        this.setState({ errors: `No randomization found for '${session_name}'` });
        return;
      }

      this.handleSessionFound(session_name, session);
      this.setState({ errors: null});
    });
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
