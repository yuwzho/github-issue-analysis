import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { Button } from 'react-bootstrap';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Labels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: []
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.search = this.search.bind(this);
    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
    }

    search() {
        const { tags } = this.state;
        var result = [];
        for (var i = 0; i < tags.length; i++) {
            result.push(tags[i].text)
        }
        this.props.onChange(result);
    }

    render() {
        const { tags } = this.state;
        const { labels } = this.props;
        var suggestions = [];
        for (var i = 0; i < labels.length; i++) {
            suggestions.push({
                id: labels[i],
                text: labels[i]
            });
        }
        return (
            <div className='labels'>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    delimiters={delimiters}
                    placeholder='Enter your labels' />
                <Button bsSize="small" bsStyle="primary" onClick={this.search}>Search</Button>
            </div>
        )
    }
}

export default Labels;