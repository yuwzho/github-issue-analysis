import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class Repo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'ansible',
            owner: 'ansible',
            editing: false,
            input: ''
        }

        this.switchEdit = this.switchEdit.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.parseRepo = this.parseRepo.bind(this);
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

    parseRepo() {
       const {input} = this.state
    }

    render() {
        const { name, owner, editing, input } = this.state;
        if (!editing) {
            return (<div>
                <span className='repo-name'><a href={'https://github.com/' + owner}>{owner}</a>&nbsp;/&nbsp;<a href={'https://github.com/' + owner + '/' + name}><b>{name}</b></a></span>
                <Button bsSize="small" bsStyle="link" onClick={this.switchEdit}>Edit</Button>
            </div>)
        }
        return (
            <div>
                <input type='text' onChange={this.updateInputValue} />
                <Button bsSize="small" bsStyle="primary" onClick={this.parseRepo}>Save</Button>
                <Button bsSize="small" bsStyle="link" onClick={this.switchEdit}>Cancel</Button>
            </div>)
    }
}

export default Repo;