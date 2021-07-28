// MODULES //

import React, { useState } from 'react';
import { transform } from 'lebab';
import copyToClipboard from 'clipboard-copy';
import pkg2standalone from '@stdlib/namespace-pkg2standalone';
import standalone2pkg from '@stdlib/namespace-standalone2pkg';
import replace from '@stdlib/string-replace';
import { useCodeMirror } from './hooks.js';


// VARIABLES //

const RE_STDLIB_PKG = /'(@stdlib\/[^']+)'/g;
const RE_RETURN_ANNOTATION = /\/\/ returns [^\n]+/g;


// MAIN //

/**
 * Main playground component.
 * 
 * @param {Object} props - component props
 * @param {string} props.defaultValue - initial code
 * @returns {ReactElement} playground component
 */
function CodePlayground({ defaultValue }) {
	defaultValue = replace( defaultValue, RE_RETURN_ANNOTATION, '// returns ' );
	const { dom, view } = useCodeMirror( defaultValue );
	const [ standalone, setStandalone ] = useState( false );

	const resetES5 = () => {
		console.log( 'Reset code...' );
	  const transaction = view.state.update({
			changes: {
				from: 0, 
				to: view.state.doc.length, 
				insert: defaultValue
			}
		});
		view.dispatch( transaction );
	};
	const resetES6 = () => {
			const { code, warnings } = transform(
				defaultValue,
				[ 'let', 'arrow', 'arrow-return', 'commonjs' ] // transforms to apply
			);
			console.log( code );
			console.log( warnings );
			const transaction = view.state.update({
				changes: {
					from: 0, 
					to: view.state.doc.length, 
					insert: code
				}
			});
			view.dispatch( transaction );
	};
	const togglePackages = () => {
		let code = view.state.doc.toString();
		if ( !standalone ) {
			code = replace( code, RE_STDLIB_PKG, ( _, p1 ) => {
				const pkg = pkg2standalone( p1 );
				if ( pkg ) {
					return '\'' + pkg + '\'';
				}
				return '\'' + p1 + '\'';
			});
		} else {
			code = replace( code, RE_STDLIB_PKG, ( _, p1 ) => {
				const pkg = standalone2pkg( p1 );
				if ( pkg ) {
					return '\'' + pkg + '\'';
				}
				return '\'' + p1 + '\'';
			});
		}
		const transaction = view.state.update({
			changes: {
				from: 0, 
				to: view.state.doc.length, 
				insert: code
			}
		});
		view.dispatch( transaction );
		setStandalone( !standalone );
	};
	const copyCodeToClipboard = () => {
		copyToClipboard( view.state.doc.toString() );
	};
	return (
		<div className="CodePlayground">
			<div ref={dom} />
			<button onClick={resetES5} >
				Reset ES5
			</button>
			<button onClick={resetES6} >
				Reset ES6
			</button>
			<button onClick={togglePackages} >
				Toggle between Standalone and Top-Level Packages
			</button>
			<button onClick={copyCodeToClipboard}>
				Copy to clipboard
			</button>
		</div>
	);
}


// EXPORTS //

export default CodePlayground;