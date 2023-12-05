import {connect} from 'react-redux';

import {
  card,
  player,
  search,
  team,
  type,
  user,
} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  isFetchingCard: state.card.isFetchingCard,
  isFetchingSaleCard: state.card.isFetchingSaleCard,
  errorText: state.card.errorText,
  onBackSearch: state.search.onBackSearch,
  searchModalMode: state.search.searchModalMode,
  searchedCards: state.card.searchedCards,
  searchedSaleCards: state.card.searchedSaleCards,
  isTeamFetching: state.team.isFetching,
  isTypeFetching: state.type.isFetching,
  teamYears: state.team.teamYears,
  playerYears: state.player.playerYears,
  typeYears: state.type.typeYears,
  isFetchingOtherUsers: state.user.isFetchingOtherUsers,
  otherUsers: state.user.otherUsers,
  selectedCategory: state.search.selectedCategory,
  mainFilterOptions: state.search.mainFilterOptions,
  modalFilterOptions: state.search.modalFilterOptions,
});

const mapDispatchToProps = {
  searchCards: card.actions.searchCards,
  searchSaleCards: card.actions.searchSaleCards,
  resetSearchedCards: card.actions.resetSearchedCards,
  getTeamYears: team.actions.getTeamYears,
  getPlayerYears: player.actions.getPlayerYears,
  setSearchModalMode: search.actions.setSearchModalMode,
  setHandleSearchBack: search.actions.setHandleSearchBack,
  getTypeYears: type.actions.getTypeYears,
  getUsers: user.actions.getUsers,
  setSearchCategory: search.actions.setSearchCategory,
  setMainFilterOptions: search.actions.setMainFilterOptions,
  setModalFilterOptions: search.actions.setModalFilterOptions,
};

export default connect(mapStateToProps, mapDispatchToProps);
