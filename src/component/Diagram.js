import React, { Component } from 'react';
import ReactTable from 'react-table';
import Excel from '../lib/excel.js';
import 'react-table/react-table.css';
import { Button } from 'react-bootstrap';

class Diagram extends Component {
  constructor(props) {
    super(props);
    this.exportFile = this.exportFile.bind(this);
  }

  exportFile() {
    const {owner, repo, data} = this.props;
    var now = new Date();
    var isoString = now.toISOString();
    var filename = owner+'-'+repo+'-'+ isoString +'.xlsx';
    var columns = [
        ['Title', 'Type', 'Creator', 'Create date', 'Close date', 'Creator company', 'Creator location']
    ];
    for(var i = 0; i < data.length; i++) {
        var item = data[i];
        columns.push([
            item.title,
            item.pull_request ? 'PR' : 'Issue',
            item.user.name + '(@' + item.user.login + ')',
            item.created_at,
            item.closed_at,
            item.user.company,
            item.user.location
        ])
    }
    var excel = new Excel();
    excel.save(filename, columns);
  }

  render() {
    console.log(this.props.data)
    return (<div className='diagram'>
      <Button bsSize='small' bsStyle='success' pullRight onClick={this.exportFile}>Export to Excel</Button>
      <ReactTable
        data={this.props.data}
        columns={[
          {
            columns: [
              {
                Header: 'Title',
                id: 'title',
                accessor: item => <a target='_blank' href={item.html_url}>{item.title}</a>
              },
              {
                  Header: 'Type',
                  id: 'type',
                  accessor: item => item.pull_request ? 'PR' : 'Issue'
              },
              {
                Header: 'creator',
                accessor: item => item.user.name + '(@' + item.user.login + ')',
                id: 'creator'
              },
              {
                Header: 'Create date',
                accessor: 'created_at'
              },
              {
                Header: 'Close date',
                accessor: 'closed_at'
              },
              {
                Header: 'Creator company',
                accessor: item => item.user.company,
                id: 'company'
              },
              {
                Header: 'Creator location',
                accessor: item => item.user.location,
                id: 'location'
              }
            ]
          }
        ]}
        defaultSorted={[{
          id: 'created_at'
        }]}
        defaultPageSize={25}
        className="-striped -highlight"
      />
    </div>)
  }
}

export default Diagram