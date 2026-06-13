var CTR = CTR || {};

CTR.SolariSegment = function( settings ) {

	var 
		_settings = settings,
		// Allow external speed multiplier; default 1.0
		_speedMultiplier = typeof _settings.speedMultiplier === 'number' ? _settings.speedMultiplier : 1,
		_speedFactor = Math.random() * .01,
		_speed = ( .25 + _speedFactor ) * _speedMultiplier,
		_angle = 0,
		_currentValue = 0,
		_nextValue = 0,
		_values = _settings.values,
		_startTime = Date.now(),
		_li,
		_front,
		_flipFront,
		_flipBack,
		_back;

	function _init() {

		_li = document.createElement( 'li' );
		_li.className = 'segment';
		_li.style.width = _settings.width + 'px';
		_li.style.height = _settings.height + 'px';

		_front = document.createElement( 'div' );
		_front.className = 'front';
		_front.style.lineHeight = _settings.height + 'px';

		_flipFront = document.createElement( 'div' );
		_flipFront.className = 'flip-front';
		_flipFront.style.webkitTransformOrigin = _flipFront.style.MozTransformOrigin = '0 ' + .5 * _settings.height + 'px';
		
		_flipBack = document.createElement( 'div' );
		_flipBack.className = 'flip-back';
		_flipBack.style.lineHeight = _settings.height + 'px';
		_flipBack.style.webkitTransformOrigin = _flipBack.style.MozTransformOrigin = '0 ' + .5 * _settings.height + 'px';
		
		_back = document.createElement( 'div' );
		_back.className = 'back';
		
		_li.appendChild( _front );
		_li.appendChild( _flipFront );
		_li.appendChild( _flipBack );
		_li.appendChild( _back );

	}

	function _update() {

		var update = false;

		if( _currentValue != _nextValue ) {
		
			var time = Date.now();
			_angle += ( _speed * ( time - _startTime ) );
			_startTime = time;

			if( _angle >= 180 ) {

				_back.textContent = _values[ _currentValue ];
				_flipBack.textContent = _values[ _currentValue ];

				_currentValue++;
				_currentValue %= _values.length;

				_front.textContent = _values[ _currentValue ];
				_flipFront.textContent = _values[ _currentValue ];
				_angle %= 180;

			}

			update = true;
			
		} else {

			var time = Date.now();
			_angle += ( _speed * ( time - _startTime ) );
			_startTime = time;
			if( _angle >= 180 ) _angle = 180;

			//_back.textContent = _values[ _currentValue ];
			//_flipBack.textContent = _values[ _currentValue ];
			_front.textContent = _values[ _currentValue ];
			_flipFront.textContent = _values[ _currentValue ];

			update = true;

		}

		if( update ) {
			// Optional external per-segment update hook
			if (typeof _settings.onUpdate === 'function') {
				_settings.onUpdate();
			}
		
			var c = Math.abs( 32 + 16 * Math.sin( _angle * Math.PI / 180 ) ) | 0;
			_flipFront.style.webkitTransform = _flipFront.style.MozTransform = 'rotateX(' + ( 180 - _angle ) + 'deg) translateY(' + .5 * _settings.height + 'px) translateZ(.1px)';
			_flipFront.style.backgroundColor = 'rgb(' + c + ',' + c + ',' + c + ')';
			var c = 170 - ( _angle * 170 / 180 ) | 0;
			_flipBack.style.webkitTransform = _flipBack.style.MozTransform = 'rotateX(-' + _angle + 'deg)';
			_flipBack.style.color = 'rgb(' + c + ',' + c + ',' + c + ')';
			var c = ( _angle * 170 / 180 ) | 0;
			_flipFront.style.color = 'rgb(' + c + ',' + c + ',' + c + ')';
			var c = Math.abs( 32 - 16 * Math.sin( _angle * Math.PI / 180 ) ) | 0;
			_flipBack.style.backgroundColor = 'rgb(' + c + ',' + c + ',' + c + ')';
		}

	}

	function _setContent( v ) {

		for( var j = 0; j < _values.length; j++ ) {
			if( _values[ j ] == v ) {
				_nextValue = j;
				return;
			}
		}
		_nextValue = 0;

	}

	_init();

	return {
		getElement: function() { return _li },
		setContent: _setContent,
		update: _update
	}

}

