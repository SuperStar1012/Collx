import React, {useContext} from 'react';

const ActionContext = React.createContext();

function useActions() {
  return useContext(ActionContext);
}

import {createMutationActions} from './mutation';
import {createNavigationActions} from './navigation';
import {createSharingActions} from './sharing';
import {createErrorActions} from './error';
import {createCloudActions} from './cloud';

export default ActionContext;

export {
  useActions,
  createMutationActions,
  createNavigationActions,
  createSharingActions,
  createErrorActions,
  createCloudActions,
}