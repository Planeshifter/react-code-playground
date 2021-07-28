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

// MODULES //

import { useRef, useEffect, useState } from 'react';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import helpPanel from './help_panel.js';
import returnValuesPlugin from './return_values.js';
import installDependencyPlugin from './install_dependency.js';


// EXPORTS //

/**
 * Hook for a CodeMirror instance.
 * 
 * @param {string} text - initial text
 * @returns {Node} CodeMirror dom view
 */
export function useCodeMirror( text ) {
	const dom = useRef( document.createElement( 'div' ) );
	const [ view, setView ] = useState( null );
	const [ state, setState ] = useState( null );

	useEffect( () => {
		setState( EditorState.create({
			extensions: [
				basicSetup,
				javascript(),
				helpPanel(),
				returnValuesPlugin,
				installDependencyPlugin
			],
			doc: text
		}) );
	}, [ text ] );
	useEffect( () => {
		if ( !view && state ) {
			setView( new EditorView({
				state: state, 
				parent: dom.current
			}) );
		}
	}, [ state, view ] );

	useEffect( () => {
		if ( view && state && view.state !== state ) {
			view.setState( state );
		}
	}, [ state, view ] );
	return { dom, view, state };
}
