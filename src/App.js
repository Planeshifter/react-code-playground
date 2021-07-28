// MODULES //

import React from 'react';
import CodePlayground from './playground.js';
import './styles.css';


// MAIN //

function App() {
	return <CodePlayground
		code={`
			console.log( 'Hello, world!' );
		`}
	/>;
}


// EXPORTS //

export default App;