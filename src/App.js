import React from 'react'
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

import Search from './pages/search';
import ListBook from './pages/list-book';

class BooksApp extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Route exact path="/" component={ListBook} />
          <Route path="/search" component={Search} />
        </div>
      </Router>
    )
  }
}

export default BooksApp
