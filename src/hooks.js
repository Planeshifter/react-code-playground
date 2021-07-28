// MODULES //

import { useRef, useEffect, useState } from 'react';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { helpPanel } from './help_panel.js';


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
				helpPanel()
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
