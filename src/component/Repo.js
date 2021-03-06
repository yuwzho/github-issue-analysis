import React, { Component } from 'react';
import { Button, Label } from 'react-bootstrap';
var github_url_parser = require('parse-github-url');

const REPO_URL = 'repoUrl';

class Repo extends Component {
  constructor(props) {
    super(props);

    var repoUrl = localStorage.getItem(REPO_URL);
    this.state = {
      name: '',
      owner: '',
      editing: !repoUrl,
      input: repoUrl,
      error: ''
    }

    this.switchEdit = this.switchEdit.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.parseRepo = this.parseRepo.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    this.parseRepo()
  }

  switchEdit() {
    const { editing } = this.state;
    this.setState(function () {
      return {
        editing: !editing
      }
    });
  }

  updateInputValue(evt) {
    this.setState({
      input: evt.target.value
    }
    );
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.parseRepo();
    }
  }

  parseRepo() {
    const { input } = this.state;
    var obj = github_url_parser(input);
    if (!obj || !obj.name || !obj.name) {
      this.setState(function() {
        return {
          error: 'Your input is not a valid github repo url'
        }
      });
    }else {
      localStorage.setItem(REPO_URL, input);
      this.setState(function () {
        return {
          name: obj.name,
          owner: obj.owner,
          editing: false,
          error: ''
        }
      });
      this.props.onChange(obj.name, obj.owner);
    }
  }

  render() {
    const { name, owner, editing, input, error } = this.state;
    if (!editing) {
      return (<div className='repo'>
        <svg className='repo-icon' viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
        <span className='repo-name'><a href={'https://github.com/' + owner}>{owner}</a>&nbsp;/&nbsp;<a href={'https://github.com/' + owner + '/' + name}><b>{name}</b></a></span>
        <Button bsSize="small" bsStyle="link" onClick={this.switchEdit}>Edit</Button>
      </div>)
    }
    return (
      <div className='repo'>
        <input type='text' onChange={this.updateInputValue} onKeyPress={this.onKeyPress} />
        <Button bsSize="small" bsStyle="primary" onClick={this.parseRepo}>Save</Button>
        <Button bsSize="small" bsStyle="link" onClick={this.switchEdit}>Cancel</Button>
        <Label bsStyle="danger">{ error }</Label>
      </div>)
  }
}

export default Repo;