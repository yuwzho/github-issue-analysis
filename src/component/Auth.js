import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarCollapse, NavDropdown, MenuItem, FormGroup, FormControl, Nav, Button } from 'react-bootstrap';

const METHODS = [
    {
        title: 'basic',
        method: 'basic',
        inputs: [
            {
                hint: 'username',
                type: 'text'
            },
            {
                hint: 'password',
                type: 'password'
            }
        ]
    },
    {
        title: 'oauth',
        method: 'oauth',
        inputs: [
            {
                hint: 'token',
                type: 'password'
            }
        ]
    },
    {
        title: 'oauth client id/secret',
        method: 'oauth',
        inputs: [
            {
                hint: 'key',
                type: 'text'
            },
            {
                hint: 'secret',
                type: 'password'
            }
        ]
    },
    {
        title: 'token',
        method: 'token',
        inputs: [
            {
                hint: 'token',
                type: 'password'
            }
        ]
    },
    {
        title: 'app',
        method: 'app',
        inputs: [
            {
                hint: 'token',
                type: 'password'
            }
        ]
    }
];

const AUTH_OPTION = 'auth_options';

class Auth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            inputs: [],
            username: '',
            password: ''
        };

        this.onSelect = this.onSelect.bind(this);
        this.auth = this.auth.bind(this);

        var option = localStorage.getItem(AUTH_OPTION);
        if (option) {
            this.props.onChange(JSON.parse(option));
        }
    }

    onSelect(item) {
        this.setState(function () {
            return {
                title: item.title,
                inputs: item.inputs
            }
        })
    }

    handleChange(type, evt) {
        var value = evt.target.value;
        if (type === 'password') {
            this.setState({
                password: value
            })
        } else {
            this.setState({
                username: value
            })
        }
    }

    auth() {
        var option = {};
        for (var i = 0; i < METHODS.length; i++) {
            if (METHODS[i].title === this.state.title) {
                option['type'] = METHODS[i].method;
                for (var j = 0; j < METHODS[i].inputs.length; j++) {
                    option[METHODS[i].inputs[j].hint] = this.state[METHODS[i].inputs[j].type];
                }
            }
        }
        this.setState(function () {
            return {
                inputs: [],
                password: '',
                username: ''
            }
        });
        if (option.type) {
            localStorage.setItem(AUTH_OPTION, JSON.stringify(option));
            this.props.onChange(option);
        }
    }

    render() {
        return (<div className='header'>
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <NavbarBrand>
                        Github Issue Summary
                </NavbarBrand>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown eventKey={1} title={this.state.title || 'Auth Method'} id='auth-method'>
                            {METHODS.map(item => <MenuItem eventKey={item.method} onSelect={() => { this.onSelect(item) }}>{item.title}</MenuItem>)}
                        </NavDropdown>
                        {(this.state.inputs.length > 0) ?
                            <Navbar.Form pullLeft>
                                <FormGroup>
                                    {this.state.inputs.map(input => <FormControl type={input.type} placeholder={input.hint} onChange={this.handleChange.bind(this, input.type)} />)}
                                </FormGroup>
                                <Button type='button' bsStyle='primary' onClick={this.auth}>Auth</Button>
                            </Navbar.Form>
                            : <div/>}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>)
    }
}

export default Auth