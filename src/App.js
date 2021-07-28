// MODULES //

import React, { useRef, useEffect, useState } from 'react';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import './styles.css';


// FUNCTIONS //

/**
 * Hook for the CodeMirror state.
 * 
 * @param {string} text - initial text
 * @returns {Object} CodeMirror editor state
 */
function useCodeMirrorState( text ) {
	const [ editorState, setEditorState ] = useState( null );

	useEffect( () => {
		setEditorState( EditorState.create({
			extensions: [
				basicSetup,
				javascript()
			],
			doc: text
		}) );
	}, [] );
	return editorState;
}

/**
 * Hook for the CodeMirror view.
 * 
 * @param {Object} editorState - CodeMirror editor state
 * @returns {Node} CodeMirror dom view
 */
function useCodeMirrorView( editorState ) {
	const dom = useRef( document.createElement( 'div' ) );
	const [ view, setView ] = useState( null );
	useEffect( () => {
		if ( !view && editorState ) {
			setView( new EditorView({
				state: editorState, 
				parent:dom.current
			}) );
		}
	}, [ editorState ] );

	useEffect( () => {
		if ( view && editorState && view.state !== editorState ) {
			view.updateState( editorState );
		}
	}, [ editorState, view ] );
	return dom;
}


// MAIN //

function CodePlayground() {
	const editorState = useCodeMirrorState( 'Hello World!' );
	const dom = useCodeMirrorView( editorState );
	return (
		<div className="CodePlayground">
			<div ref={dom} />
		</div>
	);
}


// EXPORTS //

export default CodePlayground;