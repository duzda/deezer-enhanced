{
  appimageTools,
  fetchurl,
}: let
  pname = "deezer-enhanced";
  #https://github.com/duzda/deezer-enhanced/releases/download/v1.3.0/Deezer.Enhanced-1.3.0-x64.AppImage
  version = "1.3.0";

  src = fetchurl {
    url = "https://github.com/duzda/deezer-enhanced/releases/download/v${version}/Deezer.Enhanced-${version}-x64.AppImage";
    hash = "sha256-IrkCxjOWTo0g1XeWXQgR/FHFVGCXRn3coOZXeF4RaH8=";
  };
in
  appimageTools.wrapType2 {
    inherit pname version src;
  }
