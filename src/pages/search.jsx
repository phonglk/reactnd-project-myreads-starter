import React from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from '../BooksAPI'
import BookTitle from '../components/book-title'

export default class Search extends React.PureComponent {
  state = {
    isSearching: false,
    searchTerm: '',
    books: [],
  }
  searchTO = null;

  componentDidMount () {
    this.inputRef.focus();
  }
  
  async doSearch() {
    const search = this.state.searchTerm;
    this.setState({ isSearching: true })

    let books = await BooksAPI.search(search, 10);
    if (!books || books.error) {
      books = [];
    }
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

  changeShelf = async (book, toShelfId) => {
    this.setState({ isLoading: true });
    const result = await BooksAPI.update(book, toShelfId)
    // update locally (easier way: load the search again);
    this.setState({ isLoading: false });
    if (result[toShelfId].indexOf(book.id) > -1) {
      const books = this.state.books.filter(b => b.id !== book.id);
      this.setState({ books });
    } else {
      alert('Unknown Error: Book have not moved to shelf.');
    }
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
          <ol className="books-grid">
            {books.map(book => (
                <li key={book.id}>
                  <BookTitle book={{ ...book, shelf: 'none'}} onShelfChange={this.changeShelf} noneOption={false} />
                </li>
              )
            )}
          </ol>
        </div>
      </div>
    )
  }
}