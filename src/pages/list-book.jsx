import React from 'react'
import propTypes from 'prop-types';
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

/**
 * Map books to shelves structure return from update api
 * 
 * @param {array of books} booksRef 
 * @param {array} shelves shelves structure to map to
 * @param {any} shelvesRef predefined shelves
 * @returns mapped array
 */
// function mapBooksToShelves (booksRef, shelves, shelvesRef) {
//   return shelves.map((books, id) => ({
//     id,
//     text: shelvesRef.find(s => s.id === id),
//     books: books.map(bookId => ({ ...booksRef.find(b => b.id === bookId), shelf: id})),
//   }))
// }

export default class ListBook extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shelves: [],
      books: [],
      isLoading: true,
    };
  }
  loadBookList = async () => {
    const books = await BooksAPI.getAll();
    const shelves = sortBooksToShelves(books, SHELF_LIST);
    this.setState({ shelves, books, isLoading: false });
  }
  async componentDidMount() {
    this.loadBookList();
  }

  changeShelf = (book, toShelfId) => {
    this.setState({ isLoading: true });
    BooksAPI.update(book, toShelfId)
      .then(result => {
        // update locally (easier way: load the list again);
        if (result[toShelfId].indexOf(book.id) > -1) {
          this.loadBookList();
        } else {
          alert('Unknown Error: Book have not moved.');
        }
      });
  }
  static childContextTypes = {
    changeShelf: propTypes.func,
  }
  getChildContext() {
    return {
      changeShelf: this.changeShelf
    }
  }

  render() {
    const { shelves, isLoading } = this.state;
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          { isLoading && <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
          }
          <div>
            {shelves.map(shelf => (
              <BookShelf {...shelf} key={shelf.id} />
            ))
            }
          </div>
        </div>
      </div>
    )
  }
}