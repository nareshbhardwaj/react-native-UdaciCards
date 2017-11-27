import { combineReducers } from 'redux';
import DeckReducer from './Deck';
import DeckDetailReducer from './DeckDetail';

export default combineReducers({
  decks: Deck,
  deckDetail: DeckDetail
});
