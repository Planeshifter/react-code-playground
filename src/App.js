// MODULES //

import React from 'react';
import CodePlayground from './playground.js';
import './styles.css';


// MAIN //

function App() {
	return <CodePlayground
		defaultValue={`
var capitalize = require( '@stdlib/string/capitalize' );
var replace = require( '@stdlib/string/replace' );

var out;
var str;

out = replace( 'beep', 'e', 'o' );
// returns 'boop'

out = replace( 'Hello World', /world/i, 'Mr. President' );
// returns 'Hello Mr. President'

str = 'Oranges and lemons say the bells of St. Clement\\'s';
out = replace( str, /([^\\s]*)/gi, replacer );
// returns 'Oranges And Lemons Say The Bells Of St. Clement\\'s'

function replacer( match, p1 ) {
		return capitalize( p1 );
}		
		`}
	/>;
}


// EXPORTS //

export default App;