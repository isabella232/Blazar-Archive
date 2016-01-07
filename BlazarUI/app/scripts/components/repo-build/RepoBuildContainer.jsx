import React, {Component, PropTypes} from 'react';
import {bindAll, clone, some} from 'underscore';

import PageContainer from '../shared/PageContainer.jsx';
import UIGrid from '../shared/grid/UIGrid.jsx';
import UIGridItem from '../shared/grid/UIGridItem.jsx';
import GenericErrorMessage from '../shared/GenericErrorMessage.jsx';

import StarStore from '../../stores/starStore';
import RepoBuildStore from '../../stores/repoBuildStore';
import StarActions from '../../actions/starActions';
import RepoBuildActions from '../../actions/repoBuildActions';

import RepoBuildHeadline from './RepoBuildHeadline.jsx';
import RepoBuildModulesTable from './RepoBuildModulesTable.jsx'

let initialState = {
  moduleBuilds: false,
  stars: [],
  loadingModuleBuilds: true,
  loadingStars: true
};

class RepoBuildContainer extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    
    bindAll(this, 'onStatusChange')
  }
  
  componentDidMount() {
    this.setup(this.props.params);
  }

  componentWillReceiveProps(nextprops) {
    this.tearDown()
    this.setup(nextprops.params);
    this.setState(initialState);
  }

  componentWillUnmount() {
    this.tearDown()
  }
  
  setup(params) { 
    this.unsubscribeFromStars = StarStore.listen(this.onStatusChange);
    this.unsubscribeFromRepoBuild = RepoBuildStore.listen(this.onStatusChange);
    StarActions.loadStars('repoBuildContainer');
    RepoBuildActions.loadModuleBuilds(params.repoBuildId);
  }
  
  tearDown() {
    this.unsubscribeFromStars();
    this.unsubscribeFromRepoBuild();
  }
  
  onStatusChange(state) {
    this.setState(state);
  }

  renderSectionContent() {
    if (this.state.error) {
      return this.renderError();
    }

    else {
      return this.renderPage();
    }
  }
  
  renderError() {
    return (
      <UIGrid>
        <UIGridItem size={10}>
          <GenericErrorMessage 
            message={this.state.error}
          />
        </UIGridItem>
      </UIGrid>
    );
  }
  
  renderPage() {
    return (
      <div>
        <UIGrid>
          <UIGridItem size={12}>
            <RepoBuildHeadline
              params={this.props.params}
              stars={this.state.stars}
              loading={false}
            />
          </UIGridItem>
        </UIGrid>
        <UIGridItem size={12}>
          <RepoBuildModulesTable
            params={this.props.params}
            data={this.state.moduleBuilds ? this.state.moduleBuilds.toJS() : []}
            loading={this.state.loadingStars || this.state.loadingModuleBuilds}
            shouldRender={this.state.error}
          />
        </UIGridItem>
      </div>
      
    );
  }

  render() {
    return (
      <PageContainer>
        {this.renderSectionContent()}
      </PageContainer>
    );
  }
}

RepoBuildContainer.propTypes = {
  params: PropTypes.object.isRequired
};

export default RepoBuildContainer;
