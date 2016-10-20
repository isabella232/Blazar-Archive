import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { withRouter, routerShape } from 'react-router';

import ModuleBuildNumber from '../shared/ModuleBuildNumber.jsx';
import ModuleBuildStatus from '../shared/ModuleBuildStatus.jsx';
import BuildTriggerLabel from '../shared/BuildTriggerLabel.jsx';
import UsersForBuild from '../shared/UsersForBuild.jsx';
import CommitsSummary from '../shared/CommitsSummary.jsx';

import { canViewDetailedModuleBuildInfo, getBlazarModuleBuildPath } from '../../Helpers';

const ModuleBuildHistoryItem = ({moduleBuild, moduleName, branchBuild, router}) => {
  let onClick = null;

  if (canViewDetailedModuleBuildInfo(moduleBuild)) {
    const branchId = branchBuild.get('branchId');
    const linkPath = getBlazarModuleBuildPath(branchId, moduleBuild.get('buildNumber'), moduleName);
    onClick = () => {router.push(linkPath);};
  }

  const commitInfo = branchBuild.get('commitInfo');

  const classes = classNames('module-build-history-item', {'module-build-history-item--clickable': !!onClick});
  return (
    <li>
      <div className={classes} onClick={onClick}>
        <ModuleBuildNumber moduleBuild={moduleBuild} className="module-build-history-item__build-number" />
          <div className="module-build-history-item__status">
            <ModuleBuildStatus moduleBuild={moduleBuild} noIcon={true} />
          </div>
          <div className="module-build-history-item__build-trigger-label">
            <BuildTriggerLabel buildTrigger={branchBuild.get('buildTrigger')} />
          </div>
          <div className="module-build-history-item__users-for-build-wrapper">
            <UsersForBuild branchBuild={branchBuild} />
          </div>
          <div className="module-build-history-item__commits-wrapper">
            <CommitsSummary commitInfo={commitInfo} buildId={branchBuild.get('id')} popoverPlacement="left" />
          </div>
      </div>
    </li>
  );
};

ModuleBuildHistoryItem.propTypes = {
  moduleBuild: PropTypes.object.isRequired,
  moduleName: PropTypes.string.isRequired,
  branchBuild: PropTypes.object.isRequired,
  router: routerShape.isRequired
};

export default withRouter(ModuleBuildHistoryItem);