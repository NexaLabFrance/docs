// @ts-check

/**
 * A single sidebar split into real product sections.
 *
 * Each product is an `html` item rendering an <h2>, so the section reads as a
 * heading in the navigation rather than as a collapsible widget or a dropdown.
 * Docs belonging to a product are listed underneath it, grouped with
 * non-collapsible categories.
 *
 * @param {string} label
 * @returns {import('@docusaurus/plugin-content-docs').SidebarItemHtml}
 */
const section = (label) => ({
  type: 'html',
  value: `<h2 class="nx-sidebar-section">${label}</h2>`,
  defaultStyle: false,
  className: 'nx-sidebar-section-item',
});

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',

    section('FiveM'),
    'fivem-script/fivem-script-index',

    section('NexaScript'),
    {
      type: 'category',
      label: 'Reseller API',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'reseller-api/reseller-api-index'},
      items: [
        'reseller-api/authentication',
        {
          type: 'category',
          label: 'Managing licenses',
          collapsible: true,
          collapsed: true,
          link: {
            type: 'generated-index',
            title: 'Managing licenses',
            slug: '/reseller-api/licenses',
            description:
              'Create, edit, suspend and delete licenses programmatically.',
          },
          items: [
            'reseller-api/licenses/overview',
            'reseller-api/licenses/create',
            'reseller-api/licenses/edit',
            'reseller-api/licenses/suspend',
            'reseller-api/licenses/delete',
          ],
        },
        'reseller-api/errors',
      ],
    },
  ],
};

export default sidebars;
