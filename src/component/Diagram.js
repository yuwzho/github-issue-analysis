import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class Diagram extends Component {
    render() {
        console.log(this.props.data)
        return (<div className='diagram'>
            <ReactTable
                data={this.props.data}
                columns={[
                    {
                        columns: [
                            {
                                Header: 'Title',
                                id: 'title',
                                accessor: item=><a target='_blank' href={item.html_url}>{item.title}</a>
                            },
                            {
                                Header: 'creator',
                                accessor: item => item.user.name || item.user.login,
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