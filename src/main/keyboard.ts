import { WebContentsView, ipcMain } from 'electron';
import { SerializedKeyboardEvent } from '../common/types/serializedKeyboardEvent';
import { KEYBOARD_SEND_KEYPRESS } from '../common/channels/keyboard';

type KeyModifiers = (
  | 'left'
  | 'right'
  | 'shift'
  | 'control'
  | 'ctrl'
  | 'alt'
  | 'meta'
  | 'command'
  | 'cmd'
  | 'iskeypad'
  | 'isautorepeat'
  | 'leftbuttondown'
  | 'middlebuttondown'
  | 'rightbuttondown'
  | 'capslock'
  | 'numlock'
)[];

export const createKeyboardHandles = (deezerView: WebContentsView) => {
  ipcMain.on(
    KEYBOARD_SEND_KEYPRESS,
    async (_, event: SerializedKeyboardEvent) => {
      const modifiers: KeyModifiers = [];
      if (event.altKey) modifiers.push('alt');
      if (event.ctrlKey) modifiers.push('ctrl');
      if (event.shiftKey) modifiers.push('shift');
      if (event.metaKey) modifiers.push('meta');

      // Is this clean enough?
      await deezerView.webContents.executeJavaScript(
        'document.activeElement.blur()'
      );
      deezerView.webContents.focus();
      deezerView.webContents.sendInputEvent({
        type: 'keyDown',
        keyCode: event.key,
        modifiers,
      });
    }
  );
};
