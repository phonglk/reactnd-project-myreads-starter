import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

import Search from './pages/search';
import ListBook from './pages/list-book';

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Route exact path="/" component={ListBook} />
          <Route path="/search" component={Search} />
          <div className="open-search">
            <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
          </div>
        </div>
      </Router>
    )
  }
}

export default BooksApp
