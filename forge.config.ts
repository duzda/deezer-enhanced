import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerAppImage } from 'electron-forge-maker-appimage';
import { MakerPacman } from 'electron-forge-maker-pacman';
import { MakerFlatpak } from '@electron-forge/maker-flatpak';
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
    new MakerFlatpak({
      options: {
        files: [
          ["build/icons/16x16.png","/share/icons/hicolor/16x16/apps/org.duzda.deezer-enhanced.png"],
          ["build/icons/32x32.png","/share/icons/hicolor/32x32/apps/org.duzda.deezer-enhanced.png"],
          ["build/icons/64x64.png","/share/icons/hicolor/64x64/apps/org.duzda.deezer-enhanced.png"],
          ["build/icons/128x128.png","/share/icons/hicolor/128x128/apps/org.duzda.deezer-enhanced.png"],
          ["build/icons/256x256.png","/share/icons/hicolor/256x256/apps/org.duzda.deezer-enhanced.png"],
          ["build/icons/512x512.png","/share/icons/hicolor/512x512/apps/org.duzda.deezer-enhanced.png"]
        ],
        finishArgs: [
            // Wayland Rendering
            //"--socket=wayland",
            //"--socket=fallback-x11",
            // X Rendering
            "--socket=x11",
            "--share=ipc",
            // Open GL
            "--device=dri",
            // Audio output
            "--socket=pulseaudio",
            // Read/write home directory access
            "--filesystem=home",
            // Chromium uses a socket in tmp for its singleton check
            "--env=TMPDIR=/var/tmp",
            // Allow communication with network
            "--share=network",
            // System notifications with libnotify
            "--talk-name=org.freedesktop.Notifications",
            // Override MPRIS name
            "--own-name=org.mpris.MediaPlayer2.Deezer"
        ],
        id: "org.duzda.deezer-enhanced",
        productName: "Deezer Enhanced",
        // This doesn't work anyway
        //icon: "build/icon.png",
        categories: ["Audio"],
      }
    }), 
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
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
        {
          entry: 'src/preload_view.ts',
          config: 'vite.preload.config.ts',
        },
        {
          entry: 'src/view.ts',
          config: 'vite.view.config.ts'
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
