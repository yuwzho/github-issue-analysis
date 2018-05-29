import React, { Component } from 'react';
import { FormGroup, Checkbox, Radio } from 'react-bootstrap';

class StateChoose extends Component {
    constructor(props) {
        super(props);

        this.state = {
            states: [
                {
                    value: '',
                    name: 'all'
                },
                {
                    value: 'is:open',
                    name: 'open'
                },
                {
                    value: 'is:closed',
                    name: 'closed'
                },
                {
                    value: 'is:merged',
                    name: 'merged'
                }],
            type: [
                {
                    value: 'type:issue',
                    name: 'issue'
                },
                {
                    value: 'type:pr',
                    name: 'PR'
                }
            ]
        }
    }

    componentWillMount() {
        for (var i = 0; i < this.state.type.length; i++) {
            this.props.onTypeChange({
                target: {
                    checked: true
                }
            }, this.state.type[i].value)
        }
    }

    render() {
        return (
            <div>
                <FormGroup>
                    {this.state.states.map((item, i) => (<Radio defaultChecked={i === 0} name='radioGroup' key={i} inline onClick={() => this.props.onChange(item.value)}>{item.name}</Radio>))}
                </FormGroup>
                <FormGroup>
                    {this.state.type.map((item, i) => (<Checkbox inline key={i} onClick={(e) => this.props.onTypeChange(e, item.value)} defaultChecked>{item.name}</Checkbox>))}
                </FormGroup>
            </div>);
    }
}

export default StateChoose;