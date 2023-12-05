import {connect} from 'react-redux';

import {
  search,
} from '../stores';

const mapStateToProps = state => ({
  selectedCategory: state.search.selectedCategory,
});

const mapDispatchToProps = {
  setSearchCategory: search.actions.setSearchCategory,
};

export default connect(mapStateToProps, mapDispatchToProps);
