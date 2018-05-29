import React, { Component } from 'react';
import Auth from './Auth.js';
import Repo from './Repo.js';
import Labels from './Labels.js';
import Diagram from './Diagram.js';
import Github from '../lib/github.js';
import ErrorPanel from './ErrorPanel.js';
import StateChoose from './StateChoose.js';
import {tracePageView} from '../lib/telemetry.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repo: {},
      labels: [],
      results: [],
      searchable: true,
      type: [],
      state: '',
      error: ''
    }
    this.github = new Github();

    this.changeRepo = this.changeRepo.bind(this);
    this.search = this.search.bind(this);
    this.auth = this.auth.bind(this);
    this.clearError = this.clearError.bind(this);
    this.stateChange = this.stateChange.bind(this);
    this.typeChange = this.typeChange.bind(this);
    tracePageView();
  }

  changeRepo(name, owner) {
    if (name && owner) {
      this.github.queryLabels(name, owner, function (labels) {
        this.setState(function () {
          return {
            repo: {
              name: name,
              owner: owner
            },
            labels: labels
          }
        });
      }.bind(this));
    }
  }

  search(labels) {
    const { repo, type, state } = this.state;
    this.setState(function () {
      return {
        searchable: false
      }
    });

    var queryString = '';
    for (var i = 0; i < labels.length; i++) {
      queryString = queryString + 'label:' + labels[i] + '+';
    }
    this.github.searchDetail({
      name: repo.name,
      owner: repo.owner,
      queryString: queryString + type.join('+') + '+' + state
    }, function (results, error) {
      this.setState(function () {
        return {
          results: error ? [] : results,
          error: error ? error : '',
          searchable: true
        }
      })
    }.bind(this));
  }

  auth(options) {
    this.github.auth(options, function (error) {
      this.setState(function() {
        return {
          error: error
        }
      })
    }.bind(this));
  }

  clearError() {
    this.setState(function() {
      return {
        error: ''
      }
    });
  }

  typeChange(e, value) {
    const { type } = this.state;
    var checked = e.target.checked;

    if (checked) {
      if (type.indexOf(value) < 0) {
        type.push(value);
      }
    }else {
      var index = type.indexOf(value);
      if (index >= 0) {
        type.splice(index, 1);
      }
    }

    this.setState({
      type: type
    })
  }

  stateChange(value) {
    this.setState({
      state: value
    });
  }

  render() {
    return (
      <div className="App">
        <Auth onChange={this.auth} />
        <Repo onChange={this.changeRepo} />
        <StateChoose onChange={this.stateChange} onTypeChange={this.typeChange} />
        <Labels labels={this.state.labels} onChange={this.search} active={this.state.searchable} />
        {this.state.results.length > 0 ? <Diagram data={this.state.results} owner={this.state.repo.owner} repo={this.state.repo.name} /> : ''}
        {this.state.error ? <ErrorPanel data={this.state.error} onClose={this.clearError}/> : ''}
      </div>
    );
  }
}

export default App;
