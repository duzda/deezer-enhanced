import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerAppImage } from 'electron-forge-maker-appimage';
import { MakerPacman } from 'electron-forge-maker-pacman';
// import { MakerFlatpak } from '@electron-forge/maker-flatpak';
// import { MakerSnap } from '@electron-forge/maker-snap';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
    appBundleId: "com.duzda.deezer-enhanced",
    asar: true,
    extraResource: [
      './assets'
    ],
    appCategoryType: 'public.app-category.music',
  },
  rebuildConfig: {},
  makers: [
    new MakerAppImage({
      options: {
        productName: "Deezer Enhanced",
        icon: "./build/icon.png",
        categories: ["Audio"],
      },
    }), 
    new MakerPacman({}),
    // new MakerFlatpak({
    //   options: {
    //     files: 
    //     productName: "Deezer Enhanced",
    //     icon: "./build/icon.svg",
    //     categories: ["Audio"],
    //   }
    // }), 
    // new MakerSnap({
    //   features: {
    //     audio: true,
    //     mpris: 'com.duzda.deezer-enhanced',
    //     webgl: true,
    //   }
    // }), 
    new MakerDeb({
      options: {
        productName: "Deezer Enhanced",
        icon: "./build/icon.png",
        categories: ["Audio"],
      },
    }), 
    new MakerRpm({
      options: {
        productName: "Deezer Enhanced",
        icon: "./build/icon.png",
        categories: ["Audio"],
      },
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.config.ts',
        },
        {
          entry: 'src/preload_view.ts',
          config: 'vite.config.ts',
        },
        {
          entry: 'src/view.ts',
          config: 'vite.config.ts',
        }
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
