import React, { Component } from 'react';
import _ from 'lodash';

import Form from './Form.js';

class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: null,
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

    const unshuffledItems = _.range(start, stop + 1, 1);
    const items = _.shuffle(unshuffledItems);
    const paddingLength = String(_.max(items)).length;

    this.writeSession(session_name, items);
    this.setState({ session_name, items, paddingLength });
  }

  paddedNumber(number) {
    const { paddingLength } = this.state;
    return String(number).padStart(paddingLength, "0");
  }

  handlePop(event) {
    const { session_name, items } = this.state;

    if (!items.length) {
      this.setState({ session_name: null, items: null });
      return;
    }

    const lastNumber = items.pop();
    const currentNumber = this.paddedNumber(lastNumber);
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

    if (!items) return (
      <div>
        <div>
          <Form sessionHandler={this.handleSessionFound} />
        </div>

        <p className="App-intro">Start a new one</p>

        <form onSubmit={this.handleSubmit} className="App-form">
          <p className="App-form-element">
            <label>
              Name:
              <input type="text" value={this.state.session_name} onChange={this.handleChangeName} />
            </label>
          </p>

          <p className="App-form-element">
            <label>
              From:
              <input type="text" value={this.state.start} onChange={this.handleChangeStart} />
            </label>
            {startError && 
                <p className="App-error">{startError}</p>
            }
          </p>

          <p className="App-form-element">
            <label>
              To:
              <input type="text" value={this.state.stop} onChange={this.handleChangeStop} />
            </label>
            {stopError && 
                <p className="App-error">{stopError}</p>
            }
          </p>

          <p className="App-form-element">
            <input type="submit" value="Create Session" />
          </p>
        </form>
      </div>
    );

    return (
      <div>
        <p className="App-intro">Randomization: {session_name}</p>

        {currentNumber &&
            <span className="App-number">{currentNumber}</span>
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
