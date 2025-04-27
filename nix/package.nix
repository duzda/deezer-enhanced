{
  appimageTools,
  lib,
  fetchurl,
}: let
  pname = "deezer-enhanced";
  #https://github.com/duzda/deezer-enhanced/releases/download/v1.3.0/Deezer.Enhanced-1.3.0-x64.AppImage
  version = "1.3.0";

  src = fetchurl {
    url = "https://github.com/duzda/deezer-enhanced/releases/download/v${version}/Deezer.Enhanced-${version}-x64.AppImage";
    hash = "sha256-IrkCxjOWTo0g1XeWXQgR/FHFVGCXRn3coOZXeF4RaH8=";
  };
  appimageContents = appimageTools.extract {
    inherit pname version src;
  };
in
  appimageTools.wrapType2 {
    inherit pname version src;
    extraInstallCommands = ''
      if [ -f "${appimageContents}/Deezer Enhanced.desktop" ]; then
        install -m 444 -D "${appimageContents}/Deezer Enhanced.desktop" \
          "$out/share/applications/Deezer Enhanced.desktop"
        # substituteInPlace "$out/share/applications/Deezer Enhanced.desktop" \
        #   --replace-fail "Exec=${pname}" "Exec=${pname} --ozone-platform-hint=auto"
      fi

      if [ -f "${appimageContents}/usr/share/icons/hicolor/256x256/deezer-enhanced.png" ]; then
        install -m 444 -D \
          "${appimageContents}/usr/share/icons/hicolor/256x256/deezer-enhanced.png" \
          "$out/share/icons/hicolor/256x256/apps/deezer-enhanced.png"
      fi    '';
    meta = with lib; {
      description = "An unofficial application for Deezer with enhanced features ";
      homepage = "https://github.com/duzda/deezer-enhanced";
      liscense = liscense.MIT;
      platforms = ["x86_64-linux"];
    };
  }
