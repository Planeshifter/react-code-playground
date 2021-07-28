// MODULES //

import React from 'react';
import { useCodeMirrorState, useCodeMirrorView } from './hooks.js';


// MAIN //

/**
 * Main playground component.
 * 
 * @param {Object} props - component props
 * @param {string} props.code - initial code
 * @returns {ReactElement} playground component
 */
function CodePlayground({ code }) {
	const editorState = useCodeMirrorState( code );
	const dom = useCodeMirrorView( editorState );
	return (
		<div className="CodePlayground">
			<div ref={dom} />
		</div>
	);
}


// EXPORTS //

export default CodePlayground;