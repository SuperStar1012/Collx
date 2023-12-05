import {connect} from 'react-redux';

import {team} from '../stores';

const mapStateToProps = state => ({
  isFetching: state.team.isFetching,
  errorText: state.team.errorText,
  teamLeagues: state.team.teamLeagues,
  searchModalMode: state.search.searchModalMode,
});

const mapDispatchToProps = {
  getTeamLeagues: team.actions.getTeamLeagues,
};

export default connect(mapStateToProps, mapDispatchToProps);
