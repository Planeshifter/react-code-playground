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

import { Decoration, WidgetType, ViewPlugin } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import copyToClipboard from 'clipboard-copy';
import startsWith from '@stdlib/string-starts-with';
import contains from '@stdlib/assert-contains';
import prunePackage from './prune_package.js';


// VARIABLES //

const RE_REQUIRE_DEP = /require\( ['"]([^'"]+)['"] \)/;
const RE_IMPORT_FROM = /from ['"]([^'"]+)['"]/;


// MAIN //

class InstallButtonWidget extends WidgetType {
  constructor( name ) {
    super();
    this.name = name;
  }

  eq = ( other ) => { 
    return other.name === this.name;
  }

	toDOM = () => {
		const wrap = document.createElement( "span" );
    wrap.setAttribute("aria-hidden", "true");

    const button = wrap.appendChild(document.createElement( "button" ) );
    button.innerHTML = 'content_paste';
    button.className = 'material-icons';
    button.title = 'Copy npm install command to clipboard'
    button.onclick = () => {
      let pkg = this.name;
      if ( startsWith( pkg, '@stdlib' ) && !contains( pkg, '-' ) ) {
        pkg = prunePackage( pkg, 1 );
      }
      copyToClipboard( `npm install ${pkg}` );
    };
		wrap.className = "cm-install-dependency-btn";
		return wrap;
	}
	
	ignoreEvent() { 
    return true;
  }
}

function dependencies( view ) {
	let widgets = [];
	for ( let { from, to } of view.visibleRanges ) {
		syntaxTree( view.state ).iterate({
			from, to,
			enter: ( type, from, to ) => {
        console.log( type )
        if ( type.name === 'CallExpression' ) {
          const call = view.state.doc.sliceString( from, to );
          const match = RE_REQUIRE_DEP.exec( call );
          if ( match ) {
            const deco = Decoration.widget({
              widget: new InstallButtonWidget( match[ 1 ] ),
              side: 1
            });
            widgets.push( deco.range( to+1 ) );
          }
        } 
        else if ( type.name === 'ImportDeclaration' ) {
          const call = view.state.doc.sliceString( from, to );
          const match = RE_IMPORT_FROM.exec( call );
          if ( match ) {
            const deco = Decoration.widget({
              widget: new InstallButtonWidget( match[ 1 ] ),
              side: 1
            });
            widgets.push( deco.range( to ) );
          }
        } 
			}
		});
	}
	return Decoration.set( widgets );
}

const installDependencyPlugin = ViewPlugin.fromClass( class {
  decorations

  constructor(view) {
    this.decorations = dependencies(view)
  }

  update(update) {
    if ( update.docChanged || update.viewportChanged ) {
      this.decorations = dependencies(update.view)
    }
  }
}, {
  decorations: v => v.decorations
});


// EXPORTS //

export default installDependencyPlugin;