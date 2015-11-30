import $ from 'jquery';
import React, {Component} from 'react';
import SidebarFilter from './SidebarFilter.jsx';
import BuildsSidebarMessage from './BuildsSidebarMessage.jsx';
import {bindAll, has, debounce} from 'underscore';
import {getFilterMatches} from '../../utils/buildsHelpers';
import {FILTER_MESSAGES, NO_MATCH_MESSAGES} from '../constants';
import Loader from '../shared/Loader.jsx';
import LazyRender from '../shared/LazyRender.jsx';
import SidebarItem from './SidebarItem.jsx';

let Link = require('react-router').Link;

import BuildsStore from '../../stores/buildsStore';
import BuildsActions from '../../actions/buildsActions';
import StarStore from '../../stores/starStore';
import StarActions from '../../actions/starActions';

import GlobalBuildsStore from '../../stores/globalBuildsStore';
import GlobalBuildsActions from '../../actions/globalBuildsActions';

import Sidebar from './Sidebar.jsx';

class BuildsSidebarContainer extends Component {

  constructor(props) {
    super(props);
    
    bindAll(this, 
      'persistStarChange', 
      'onStoreChange', 
      'getBuildsOfType', 
      'updateResults', 
      'setToggleState'
    );

    this.state = {
      builds: [],
      loadingBuilds: true,
      loadingStars: true,
      loading: true,
      changingBuildsType: false,
      filterText: '',
      toggleFilterState: 'starred',
      sidebarHeight: this.getSidebarHeight()
    };
  }

  componentWillMount() {
    this.handleResizeDebounced = debounce(() => {
      this.setState({
        sidebarHeight: this.getSidebarHeight()
      });
    }, 500);
  }

  componentDidMount() {
    StarActions.loadStars('sidebar');

    this.unsubscribeFromStars = StarStore.listen(this.onStoreChange);
    //
    // temporarily load global builds until we have a searchable endpoint
    this.unsubscribeFromGlobalBuilds = GlobalBuildsStore.listen(this.onStoreChange);
    //
    
    this.unsubscribeFromStarredBuilds = BuildsStore.listen(this.onStoreChange);
    BuildsActions.loadBuilds(this.state.toggleFilterState);
    // initially load global builds so we have quick access
    // we will remove this when we have a searchable endpoint
    GlobalBuildsActions.loadBuildsOnce();
    
    window.addEventListener('resize', this.handleResizeDebounced);
  }

  componentWillUnmount() {
    BuildsActions.stopListening();
    this.unsubscribeFromStarredBuilds();
    window.removeEventListener('resize', this.handleResizeDebounced);
  }
  
  getSidebarHeight() {
    return $(window).height() - $('#primary-nav').height() + $('.sidebar__filter').height();
  }

  // fetch builds based on toggle selection
  getBuildsOfType(type) {
    this.setState({
      changingBuildsType: true
    });

    //
    // Temporary until we have a searchable endpoint
    if (type === 'all') {
      BuildsActions.setFilterType('all');
      BuildsActions.stopListening();
      GlobalBuildsActions.loadBuilds();
    }
    else {
      GlobalBuildsActions.stopPolling();
      BuildsActions.loadBuildOfType(type);
    }
    
  }

  onStoreChange(state) {
    if (state.filterHasChanged) {
      state.changingBuildsType = false;
    }
    if (!state.loadingStars) {
      state.loading = false;
    }

    this.setState(state);
  }

  persistStarChange(isStarred, starInfo) {
    StarActions.toggleStar(isStarred, starInfo);
  }

  updateResults(input) {
    this.setState({
      filterText: input
    });
  }

  setToggleState(toggleState) {
    this.getBuildsOfType(toggleState);

    this.setState({
      filterText: this.state.filterText,
      toggleFilterState: toggleState
    });
  }

  buildModuleComponents(changingBuildsType, modules) {
    if (changingBuildsType) {
      return (
        <Loader align='top-center' className='sidebar-loader' />
      );
    }
    else if (changingBuildsType) {
      return <div />
    }

    const modulesList = modules.map( (module) => {
      if (has(module, 'module')) {
        return (
          <SidebarItem 
            key={module.module.id}
            build={module} 
            isStarred={module.module.isStarred}
          />
        )
      }
    });

    return (
      <LazyRender 
        childHeight={71} 
        maxHeight={this.state.sidebarHeight}>
        {modulesList}
      </LazyRender>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <Sidebar>
          <Loader align='top-center' />
        </Sidebar>
      );
    }
    // filter builds by search input
    const matches = getFilterMatches(this.state.builds, this.state.filterText);

    // build list item components
    const moduleComponentsList = this.buildModuleComponents(this.state.changingBuildsType, matches);
    // pass type of builds we are searching to provide messages
    const searchType = NO_MATCH_MESSAGES[this.state.toggleFilterState];

    return (
      <Sidebar>
        <div className="sidebar__filter">
          <SidebarFilter
            loading={this.state.loading}
            builds={this.state.builds}
            filterText={this.state.filterText}
            updateResults={this.updateResults}
            setToggleState={this.setToggleState}
            toggleFilterState={this.state.toggleFilterState}
          />
        </div>
        <div className='sidebar__list'>
          {moduleComponentsList}
          <BuildsSidebarMessage
            loading={this.state.loading}
            dontDisplay={this.state.changingBuildsType}
            searchType={searchType}
            numModules={matches.length}
            filterText={this.state.filterText}
            toggleFilterState={this.state.toggleFilterState}
          />
        </div>
      </Sidebar>
    );
  }



}

export default BuildsSidebarContainer;
