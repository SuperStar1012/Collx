import {connect} from 'react-redux';

import {player} from '../stores';

const mapStateToProps = state => ({
  isFetching: state.player.isFetching,
  errorText: state.player.errorText,
  players: state.player.players,
  searchModalMode: state.search.searchModalMode,
});

const mapDispatchToProps = {
  getPlayers: player.actions.getPlayers,
};

export default connect(mapStateToProps, mapDispatchToProps);
