/*global config*/
import Notify from 'notifyjs';
import WatchingProvider from './WatchingProvider';

let lastModuleStates = {};

const BuildsNotifier = {

  updateModules: function(modules) {
    modules.forEach((module) => {
      if (WatchingProvider.isWatching({ repo: module.repository, branch: module.branch }) === -1) {
        return;
      }
      const id = JSON.stringify({ repo: module.repository, branch: module.branch, build: module.module });
      if (lastModuleStates[id] === 'IN_PROGRESS' && module.inProgressBuildLink === undefined) {
        this.showNotification(module.repository, module.branch, module.module, module.lastBuildState, module.link);
      }
      lastModuleStates[id] = (module.inProgressBuildLink !== undefined ? 'IN_PROGRESS' : module.lastBuildState);
    });
  },

  showNotification: function(repo, branch, module, state, link) {
    const body = `${repo}[${branch}] ${module}: ${state}`;
    const imgPath = `${config.staticRoot}/images/icon.png`;

    const notification = new Notify('Build Complete', {
        body: body,
        icon: {imgPath},
        notifyClick: () => {
          window.open(link);
        }
    });
    notification.show();
  }
};

export default BuildsNotifier;
