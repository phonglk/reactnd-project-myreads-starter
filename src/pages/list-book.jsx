import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BookShelf from '../components/book-shelf';
import * as BooksAPI from '../BooksAPI'
import { SHELF_LIST } from '../const';

/**
 * Map list of books to predefined list of shelf based on shelf of the book
 * 
 * @param {array of books} books 
 * @param {array of shelves} shelvesRef predefined shelves
 * @returns mapped array
 */
function sortBooksToShelves (books, shelvesRef) {
  return shelvesRef.map(({ id, text }) => (
    {
      id,
      text,
      books: books.filter(book => book.shelf === id),
    }
  ))
}

export default class ListBook extends React.PureComponent {
  static propTypes = {
    books: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      shelves: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.checkAndSet(nextProps);
  }

  componentWillMount() {
    this.checkAndSet(this.props);
  }

  checkAndSet(props) {
    if (props.books.length > 0) {
      const shelves = sortBooksToShelves(props.books, SHELF_LIST);
      this.setState({ shelves });
    }
  }

  render() {
    const { shelves } = this.state;
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            {shelves.map(shelf => (
              <BookShelf {...shelf} key={shelf.id} />
            ))}
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    )
  }
}