CTR.SOLARIVALUES = {
	letter: [ 
		' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
		'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 
		'T', 'U', 'V', 'W', 'X', 'Y', 'Z' 
	],
	number: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
	hour: [ 
		'00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
		'10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
		'20', '21', '22', '23', '24'
	],
	minute: [ 
		'00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
		'10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
		'20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
		'30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
		'40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
		'50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
	]
};

CTR.SolariBoard = function( settings ) {

	// Multi-row–oriented implementation: each instance is anchored
	// to its container's top-left and sized explicitly.
	var _settings = settings || {};
	var _container = _settings.container;
	var _format = _settings.format || [];
	var _segmentWidth = _settings.segmentWidth || 60;
	var _segmentHeight = _settings.segmentHeight || 80;
	var _fontSize = _settings.fontSize || 64;
	var _speedMultiplier = typeof _settings.speedMultiplier === 'number' ? _settings.speedMultiplier : 1;
	var _onSegmentUpdate = typeof _settings.onSegmentUpdate === 'function' ? _settings.onSegmentUpdate : null;

	var _display = document.createElement( 'div' );
	var _segments = document.createElement( 'ul' );
	var _segmentArray = [];
	var _totalWidth = 0;

	function _setContent( v ) {
		// Support array-of-values (original) and simple strings.
		if ( typeof v === 'string' ) {
			var s = v.toString();
			var arr = [];
			for ( var i = 0; i < _format.length; i++ ) {
				arr.push( s[ i ] || ' ' );
			}
			v = arr;
		}

		for( var j = 0; j < _format.length; j++ ) {
			var val = v[ j ];
			_segmentArray[ j ].setContent( val );
		}
	}

	function _addSegment( valueSet, index ) {

		var v = valueSet;
		// In this build we treat each segment as exactly one character
		// wide, so every entry in _format becomes one independent tile.
		var charWidth = _segmentWidth;
		var segment = new CTR.SolariSegment( {
			width: charWidth,
			height: _segmentHeight,
			values: v,
			speedMultiplier: _speedMultiplier,
			onUpdate: _onSegmentUpdate ? function() {
				_onSegmentUpdate( index );
			} : null
		} );

		_segmentArray.push( segment );
		_segments.appendChild( segment.getElement() );
		_totalWidth += charWidth;

	}

	function _layout() {

		// Add fixed gap between characters.
		for ( var j = 0; j < _segmentArray.length - 1; j++ ) {
			_segmentArray[ j ].getElement().style.marginRight = '4px';
			_totalWidth += 4;
		}

		// Extra vertical pixels added by the frame (padding + borders).
		// Leave as a constant for now; vertical alignment tweaks are
		// applied via the row host rather than this value.
		var framePadding = 10; // total extra height over segmentHeight
		_segments.className = 'segments';
		_segments.style.width = ( _totalWidth + framePadding ) + 'px';
		// Match the visual row height exactly to the segment height
		// so the extra frame does not change vertical spacing.
		_segments.style.height = _segmentHeight + 'px';

		_display.className = 'display';
		_display.style.position = 'absolute';
		_display.style.left = '0px';
		// Reset any vertical offset; we'll control row spacing via
		// the parent row host positioning in MultiRowSolariBoard.
		_display.style.top = '0px';
		_display.style.margin = '0';
		_display.style.fontSize = _fontSize + 'px';
		_display.style.width = _totalWidth + 'px';
		_display.style.height = _segmentHeight + 'px';

		// Perspective origins at mid-height of character band.
		var origin = ( 0.5 * _totalWidth ) + 'px ' + ( _segmentHeight * 0.5 ) + 'px';
		_display.style.webkitPerspectiveOrigin = _display.style.MozPerspectiveOrigin = origin;
		_display.style.perspectiveOrigin = origin;
		_display.style.webkitTransformOrigin = _display.style.MozTransformOrigin = origin;
		_display.style.transformOrigin = origin;
	}

	function _init() {
		_totalWidth = 0;
		_segmentArray.length = 0;
		_segments.innerHTML = '';

		for ( var j = 0; j < _format.length; j++ ) {
			_addSegment( _format[ j ], j );
		}

		_layout();
		_display.appendChild( _segments );
		if ( _container ) {
			_container.appendChild( _display );
		}
	}

	function _update() {
		window.requestAnimationFrame( _update );
		for ( var j = 0; j < _segmentArray.length; j++ ) {
			_segmentArray[ j ].update();
		}
	}

	_init();
	_update();

	return {
		getDisplay: function() { return _segments; },
		setContent: _setContent
	};

}

