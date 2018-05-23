import React, { Component } from 'react';
import Auth from './Auth.js';
import Repo from './Repo.js';
import Labels from './Labels.js';
import Diagram from './Diagram.js';
import Github from '../lib/github.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repo: {},
      labels: [],
      results: []
    }
    this.github = new Github();

    this.changeRepo = this.changeRepo.bind(this);
    this.search = this.search.bind(this);
    this.auth = this.auth.bind(this);
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
    const {repo} = this.state;
    this.github.searchDetail(repo.name, repo.owner, labels, function (results) {
      this.setState(function() {
        return {
          results: results
        }
      })
    }.bind(this));
  }

  auth(options) {
    this.github.auth(options);
  }

  render() {
    return (
      <div className="App">
        <Auth onChange={this.auth} />
        <Repo onChange={this.changeRepo} />
        <Labels labels={this.state.labels} onChange={this.search} />
        {this.state.results.length > 0 ? <Diagram data={this.state.results} /> : ""}
      </div>
    );
  }
}

export default App;
