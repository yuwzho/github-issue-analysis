import React, { Component } from 'react';
import Repo from './Repo.js';
import Labels from './Labels.js';
import Diagram from './Diagram.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repo: {},
      labels: [],
      results: []
    }
  }

  changeRepo(repo) {
    
  }

  search(labels) {}

  render() {
    return (
      <div className="App">
        <Repo onchange={this.changeRepo} />
        <Labels labels={this.state.labels} onchange={this.search} />
        <Diagram data={this.results} />
      </div>
    );
  }
}

export default App;
