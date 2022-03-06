// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'props',
  tagline: 'General purpose smart contracts and developer framework for Neo N3',
  url: 'https://props.coz.io',
  baseUrl: '/d/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'COZ, Inc.', // Usually your GitHub org/user name.
  projectName: 'props', // Usually your repo name.
  plugins: [
    [
      'docusaurus-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        entryPoints: ['../sdk/src/index.ts'],
        tsconfig: '../sdk/tsconfig.json',
        out: './sdk/ts',
        sidebar: {
          categoryLabel: "typescript"
        }
      },
    ],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'props',
        logo: {
          alt: 'Props Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo_dark.svg',
        },
        items: [
          {
            href: '/d/docs/sdk/ts/',
            label: 'TypeScript SDK',
            position: 'right'
          },
          {
            href: 'https://github.com/CityOfZion/props',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Get Started',
                to: '/d/docs/overview',
              },
            ],
          },
          {
            title: 'Keep in touch:',
            items: [
              {
                label: 'Home',
                href: 'https://coz.io',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/coz_official',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/rvZFQ5382k',
              },
              {
                label: 'Email',
                href: 'mailto:contact@coz.io',
              },
            ],
          }
        ],
        //copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
