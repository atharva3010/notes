import Vue from 'vue';
import VueRouter from 'vue-router';
import wrap from '@vue/web-component-wrapper';

// Registers all the web components, creates dummy views for them and returns the router.
export default function registerWebComponents() {
  // https://webpack.js.org/guides/dependency-management/#require-context
  const requireComponent = require.context(
    // Look for files in the current directory
    './web-components',
    // Do not look in subdirectories
    false,
    // Only include "Base" prefixed .vue files
    /[\w-]+\.vue/
  );

  const routes = [];
  const routeLinks = [];

  // For each matching file name...
  requireComponent.keys().forEach(fileName => {
    // Get the component config
    const componentConfig = requireComponent(fileName);
    const webComponent = componentConfig.default || componentConfig;

    // Get the PascalCase version of the component name
    const componentName = fileName
      // Remove the "./" from the beginning
      .replace(/^\.\//, '')
      // Remove the file extension from the end
      .replace(/\.\w+$/, '');

    const webComponentName =
      'dew-wc-' +
      componentName
        // Convert PascalCase to kebab-case
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // Convert to lower case
        .toLowerCase();

    // Register the web-component
    window.customElements.define(webComponentName, wrap(Vue, webComponent));

    // Create a dummy view to nest the web component.
    routes.push({
      path: '/' + webComponentName,
      name: componentName,
      component: Vue.component(componentName, {
        render: function(createElement) {
          return createElement(webComponentName);
        }
      })
    });

    // Push link to the above route to the array routeLinks.
    routeLinks.push({ name: componentName });
  });

  // Create a Home view to render router-links to all the web components.
  routes.push({
    path: '/',
    name: 'Home',
    component: Vue.component('Home', {
      render: function(createElement) {
        return createElement(
          'ul',
          routeLinks.map(function(to) {
            return createElement('li', [
              createElement('router-link', { attrs: { to } }, to.name)
            ]);
          })
        );
      }
    })
  });

  Vue.use(VueRouter);

  return new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  });
}
