import React from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

import Search from './pages/search';
import ListBook from './pages/list-book';

class BooksApp extends React.Component {
  state = {
    books: [],
    isLoading: true,
  }
  loadBookList = async () => {
    const books = await BooksAPI.getAll();
    this.setState({ books, isLoading: false });
  }
  async componentDidMount() {
    this.loadBookList();
  }

  changeShelf = async (book, toShelfId) => {
    const result = await BooksAPI.update(book, toShelfId)
    if ((toShelfId === 'none' && result[book.shelf].indexOf(book.id) === -1)
      || result[toShelfId].indexOf(book.id) > -1) {
      const books =  this.state.books.concat(book.shelf === 'none' ? book : []);
      this.setState({
        books: books.map(b => b.id === book.id ? 
          {...b, shelf: toShelfId} : b)
      });
    } else {
      alert('Unknown Error: Book have not moved.');
    }
  }

  static childContextTypes = {
    changeShelf: PropTypes.func,
  }
  getChildContext() {
    return {
      changeShelf: this.changeShelf
    }
  }

  render() {
    const { isLoading, books } = this.state;
    return (
      <Router>
        <div className="app">
          { isLoading && <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>}
          <Route exact path="/" render={() => <ListBook books={books} />} />
          <Route path="/search" render={() => <Search books={books} />} />
        </div>
      </Router>
    )
  }
}

export default BooksApp
