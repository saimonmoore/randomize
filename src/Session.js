import React, { Component } from 'react';
import _ from 'lodash';

import Form from './Form.js';

class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      start: 0,
      stop: 0,
      session_name: null
    };

    this.handlePop = this.handlePop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeStop = this.handleChangeStop.bind(this);
    this.handleSessionFound = this.handleSessionFound.bind(this);
  }

  handleSessionFound(session_name, items) {
    this.setState({ session_name, items });
  }

  writeSession(session_name, items) {
    return localStorage.setItem(session_name, items);
  }

  createSession() {
    const { session_name, start, stop } = this.state;

    const unshuffledItems = _.range(start, stop, 1);
    const items = _.shuffle(unshuffledItems);
    this.writeSession(session_name, items);
    this.setState({ session_name, items });
  }

  handlePop(event) {
    const { session_name, items } = this.state;
    const currentNumber = items.pop();
    this.writeSession(session_name, items);
    this.setState({ items, currentNumber});

    event.preventDefault();
  }

  handleSubmit(event) {
    this.createSession();

    event.preventDefault();
  }

  handleChangeName(event) {
    const session_name = event.target.value;
    this.setState({ session_name, error: null });

    event.preventDefault();
  }

  handleChangeStart(event) {
    const start = parseInt(event.target.value, 10) || 0;
    const { stop } = this.state;

    if (start < stop) {
      this.setState({ start, errors: {} });
    } else {
      this.setState({ start, errors: { start: "`start` must be less than `stop`" }});
    }
    event.preventDefault();
  }

  handleChangeStop(event) {
    const stop = parseInt(event.target.value, 10) || 0;
    const { start } = this.state;

    if (stop > start) {
      this.setState({ stop, error: {} });
    } else {
      this.setState({ stop, error: { stop: "`stop` must be greater than `start`" }});
    }
    event.preventDefault();
  }

  render() {
    const { session_name, items, currentNumber, error } = this.state;
    const startError = error && error.start;
    const stopError = error && error.stop;

    if (!items || !items.length) return (
      <div>
        <p className="App-intro">No Session Found!</p>

        <div>
          <Form sessionHandler={this.handleSessionFound} />
        </div>

        <p className="App-intro">Start a new one</p>

        <form onSubmit={this.handleSubmit}>
          <p className="App-intro">
          <label>
            Name:
            <input type="text" value={this.state.session_name} onChange={this.handleChangeName} />
          </label>
          </p>

          <p className="App-intro">
          <label>
            From:
            <input type="text" value={this.state.start} onChange={this.handleChangeStart} />
          </label>
          {startError && 
              <p className="App-error">{startError}</p>
          }
          </p>

          <p className="App-intro">
          <label>
            To:
            <input type="text" value={this.state.stop} onChange={this.handleChangeStop} />
          </label>
          {stopError && 
              <p className="App-error">{stopError}</p>
          }
          </p>

          <input type="submit" value="Create Session" />
        </form>
      </div>
    );

    return (
      <div>
        <p className="App-intro">Session: {session_name}</p>

        {currentNumber &&
            <span className="App-number">{currentNumber}</span>
        }

        { !currentNumber &&
            <p className="App-intro">Click <i>Next number</i></p>
        }

        <form onSubmit={this.handlePop}>
          <p className="App-intro">{items.length} numbers left</p>
          <input type="submit" value="Next number" />
        </form>
      </div>
    );
  }
}

export default Session;
