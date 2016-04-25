import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { buildResultIcon } from '../Helpers';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';

import Card from './Card.jsx';
import Icon from '../shared/Icon.jsx';
import BuildStates from '../../constants/BuildStates';
import Loader from '../shared/Loader.jsx';

class RepoBranchCard extends Card {

  getClassNames() {
    return classNames([
      this.getBaseClassNames(),
      'card-stack__card--repo-branch'
    ]);
  }

  getBuildToDisplay() {
    const {item} = this.props;

    if (item.get('inProgressBuild') !== undefined) {
      return item.get('inProgressBuild');
    }

    return item.get('lastBuild');
  }

  renderRepoLink() {
    const {item} = this.props;
    const gitInfo = item.get('gitInfo');

    return (
      <Link to={gitInfo.get('blazarBranchPath')}>
        {gitInfo.get('repository')}
      </Link>
    );
  }

  renderBuildNumberLink() {
    const {item} = this.props;
    const build = this.getBuildToDisplay();
    const gitInfo = item.get('gitInfo');
    
    return (
      <Link className='repo-branch-card__build-number' to={build.get('blazarPath')}>
        #{build.get('buildNumber')}
      </Link>
    );
  }

  renderFailedModules(moduleBuilds) {
    if (moduleBuilds.length === 0) {
      return (
        <div>No failing modules!</div>
      );
    }

    const failedModuleNodes = moduleBuilds.map((build, key) => {
      return (
        <div key={key} className='repo-branch-card__failed-module'>
          <Link to={build.blazarPath}>
            {build.name}
          </Link>
        </div>
      );
    });

    return (
      <div className='repo-branch-card__failed-modules-wrapper'>
        <span className='repo-branch-card__failed-modules-title'>
          These modules failed:
        </span>
        <br />
        {failedModuleNodes}
      </div>
    );
  }

  renderDetails() {
    const {moduleBuildsList} = this.props;

    if (!this.props.expanded) {
      return;
    }

    else if (this.props.loading) {
      return (
        <div className='card-stack__card-details'>
          <Loader align='center' roomy={true} />
        </div>
      );
    }

    const failingModuleBuilds = moduleBuildsList.filter((build) => {
      return build.state === BuildStates.FAILED;
    });

    return (
      <div className='card-stack__card-details'>
        {this.renderFailedModules(failingModuleBuilds)}
      </div>
    );
  }

  renderModuleRow(module, i) {
    const state = module.state;
    let statusText;
    let durationText;
    let statusClass;

    if (state === BuildStates.IN_PROGRESS) {
      statusText = 'is building ...';
      durationText = `Started ${moment(startTimestamp).fromNow()}`;
      statusClass = 'repo-branch-card__expanded-status-symbol--IN-PROGRESS';
    }

    else if (state === BuildStates.SUCCEEDED) {
      statusText = 'built successfully.';
      durationText = `Finished in ${humanizeDuration(module.endTimestamp - module.startTimestamp, {round: true})}`;
      statusClass = 'repo-branch-card__expanded-status-symbol--SUCCEEDED';
    }

    else if (state === BuildStates.FAILED) {
      statusText = 'build failed.';
      durationText = `Finished in ${humanizeDuration(module.endTimestamp - module.startTimestamp, {round: true})}`;
      statusClass = 'repo-branch-card__expanded-status-symbol--FAILED';
    }

    else if (state === BuildStates.SKIPPED) {
      statusText = 'was skipped.';
      statusClass = 'repo-branch-card__expanded-status-symbol--SKIPPED';
    }

    return (
      <div key={i} className='repo-branch-card__expanded-module-row'>
        <span className='repo-branch-card__expanded-status'>
          <span className={statusClass} /> {module.name} {statusText}
        </span>
        <span className='repo-branch-card__expanded-timestamp'>
          {durationText}
        </span>
      </div>
    );
  }

  renderDetailsV2() {
    const {item, moduleBuildsList, expanded, loading} = this.props;
    const build = this.getBuildToDisplay();

    if (!expanded) {
      return (
        <div className='card-stack__expanded hidden'>
          <div className='card-stack__expanded-module-rows hidden' />
        </div>
      );
    }

    else if (loading) {
      return (
        <div className='card-stack__expanded'>
          <Loader align='center' roomy={true} />
          <div className='card-stack__expanded-module-rows hidden' />
        </div>
      );
    }

    console.log(moduleBuildsList);

    const moduleRowNodes = moduleBuildsList.map(this.renderModuleRow);

    return (
      <div className='card-stack__expanded'>
        <div className='card-stack__expanded-header'>
          <span>Build #{build.get('buildNumber')} was started manually</span>
        </div>
        <div className='card-stack__expanded-module-rows'>
          {moduleRowNodes}
        </div>
      </div>
    );
  }

  renderInfo() {
    const {item} = this.props;
    const gitInfo = item.get('gitInfo');

    return (
      <div className='repo-branch-card__info'>
        <div className='repo-branch-card__repo'>
          {this.renderRepoLink()}
        </div>
        <div className='repo-branch-card__branch-and-build'>
          <span className='repo-branch-card__branch'>
            {gitInfo.get('branch')}
          </span>
          <span> is on build </span>
          {this.renderBuildNumberLink()}
        </div>
      </div>
    );
  }

  renderBuildAuthorMaybe() {
    const {item} = this.props;
    const someCheck = false;

    if (!someCheck) {
      return null;
    }

    return (
      <span>
        by <span>AUTHOR</span>
      </span>
    );
  }

  renderLastBuild() {
    const {item} = this.props;
    const build = this.getBuildToDisplay();

    return (
      <div className='repo-branch-card__last-build'>
        <span className='repo-branch-card__last-build-time'>
          {moment(build.get('startTimestamp')).fromNow()}
        </span>
        {this.renderBuildAuthorMaybe()}
      </div>
    );
  }

  renderModulesBuilt() {
    const {item} = this.props;

    return (
      <div className='repo-branch-card__details'>
        <div className='repo-branch-card__modules-built'>
          <span>
            <span className='repo-branch-card__modules-built-count'>2 modules</span> built
          </span>
        </div>
        <div className='repo-branch-card__modules-skipped'>
          <span>
            <span className='repo-branch-card__modules-skipped-count'>4 modules</span> skipped
          </span>
        </div>
      </div>
    );
  }

  renderStatus() {
    const {item} = this.props;
    const build = this.getBuildToDisplay();
    const classWithModifier = `repo-branch-card__status-banner--${[BuildStates.FAILED, BuildStates.UNSTABLE].indexOf(build.get('state')) !== -1 ? 'FAILED' : 'SUCCESS'}`;

    return (
      <div className='repo-branch-card__status'>
        <div className={classWithModifier}>
          <span />
        </div>
      </div>
    );
  }

  render() {
    const {item} = this.props;
    const build = item.get('inProgressBuild') !== undefined ? item.get('inProgressBuild') : item.get('lastBuild');
    const gitInfo = item.get('gitInfo');

    return (
      <div className={this.getClassNames()}>
        <div onClick={this.props.onClick} className='card-stack__card-main'>
          {this.renderInfo()}
          {this.renderLastBuild()}
          {this.renderModulesBuilt()}
          {this.renderStatus()}
        </div>
        {this.renderDetailsV2()}
      </div>
    );
  }
}

RepoBranchCard.propTypes = {
  item: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  moduleBuildsList: PropTypes.array
};

export default RepoBranchCard;