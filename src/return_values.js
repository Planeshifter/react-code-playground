// MODULES //

import { Decoration, WidgetType, ViewPlugin } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import startsWith from '@stdlib/string-starts-with';


// VARIABLES //

const RE_VARIABLE_ASSIGNMENT = /(?:var|const|let)? *([^=]+?) *=[^\n]+/;


// MAIN //

class ReturnAnnotationWidget extends WidgetType {
  constructor( name ) {
    super();
    this.name = name;
  }

	toDOM = () => {
		let wrap = document.createElement( "span" )
    wrap.setAttribute("aria-hidden", "true")
    wrap.innerHTML = '{{'+this.name+'}}';
		wrap.className = "cm-return-annotation"
		return wrap
	}
	
	ignoreEvent() { 
    return false;
  }
}

function returnValues( view ) {
	let widgets = [];
	for ( let { from, to } of view.visibleRanges ) {
		syntaxTree( view.state ).iterate({
			from, to,
			enter: ( type, from, to ) => {
        const comment = view.state.doc.sliceString( from, to );
				if ( type.name === "LineComment" ) {
          if ( startsWith( comment, '// returns' ) ) {
            const previousLine = view.state.doc.lineAt( from-1 );
            const match = RE_VARIABLE_ASSIGNMENT.exec( previousLine.text );
            if ( match ) {
              const deco = Decoration.widget({
                widget: new ReturnAnnotationWidget( match[ 1 ] ),
                side: 1
              });
              widgets.push( deco.range( to ) );
            }
          }
				}
			}
		});
	}
	return Decoration.set( widgets );
}

const returnValuesPlugin = ViewPlugin.fromClass( class {
  decorations

  constructor(view) {
    this.decorations = returnValues(view)
  }

  update(update) {
    if ( update.docChanged || update.viewportChanged ) {
      this.decorations = returnValues(update.view)
    }
  }
}, {
  decorations: v => v.decorations
});


// EXPORTS //

export default returnValuesPlugin;