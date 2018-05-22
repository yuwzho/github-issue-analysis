import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class Diagram extends Component {
    render() {
        console.log(this.props.data)
        return (<Table responsive>
            <thead>
                <tr>
                    <th>title</th>
                    <th>creator</th>
                    <th>create date</th>
                    <th>close date</th>
                    <th>update date</th>
                    <th>creator company</th>
                    <th>creator location</th>
                </tr>
            </thead>
            <tbody>
                {this.props.data.map(item=><tr>
                    <td><a href={item.html_url}>{item.title}</a></td>
                    <td>{item.user.name}</td>
                    <td>{item.created_at}</td>
                    <td>{item.closed_at}</td>
                    <td>{item.update_at}</td>
                    <td>{item.user.company}</td>
                    <td>{item.user.location}</td>
                </tr>)}
            </tbody>
        </Table>)
    }
}

export default Diagram