// Simple multi-row wrapper around SolariBoard that positions
// one board instance per row inside a single container.
CTR.MultiRowSolariBoard = function( settings ) {

	var _settings = settings || {};
	var _container = _settings.container;
	var _rows = _settings.rows || 1;
	var _cols = _settings.cols || 20;
	var _segmentWidth = _settings.segmentWidth || 40;
	var _segmentHeight = _settings.segmentHeight || 80;
	var _fontSize = _settings.fontSize || 64;
	var _rowGap = typeof _settings.rowGap === 'number' ? _settings.rowGap : 10;
	var _speedMultiplier = typeof _settings.speedMultiplier === 'number' ? _settings.speedMultiplier : 1;
	var _onSegmentUpdate = typeof _settings.onSegmentUpdate === 'function' ? _settings.onSegmentUpdate : null;

	var _rowBoards = [];

	function _build() {
		// Clear existing
		while ( _container.firstChild ) {
			_container.removeChild( _container.firstChild );
		}
		_rowBoards = [];
		_container.style.position = 'relative';

		for ( var r = 0; r < _rows; r++ ) {
			var rowHost = document.createElement( 'div' );
			rowHost.className = 'solari-multi-row';
			rowHost.style.position = 'absolute';
			// Left-align the board strip inside the main container, and
			// reset vertical spacing to depend only on segmentHeight + rowGap.
			rowHost.style.left = '0px';
			rowHost.style.top = ( r * ( _segmentHeight + _rowGap ) ) + 'px';
			rowHost.style.margin = '0';
			_container.appendChild( rowHost );

			var format = [];
			for ( var c = 0; c < _cols; c++ ) {
				format.push( CTR.SOLARIVALUES.letter );
			}

			(function(rowIndex, host){
				var board = new CTR.SolariBoard({
					container: host,
					format: format,
					segmentWidth: _segmentWidth,
					segmentHeight: _segmentHeight,
					fontSize: _fontSize,
					speedMultiplier: _speedMultiplier,
					onSegmentUpdate: _onSegmentUpdate ? function(segmentIndex){
						_onSegmentUpdate(rowIndex, segmentIndex);
					} : null
				});
				_rowBoards.push( board );
			})(r, rowHost);
		}

		// Set container height to fit all rows.
		_container.style.height = ( _rows * _segmentHeight + ( _rows - 1 ) * _rowGap ) + 'px';
	}

	function _setRowContent( rowIndex, text ) {
		if ( rowIndex < 0 || rowIndex >= _rowBoards.length ) return;
		var board = _rowBoards[ rowIndex ];
		var value = String( text || '' ).toUpperCase();
		if ( value.length < _cols ) {
			while ( value.length < _cols ) value += ' ';
		} else if ( value.length > _cols ) {
			value = value.substr( 0, _cols );
		}
		board.setContent( value );
	}

	function _setAllRows( lines ) {
		lines = lines || [];
		for ( var r = 0; r < _rows; r++ ) {
			_setRowContent( r, lines[ r ] || '' );
		}
	}

	function _getRows() { return _rows; }
	function _getCols() { return _cols; }

	_build();

	return {
		setRowContent: _setRowContent,
		setAllRows: _setAllRows,
		getRows: _getRows,
		getCols: _getCols
	};

}

// Extremely simple helper for debugging: render a single row with a
// single-character Solari segment, so we can reason about absolute
// sizing and positioning from first principles.
CTR.SingleFlapBoard = function( settings ) {
	var _settings = settings || {};
	var _container = _settings.container;
	var _segmentWidth = _settings.segmentWidth || 50;
	var _segmentHeight = _settings.segmentHeight || 100;
	var _fontSize = _settings.fontSize || 80;

	if ( !_container ) return;
	while ( _container.firstChild ) {
		_container.removeChild( _container.firstChild );
	}

	var format = [ CTR.SOLARIVALUES.letter ];
	var board = new CTR.SolariBoard({
		container: _container,
		format: format,
		segmentWidth: _segmentWidth,
		segmentHeight: _segmentHeight,
		fontSize: _fontSize
	});

	board.setContent('A');

	return {
		setContent: function(ch) { board.setContent(ch || ' '); }
	};
}