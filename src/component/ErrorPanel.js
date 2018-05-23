import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

class ErrorPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (<Modal show>
          <p className='errormodal'>{this.props.data}</p>
          <Modal.Footer>
            <Button bsSize='small' onClick={this.props.onClose}>Close</Button>
          </Modal.Footer>
      </Modal>)
  }
}

export default ErrorPanel