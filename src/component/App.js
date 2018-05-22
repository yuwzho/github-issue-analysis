import React, { Component } from 'react';
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
  }

  changeRepo(name, owner) {
    if (name && owner) {
      this.github.queryLabels(name, owner, function (labels) {
        this.setState(function () {
        console.log(labels)
        
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

  search(labels) { }

  render() {
    return (
      <div className="App">
        <Repo className='repo' onChange={this.changeRepo} />
        <Labels labels={this.state.labels} onChange={this.search} />
        <Diagram data={this.results} />
      </div>
    );
  }
}

export default App;
