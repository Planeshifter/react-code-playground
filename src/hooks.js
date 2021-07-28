// MODULES //

import { useRef, useEffect, useState } from 'react';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';


// EXPORTS //

/**
 * Hook for the CodeMirror state.
 * 
 * @param {string} text - initial text
 * @returns {Object} CodeMirror editor state
 */
export function useCodeMirrorState( text ) {
	const [ editorState, setEditorState ] = useState( null );

	useEffect( () => {
		setEditorState( EditorState.create({
			extensions: [
				basicSetup,
				javascript()
			],
			doc: text
		}) );
	}, [ text ] );
	return editorState;
}

/**
 * Hook for the CodeMirror view.
 * 
 * @param {Object} editorState - CodeMirror editor state
 * @returns {Node} CodeMirror dom view
 */
export function useCodeMirrorView( editorState ) {
	const dom = useRef( document.createElement( 'div' ) );
	const [ view, setView ] = useState( null );
	useEffect( () => {
		if ( !view && editorState ) {
			setView( new EditorView({
				state: editorState, 
				parent: dom.current
			}) );
		}
	}, [ editorState, view ] );

	useEffect( () => {
		if ( view && editorState && view.state !== editorState ) {
			view.setState( editorState );
		}
	}, [ editorState, view ] );
	return dom;
}
