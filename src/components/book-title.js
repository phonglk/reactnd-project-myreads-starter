import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SHELF_LIST } from '../const';

class BookTitle extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    onShelfChange: PropTypes.func,
    showShelfLabel: PropTypes.bool,
  }
  static contextTypes = {
    changeShelf: PropTypes.func
  }
  state = {
    isLoading: false,
  }

  
  componentWillUnmount () {
    this.__isUnmounting = true;
  }
  
  onShelfChange = async (event) => {
    const targetShelf = event.target.value;
    const func = this.props.onShelfChange || this.context.changeShelf;
    this.setState({ isLoading: true })
    await func(this.props.book, targetShelf);
    if(!this.__isUnmounting) this.setState({ isLoading: false })
  }
  
  render () {
    const {
      book: {
        imageLinks: { thumbnail },
        shelf,
        authors,
        title,
      },
      showShelfLabel,
    } = this.props;
    const { isLoading } = this.state;
    let shelfLabel = SHELF_LIST.find(s => s.id === shelf);
    shelfLabel = shelfLabel ? shelfLabel.text : '';
    return (
      <div className="book">
        {isLoading && <div className="spinner-overlay">
            <div className="spinner" />
          </div>
        }
        <div className="book-top">
          <div className="book-cover" style={
            { width: 128,
              height: 193,
              backgroundImage: `url("${thumbnail}")`,
            }
          }></div>
          {showShelfLabel === true && shelf !== 'none' &&
            <div className="book-title-ribbon">
              <span>{shelfLabel}</span></div>}
          <div className="book-shelf-changer">
            <select onChange={this.onShelfChange} value={shelf}>
              <option value="xnone" disabled key="label">Move to...</option>
              {SHELF_LIST.map(({id, text}) => <option value={id} key={id}>{text}</option>)}
              <option value="none" key="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{title}</div>
        <div className="book-authors">{authors && authors.join && authors.join(', ')}</div>
      </div>
    )
  }
}

export default BookTitle