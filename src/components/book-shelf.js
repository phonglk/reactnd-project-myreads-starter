import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BookTitle from './book-title';

class BookShelf extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    const { id, text, books } = this.props;

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{text}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {books.map(book => (
                <li key={book.id}>
                  <BookTitle book={book} />
                </li>
              )
            )}
          </ol>
        </div>
      </div>
    )
  }
}

BookShelf.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  books: PropTypes.arrayOf(PropTypes.object)
}

export default BookShelf