import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SHELF_LIST } from '../const';

class BookTitle extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    onShelfChange: PropTypes.func,
    noneOption: PropTypes.bool.isRequired,
  }
  static defaultProps = {
    noneOption: true,
  }
  static contextTypes = {
    changeShelf: PropTypes.func
  }
  onShelfChange = (event) => {
    const targetShelf = event.target.value;
    const func = this.props.onShelfChange || this.context.changeShelf;
    func(this.props.book, targetShelf);
  }
  render () {
    const {
      imageLinks: { thumbnail },
      shelf,
      authors,
      title,
    } = this.props.book;
    const noneOption = this.props.noneOption;

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={
            { width: 128,
              height: 193,
              backgroundImage: `url("${thumbnail}")`,
            }
          }></div>
          <div className="book-shelf-changer">
            <select onChange={this.onShelfChange} value={shelf}>
              <option value="none" disabled key="label">Move to...</option>
              {SHELF_LIST.map(({id, text}) => <option value={id} key={id}>{text}</option>)}
              {noneOption && <option value="none" key="none">None</option>}
            </select>
          </div>
        </div>
        <div className="book-title">{title}</div>
        <div className="book-authors">{authors.join(', ')}</div>
      </div>
    )
  }
}

export default BookTitle