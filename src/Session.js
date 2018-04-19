import React, { Component } from 'react';
import _ from 'lodash';

import Form from './Form.js';
import Storage from './Storage.js';

class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: { items: null, popped_items: [] },
      popped_items: null,
      start: 0,
      stop: 0,
      session_name: ""
    };

    this.handlePop = this.handlePop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeStop = this.handleChangeStop.bind(this);
    this.handleSessionFound = this.handleSessionFound.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);

    this.storage = new Storage();
  }

  handleSessionFound(session_name, session) {
    this.setState({ session_name, session });
  }

  writeSession(session_name, session) {
    return this.storage.setItem(session_name, session);
  }

  destroySession(session_name) {
    return this.storage.destroyItem(session_name, null);
  }

  copyToClipboard(number) {
    return (event) => {
      const textField = document.createElement('textarea');
      textField.innerText = number;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      this.setState({ copySuccess: 'Copied!' });
    };
  };

  createSession() {
    const { session_name, session, start, stop } = this.state;

    const unshuffledItems = _.range(start, stop + 1, 1);
    const items = _.shuffle(unshuffledItems);
    const paddingLength = String(_.max(items)).length;

    Object.assign(session, { items, paddingLength });
    this.writeSession(session_name, session);
    this.setState({ session_name, session });
  }

  paddedNumber(number) {
    const { paddingLength } = this.state.session;
    return String(number).padStart(paddingLength, "0");
  }

  handlePop(event) {
    const { session_name, session } = this.state;
    const { items, popped_items } = session;

    if (!items.length) {
      this.setState({ session_name: "", session: { items: null, popped_items: [] } });
      this.destroySession(session_name);
      return;
    }

    const lastNumber = items.pop();
    const pitems = Array.from(popped_items || [])

    const currentNumber = this.paddedNumber(lastNumber);
    pitems.push(currentNumber);

    Object.assign(session, { items, popped_items: pitems });

    this.writeSession(session_name, session);
    this.setState({ session, currentNumber, copySuccess: ""});

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
    const { session_name, session, currentNumber, error } = this.state;
    const { items, popped_items } = session;
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
                <span className="App-error">{startError}</span>
            }
          </p>

          <p className="App-form-element">
            <label>
              To:
              <input type="text" value={this.state.stop} onChange={this.handleChangeStop} />
            </label>
            {stopError && 
                <span className="App-error">{stopError}</span>
            }
          </p>

          <span className="App-form-element">
            <input type="submit" value="Create Session" />
          </span>
        </form>
      </div>
    );

    return (
      <div>
        <p className="App-intro">Randomization: {session_name} ({items.length} numbers left)</p>

        {currentNumber &&
            <span className="App-number" onClick={this.copyToClipboard(currentNumber)}>{currentNumber}</span>
        }

        <ul className="App-popped-items">
          {currentNumber &&
              popped_items.map((popped_item, index) => (
                <li key={ index }><span className="App-popped-item" onClick={this.copyToClipboard(popped_item)}>{popped_item}</span></li>
              )) 
          }
        </ul>

        <div className="App-form">
          <form onSubmit={this.handlePop}>
            <input type="submit" value="Next number" />
            <span className="App-warn">{this.state.copySuccess}</span>
          </form>
        </div>
      </div>
    );
  }
}

export default Session;
