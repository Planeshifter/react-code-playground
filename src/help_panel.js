/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { showPanel } from '@codemirror/panel';
import { StateField, StateEffect } from "@codemirror/state"
import { keymap } from "@codemirror/view"
import { EditorView } from '@codemirror/basic-setup';

const toggleHelp = StateEffect.define()

const helpPanelState = StateField.define({
  create: () => false,
  update(value, tr) {
    for (let e of tr.effects) if (e.is(toggleHelp)) value = e.value
    return value
  },
  provide: f => showPanel.from(f, on => on ? createHelpPanel : null)
})


function createHelpPanel( view ) {
  let dom = document.createElement("div")
  dom.textContent = "F1: Toggle the help panel"
  dom.className = "cm-help-panel"
  return {top: true, dom}
}

const helpKeymap = [{
  key: "F1",
  run(view) {
    view.dispatch({
      effects: toggleHelp.of(!view.state.field(helpPanelState))
    })
    return true
  }
}]

const helpTheme = EditorView.baseTheme({
  ".cm-help-panel": {
    padding: "5px 10px",
    backgroundColor: "#fffa8f",
    fontFamily: "monospace"
  }
})

function helpPanel() {
  return [helpPanelState, keymap.of(helpKeymap), helpTheme]
}


// EXPORTS //

export default helpPanel;