import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import * as BooksAPI from '../BooksAPI'
import BookTitle from '../components/book-title'


/**
 * Enhance search result with shelf information
 * 
 * @param {array} searchResult 
 * @param {array} booksInShelves
 * @returns searchResult with shelf information
 */
function massageBooksWithShelf(searchResult, booksInShelves) {
  const bookHash = booksInShelves.reduce((hash, book) => ({...hash, [book.id]: book.shelf}), {});
  return searchResult.map(book => ({
    ...book,
    shelf: bookHash[book.id] || 'none',
  }))
}

export default class Search extends React.PureComponent {
  static propTypes = {
    books: PropTypes.array.isRequired,
  }
  state = {
    isSearching: false,
    searchTerm: '',
    books: [],
  }
  searchTO = null;

  componentDidMount () {
    this.inputRef.focus();
    console.log('mount');
  }

  componentWillReceiveProps(nextProps) {
    const books = massageBooksWithShelf(this.state.books, nextProps.books);
    this.setState({ books });
  }
  
  async doSearch() {
    const search = this.state.searchTerm;
    this.setState({ isSearching: true })

    let books = await BooksAPI.search(search, 10);
    if (!books || books.error) {
      books = [];
    }
    books = massageBooksWithShelf(books, this.props.books);
    this.setState({ books, isSearching: false });
  }

  queueSearch() {
    clearTimeout(this.searchTO);
    this.searchTO = setTimeout(this.doSearch.bind(this), 200); // debounce
  }

  onSearchTermChange = (event) => {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
    this.queueSearch();
  }

  render() {
    const { books, isSearching, searchTerm } = this.state;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={searchTerm}
              ref={(input) => { this.inputRef = input; }}
              onChange={this.onSearchTermChange}
            />
          </div>
          <div className="spinner" style={{ opacity: isSearching ? 1 : 0}} />
        </div>
        <div className="search-books-results">
          {isSearching === false && searchTerm !== '' && books.length === 0 && <div>There is no book for '{searchTerm}' </div>}
          <ol className="books-grid">
            {books.map(book => {
              const props = {
                book,
                showShelfLabel: true,
              };
              return (
                <li key={book.id}>
                  <BookTitle {...props} />
                </li>
              )
            }
            )}
          </ol>
        </div>
      </div>
    )
  }
}