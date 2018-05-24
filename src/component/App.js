import React, { Component } from 'react';
import Auth from './Auth.js';
import Repo from './Repo.js';
import Labels from './Labels.js';
import Diagram from './Diagram.js';
import Github from '../lib/github.js';
import ErrorPanel from './ErrorPanel.js';
import {tracePageView} from '../lib/telemetry.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repo: {},
      labels: [],
      results: [],
      searchable: true,
      error: ''
    }
    this.github = new Github();

    this.changeRepo = this.changeRepo.bind(this);
    this.search = this.search.bind(this);
    this.auth = this.auth.bind(this);
    this.clearError = this.clearError.bind(this);
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
    const { repo } = this.state;
    this.setState(function () {
      return {
        searchable: false
      }
    });
    this.github.searchDetail(repo.name, repo.owner, labels, function (results, error) {
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

  render() {
    return (
      <div className="App">
        <Auth onChange={this.auth} />
        <Repo onChange={this.changeRepo} />
        <Labels labels={this.state.labels} onChange={this.search} active={this.state.searchable} />
        {this.state.results.length > 0 ? <Diagram data={this.state.results} owner={this.state.repo.owner} repo={this.state.repo.name} /> : ''}
        {this.state.error ? <ErrorPanel data={this.state.error} onClose={this.clearError}/> : ''}
      </div>
    );
  }
}

export default App;
