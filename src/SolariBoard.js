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

		var halfHeight = .5 * _settings.height;

		_li = document.createElement( 'li' );
		_li.className = 'segment';
		_li.style.width = _settings.width + 'px';
		_li.style.height = _settings.height + 'px';

		_front = document.createElement( 'div' );
		_front.className = 'front';
		_front.style.height = halfHeight + 'px';
		_front.style.lineHeight = _settings.height + 'px';

		_flipFront = document.createElement( 'div' );
		_flipFront.className = 'flip-front';
		_flipFront.style.top = halfHeight + 'px';
		_flipFront.style.height = halfHeight + 'px';
		_flipFront.style.lineHeight = '0px';
		_flipFront.style.webkitTransformOrigin = _flipFront.style.MozTransformOrigin = '0 ' + .5 * _settings.height + 'px';
		
		_flipBack = document.createElement( 'div' );
		_flipBack.className = 'flip-back';
		_flipBack.style.height = halfHeight + 'px';
		_flipBack.style.lineHeight = _settings.height + 'px';
		_flipBack.style.webkitTransformOrigin = _flipBack.style.MozTransformOrigin = '0 ' + .5 * _settings.height + 'px';
		
		_back = document.createElement( 'div' );
		_back.className = 'back';
		_back.style.top = halfHeight + 'px';
		_back.style.height = halfHeight + 'px';
		_back.style.lineHeight = '0px';
		
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

			if( _angle < 180 ) {
				var time = Date.now();
				_angle += ( _speed * ( time - _startTime ) );
				_startTime = time;
				if( _angle >= 180 ) _angle = 180;

				_back.textContent = _values[ _currentValue ];
				_flipBack.textContent = _values[ _currentValue ];
				_front.textContent = _values[ _currentValue ];
				_flipFront.textContent = _values[ _currentValue ];

				update = true;
			}

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
		' ', '.', ',', '!', '?', ':', ';', '-', '\'', '"', '/', '&', '(', ')',
		'$', '£', '€', '¥', '₹', '₩',
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
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

CTR.NIXIE_CURVE_PATHS = {
	'0': 'M50 18 C69 18 82 36 82 64 C82 100 69 142 50 142 C31 142 18 100 18 64 C18 36 31 18 50 18 Z',
	'1': 'M45 40 L60 24 L60 140',
	'2': 'M22 46 C24 28 39 18 57 18 C74 18 86 30 84 48 C82 66 65 74 50 85 C34 97 24 108 22 124 L84 124',
	'3': 'M24 32 C33 22 45 18 58 18 C74 18 84 28 84 42 C84 56 75 66 60 72 C76 78 86 90 86 106 C86 126 70 140 50 140 C36 140 24 136 16 126',
	'4': 'M74 140 L74 20 L24 92 L88 92',
	'5': 'M82 20 L30 20 L24 78 C31 70 40 66 50 66 C71 66 84 82 84 104 C84 126 69 140 48 140 C35 140 24 135 16 126',
	'6': 'M78 28 C71 22 63 18 53 18 C31 18 16 37 16 78 C16 120 30 140 52 140 C71 140 84 124 84 104 C84 84 72 70 54 70 C40 70 28 77 22 90',
	'7': 'M20 22 L86 22 L44 140',
	'8': 'M50 18 C68 18 80 31 80 48 C80 63 71 75 56 80 C73 85 84 98 84 116 C84 132 70 142 50 142 C30 142 16 132 16 116 C16 98 27 85 44 80 C29 75 20 63 20 48 C20 31 32 18 50 18',
	'9': 'M78 70 C72 83 60 90 46 90 C28 90 16 76 16 56 C16 35 30 18 50 18 C72 18 86 37 86 80 C86 121 70 140 48 140 C38 140 29 136 22 130',
	'A': 'M18 142 L48 20 L82 142 M30 98 Q50 90 70 98',
	'B': 'M24 20 L24 142 M24 20 C56 18 78 28 78 50 C78 66 66 74 52 78 C70 82 82 94 82 112 C82 134 62 142 28 142',
	'C': 'M82 34 C72 22 60 18 48 18 C28 18 16 38 16 80 C16 122 28 142 48 142 C60 142 72 138 82 126',
	'D': 'M22 20 L22 142 M22 20 C66 20 84 38 84 80 C84 124 66 142 22 142',
	'E': 'M78 20 L24 20 L24 142 L78 142 M24 82 L68 82',
	'F': 'M22 142 L22 20 L80 20 M22 82 L66 82',
	'G': 'M82 34 C72 22 60 18 48 18 C28 18 16 38 16 80 C16 122 28 142 50 142 C68 142 84 130 84 106 M84 102 L56 102',
	'H': 'M20 20 L20 142 M82 20 L82 142 M20 84 Q50 78 82 84',
	'I': 'M24 20 L82 20 M53 20 L53 142 M24 142 L82 142',
	'J': 'M82 20 L82 116 C82 134 70 142 54 142 C38 142 24 134 20 118',
	'K': 'M22 20 L22 142 M82 20 L30 86 L82 142',
	'L': 'M24 20 L24 142 L82 142',
	'M': 'M16 142 L16 20 L50 90 L84 20 L84 142',
	'N': 'M20 142 L20 20 L82 142 L82 20',
	'O': 'M50 18 C70 18 84 38 84 80 C84 122 70 142 50 142 C30 142 16 122 16 80 C16 38 30 18 50 18 Z',
	'P': 'M24 142 L24 20 M24 20 C56 18 82 30 82 56 C82 84 58 94 24 92',
	'Q': 'M50 18 C70 18 84 38 84 80 C84 122 70 142 50 142 C30 142 16 122 16 80 C16 38 30 18 50 18 Z M58 118 L84 146',
	'R': 'M24 142 L24 20 M24 20 C56 18 82 30 82 56 C82 80 62 92 40 92 M44 92 L84 142',
	'S': 'M78 30 C68 22 58 18 46 18 C30 18 18 30 18 46 C18 64 32 72 48 78 C66 84 82 92 82 112 C82 130 68 142 48 142 C34 142 22 136 14 126',
	'T': 'M18 20 L86 20 M52 20 L52 142',
	'U': 'M18 20 L18 110 C18 132 32 142 50 142 C68 142 82 132 82 110 L82 20',
	'V': 'M18 20 L50 142 L82 20',
	'W': 'M14 20 L30 142 L50 62 L70 142 L86 20',
	'X': 'M18 20 L82 142 M82 20 L18 142',
	'Y': 'M18 20 L50 86 L82 20 M50 86 L50 142',
	'Z': 'M18 20 L84 20 L20 142 L84 142',
	'.': 'M49 132 L53 132',
	',': 'M54 132 Q52 140 46 146',
	'-': 'M26 82 L78 82',
	':': 'M50 52 L52 52 M50 112 L52 112',
	'/': 'M20 142 L82 20'
};

CTR.PANAPLEX_7_SEGMENTS = {
	'0': ['a', 'b', 'c', 'd', 'e', 'f'],
	'1': ['b', 'c'],
	'2': ['a', 'b', 'd', 'e', 'g'],
	'3': ['a', 'b', 'c', 'd', 'g'],
	'4': ['b', 'c', 'f', 'g'],
	'5': ['a', 'c', 'd', 'f', 'g'],
	'6': ['a', 'c', 'd', 'e', 'f', 'g'],
	'7': ['a', 'b', 'c'],
	'8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
	'9': ['a', 'b', 'c', 'd', 'f', 'g'],
	'A': ['a', 'b', 'c', 'e', 'f', 'g'],
	'B': ['c', 'd', 'e', 'f', 'g'],
	'C': ['a', 'd', 'e', 'f'],
	'D': ['b', 'c', 'd', 'e', 'g'],
	'E': ['a', 'd', 'e', 'f', 'g'],
	'F': ['a', 'e', 'f', 'g'],
	'G': ['a', 'c', 'd', 'e', 'f'],
	'H': ['b', 'c', 'e', 'f', 'g'],
	'I': ['b', 'c'],
	'J': ['b', 'c', 'd'],
	'L': ['d', 'e', 'f'],
	'N': ['c', 'e', 'g'],
	'O': ['a', 'b', 'c', 'd', 'e', 'f'],
	'P': ['a', 'b', 'e', 'f', 'g'],
	'R': ['e', 'g'],
	'S': ['a', 'c', 'd', 'f', 'g'],
	'T': ['d', 'e', 'f', 'g'],
	'U': ['b', 'c', 'd', 'e', 'f'],
	'Y': ['b', 'c', 'd', 'f', 'g'],
	'.': ['dp'],
	',': ['dp'],
	'-': ['g'],
	'_': ['d'],
	' ': []
};

CTR.PANAPLEX_14_SEGMENTS = {
	'0': ['a', 'b', 'c', 'd', 'e', 'f'],
	'1': ['b', 'c'],
	'2': ['a', 'b', 'd', 'e', 'g1', 'g2'],
	'3': ['a', 'b', 'c', 'd', 'g1', 'g2'],
	'4': ['b', 'c', 'f', 'g1', 'g2'],
	'5': ['a', 'c', 'd', 'f', 'g1', 'g2'],
	'6': ['a', 'c', 'd', 'e', 'f', 'g1', 'g2'],
	'7': ['a', 'b', 'c'],
	'8': ['a', 'b', 'c', 'd', 'e', 'f', 'g1', 'g2'],
	'9': ['a', 'b', 'c', 'd', 'f', 'g1', 'g2'],
	'A': ['a', 'b', 'c', 'e', 'f', 'g1', 'g2'],
	'B': ['c', 'd', 'e', 'f', 'g1', 'g2'],
	'C': ['a', 'd', 'e', 'f'],
	'D': ['b', 'c', 'd', 'e', 'g1', 'g2'],
	'E': ['a', 'd', 'e', 'f', 'g1', 'g2'],
	'F': ['a', 'e', 'f', 'g1', 'g2'],
	'G': ['a', 'c', 'd', 'e', 'f', 'g2'],
	'H': ['b', 'c', 'e', 'f', 'g1', 'g2'],
	'I': ['a', 'd', 'l', 'm'],
	'J': ['b', 'c', 'd', 'e'],
	'K': ['e', 'f', 'g1', 'j', 'm'],
	'L': ['d', 'e', 'f'],
	'M': ['b', 'c', 'e', 'f', 'h', 'i'],
	'N': ['b', 'c', 'e', 'f', 'h', 'k'],
	'O': ['a', 'b', 'c', 'd', 'e', 'f'],
	'P': ['a', 'b', 'e', 'f', 'g1', 'g2'],
	'Q': ['a', 'b', 'c', 'd', 'e', 'f', 'k'],
	'R': ['a', 'b', 'e', 'f', 'g1', 'g2', 'k'],
	'S': ['a', 'c', 'd', 'f', 'g1', 'g2'],
	'T': ['a', 'l', 'm'],
	'U': ['b', 'c', 'd', 'e', 'f'],
	'V': ['e', 'f', 'j', 'k'],
	'W': ['b', 'c', 'd', 'e', 'f', 'j', 'k'],
	'X': ['h', 'i', 'j', 'k'],
	'Y': ['h', 'i', 'g1', 'g2', 'c', 'd'],
	'Z': ['a', 'd', 'i', 'j'],
	'.': ['dp'],
	',': ['dp'],
	'-': ['g1', 'g2'],
	'_': ['d'],
	'%': ['h', 'k', 'dp'],
	' ': []
};

CTR.PANAPLEX_LAYOUTS = {
	panaplex7: {
		segmentNames: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'],
		charMap: CTR.PANAPLEX_7_SEGMENTS,
		className: 'ctr-panaplex7'
	},
	panaplex14: {
		segmentNames: ['a', 'b', 'c', 'd', 'e', 'f', 'g1', 'g2', 'h', 'i', 'j', 'k', 'l', 'm', 'dp'],
		charMap: CTR.PANAPLEX_14_SEGMENTS,
		className: 'ctr-panaplex14'
	}
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
		// Size each tile based on the longest token in its value set
		// so multi-character sets (e.g. hour/minute) do not clip.
		var charWidth = _segmentWidth;
		if ( Array.isArray( v ) ) {
			var maxChars = 1;
			for ( var i = 0; i < v.length; i++ ) {
				var tokenLen = String( v[ i ] ).length;
				if ( tokenLen > maxChars ) maxChars = tokenLen;
			}
			charWidth = _segmentWidth * maxChars;
		}
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
	var _rowBottomBleed = typeof _settings.rowBottomBleed === 'number' ? _settings.rowBottomBleed : 8;
	var _speedMultiplier = typeof _settings.speedMultiplier === 'number' ? _settings.speedMultiplier : 1;
	var _onSegmentUpdate = typeof _settings.onSegmentUpdate === 'function' ? _settings.onSegmentUpdate : null;

	var _rowBoards = [];
	var _lineState = [];
	var _pendingTimeouts = [];

	function _clearPending() {
		for ( var i = 0; i < _pendingTimeouts.length; i++ ) {
			clearTimeout( _pendingTimeouts[ i ] );
		}
		_pendingTimeouts = [];
	}

	function _normalizeLine( text ) {
		var value = String( text || '' ).toUpperCase();
		if ( value.length < _cols ) {
			while ( value.length < _cols ) value += ' ';
		} else if ( value.length > _cols ) {
			value = value.substr( 0, _cols );
		}
		return value;
	}

	function _build() {
		_clearPending();
		// Clear existing
		while ( _container.firstChild ) {
			_container.removeChild( _container.firstChild );
		}
		_rowBoards = [];
		_lineState = [];
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
		_container.style.height = ( _rows * _segmentHeight + ( _rows - 1 ) * _rowGap + _rowBottomBleed ) + 'px';
		for ( var i = 0; i < _rows; i++ ) {
			_lineState.push( _normalizeLine( '' ) );
		}
	}

	function _setRowContent( rowIndex, text ) {
		if ( rowIndex < 0 || rowIndex >= _rowBoards.length ) return;
		var board = _rowBoards[ rowIndex ];
		var value = _normalizeLine( text );
		board.setContent( value );
		_lineState[ rowIndex ] = value;
	}

	function _setAllRows( lines ) {
		_clearPending();
		lines = lines || [];
		for ( var r = 0; r < _rows; r++ ) {
			_setRowContent( r, lines[ r ] || '' );
		}
	}

	function _setAllRowsDiff( lines, options ) {
		_clearPending();
		lines = lines || [];
		options = options || {};
		var sequential = !!options.sequential;
		var rowDelayMs = typeof options.rowDelayMs === 'number' ? options.rowDelayMs : 1500;

		var changedRows = [];
		for ( var r = 0; r < _rows; r++ ) {
			var next = _normalizeLine( lines[ r ] || '' );
			if ( _lineState[ r ] !== next ) {
				changedRows.push({ row: r, value: next });
			}
		}

		if ( !changedRows.length ) return;

		if ( sequential ) {
			for ( var i = 0; i < changedRows.length; i++ ) {
				(function(order, item){
					var timeoutId = setTimeout(function(){
						_rowBoards[ item.row ].setContent( item.value );
						_lineState[ item.row ] = item.value;
					}, order * rowDelayMs);
					_pendingTimeouts.push( timeoutId );
				})(i, changedRows[i]);
			}
			return;
		}

		for ( var j = 0; j < changedRows.length; j++ ) {
			var item = changedRows[ j ];
			_rowBoards[ item.row ].setContent( item.value );
			_lineState[ item.row ] = item.value;
		}
	}

	function _resize( rows, cols ) {
		rows = rows || 1;
		cols = cols || 1;
		if ( rows === _rows && cols === _cols ) return;
		_rows = rows;
		_cols = cols;
		_build();
	}

	function _getRows() { return _rows; }
	function _getCols() { return _cols; }

	_build();

	return {
		setRowContent: _setRowContent,
		setAllRows: _setAllRows,
		setAllRowsDiff: _setAllRowsDiff,
		resize: _resize,
		clearPendingUpdates: _clearPending,
		getRows: _getRows,
		getCols: _getCols
	};

}

// Phase 1 mode abstraction for multi-row boards.
// Default mode remains splitflap, and additional modes can be
// provided via renderer factory functions in settings.renderers.
CTR.MultiRowDisplayBoard = function( settings ) {

	var _settings = settings || {};
	var _container = _settings.container;
	var _renderers = _settings.renderers || {};
	var _mode = _settings.mode || 'splitflap';
	var _rows = _settings.rows || 1;
	var _cols = _settings.cols || 20;
	var _activeBoard = null;
	var _svgNs = 'http://www.w3.org/2000/svg';
	var _nixieGlyphs = _settings.nixieGlyphs || CTR.NIXIE_CURVE_PATHS;
	var _panaplexLayouts = _settings.panaplexLayouts || CTR.PANAPLEX_LAYOUTS;

	function _cloneBaseSettings() {
		return {
			container: _container,
			rows: _rows,
			cols: _cols,
			segmentWidth: _settings.segmentWidth,
			segmentHeight: _settings.segmentHeight,
			fontSize: _settings.fontSize,
			rowGap: _settings.rowGap,
			speedMultiplier: _settings.speedMultiplier,
			onSegmentUpdate: _settings.onSegmentUpdate
		};
	}

	function _clearContainer() {
		if ( !_container ) return;
		while ( _container.firstChild ) {
			_container.removeChild( _container.firstChild );
		}
	}

	function _createSplitflapBoard() {
		return new CTR.MultiRowSolariBoard( _cloneBaseSettings() );
	}

	function _createBuiltInNixieRenderer() {
		var rowGap = typeof _settings.rowGap === 'number' ? _settings.rowGap : 3;
		var segmentHeight = _settings.segmentHeight || 80;
		var segmentWidth = _settings.segmentWidth || 40;
		var rowBottomBleed = typeof _settings.rowBottomBleed === 'number' ? _settings.rowBottomBleed : 12;
		var speedMultiplier = typeof _settings.speedMultiplier === 'number' ? _settings.speedMultiplier : 1;
		var durationMs = Math.max(120, Math.round(740 / Math.max(0.25, speedMultiplier)));
		var lineState = [];
		var pendingTimeouts = [];
		var cellRows = [];
		var root = null;

		function normalizeLine( text ) {
			var value = String( text || '' ).toUpperCase();
			if ( value.length < _cols ) {
				while ( value.length < _cols ) value += ' ';
			} else if ( value.length > _cols ) {
				value = value.substr( 0, _cols );
			}
			return value;
		}

		function clearPending() {
			for ( var i = 0; i < pendingTimeouts.length; i++ ) {
				clearTimeout( pendingTimeouts[ i ] );
			}
			pendingTimeouts = [];
		}

		function setNixieGlyph( cellState, ch, layer ) {
			var pathEl = layer === 'current' ? cellState.pathCurrent : cellState.pathNext;
			var textEl = layer === 'current' ? cellState.textCurrent : cellState.textNext;
			var glyph = _nixieGlyphs[ ch ];
			if ( glyph ) {
				pathEl.setAttribute( 'd', glyph );
				pathEl.classList.remove( 'is-hidden' );
				textEl.textContent = '';
				textEl.classList.add( 'nixie-hidden' );
				return;
			}

			pathEl.setAttribute( 'd', '' );
			pathEl.classList.add( 'is-hidden' );
			textEl.textContent = ch;
			textEl.classList.remove( 'nixie-hidden' );
		}

		function animateCell( rowIndex, colIndex, nextChar ) {
			var cellState = cellRows[ rowIndex ][ colIndex ];
			if ( cellState.value === nextChar ) return;

			setNixieGlyph( cellState, nextChar, 'next' );
			cellState.value = nextChar;
			cellState.cell.classList.remove( 'is-changing' );
			void cellState.cell.offsetWidth;
			cellState.cell.classList.add( 'is-changing' );

			if ( typeof _settings.onSegmentUpdate === 'function' ) {
				_settings.onSegmentUpdate( rowIndex, colIndex );
			}

			var timeoutId = setTimeout(function(){
				setNixieGlyph( cellState, nextChar, 'current' );
				setNixieGlyph( cellState, ' ', 'next' );
				cellState.cell.classList.remove( 'is-changing' );
				pendingTimeouts = pendingTimeouts.filter(function(id){ return id !== timeoutId; });
			}, durationMs);

			pendingTimeouts.push( timeoutId );
		}

		function build() {
			clearPending();
			_ensureContainerModeClass( 'nixie' );
			_container.style.setProperty( '--ctr-cell-w', segmentWidth + 'px' );
			_container.style.setProperty( '--ctr-cell-h', segmentHeight + 'px' );
			_container.style.setProperty( '--ctr-mode-duration-ms', durationMs + 'ms' );
			_container.style.position = 'relative';
			_container.style.height = ( _rows * segmentHeight + ( _rows - 1 ) * rowGap + rowBottomBleed ) + 'px';

			root = document.createElement( 'div' );
			root.className = 'ctr-display-board ctr-mode-nixie';
			cellRows = [];
			lineState = [];

			for ( var r = 0; r < _rows; r++ ) {
				var rowEl = document.createElement( 'div' );
				rowEl.className = 'ctr-display-row';
				var cellRow = [];
				for ( var c = 0; c < _cols; c++ ) {
					var cell = document.createElement( 'div' );
					cell.className = 'ctr-display-cell';

					var textCurrent = document.createElement( 'span' );
					textCurrent.className = 'ctr-char-current';
					textCurrent.textContent = ' ';

					var textNext = document.createElement( 'span' );
					textNext.className = 'ctr-char-next';
					textNext.textContent = ' ';

					var nixieSvg = document.createElementNS( _svgNs, 'svg' );
					nixieSvg.setAttribute( 'viewBox', '0 0 100 160' );
					nixieSvg.setAttribute( 'aria-hidden', 'true' );
					nixieSvg.classList.add( 'ctr-nixie-svg' );

					var pathCurrent = document.createElementNS( _svgNs, 'path' );
					pathCurrent.classList.add( 'ctr-nixie-path', 'ctr-nixie-path-current' );

					var pathNext = document.createElementNS( _svgNs, 'path' );
					pathNext.classList.add( 'ctr-nixie-path', 'ctr-nixie-path-next', 'is-hidden' );

					nixieSvg.appendChild( pathCurrent );
					nixieSvg.appendChild( pathNext );
					cell.appendChild( nixieSvg );
					cell.appendChild( textCurrent );
					cell.appendChild( textNext );

					var cellState = {
						cell: cell,
						textCurrent: textCurrent,
						textNext: textNext,
						pathCurrent: pathCurrent,
						pathNext: pathNext,
						value: ' '
					};

					setNixieGlyph( cellState, ' ', 'current' );
					setNixieGlyph( cellState, ' ', 'next' );

					rowEl.appendChild( cell );
					cellRow.push( cellState );
				}
				root.appendChild( rowEl );
				cellRows.push( cellRow );
				lineState.push( normalizeLine( '' ) );
			}

			_container.appendChild( root );
		}

		function setAllRowsDiff( lines, options ) {
			clearPending();
			lines = lines || [];
			options = options || {};
			var sequential = !!options.sequential;
			var rowDelayMs = typeof options.rowDelayMs === 'number' ? options.rowDelayMs : 1500;

			var changes = [];
			for ( var r = 0; r < _rows; r++ ) {
				var next = normalizeLine( lines[ r ] || '' );
				if ( lineState[ r ] !== next ) {
					changes.push({ row: r, value: next });
				}
			}

			function updateRow( item ) {
				var previous = lineState[ item.row ] || normalizeLine( '' );
				for ( var col = 0; col < _cols; col++ ) {
					var nextChar = item.value[ col ] || ' ';
					var prevChar = previous[ col ] || ' ';
					if ( nextChar !== prevChar ) {
						animateCell( item.row, col, nextChar );
					}
				}
				lineState[ item.row ] = item.value;
			}

			if ( sequential ) {
				for ( var i = 0; i < changes.length; i++ ) {
					(function(order, item){
						var timeoutId = setTimeout(function(){
							updateRow( item );
						}, order * rowDelayMs);
						pendingTimeouts.push( timeoutId );
					})(i, changes[i]);
				}
				return;
			}

			for ( var j = 0; j < changes.length; j++ ) {
				updateRow( changes[ j ] );
			}
		}

		function setAllRows( lines ) {
			lines = lines || [];
			var normalized = [];
			for ( var r = 0; r < _rows; r++ ) {
				normalized.push( normalizeLine( lines[ r ] || '' ) );
			}
			setAllRowsDiff( normalized, { sequential: false } );
		}

		function resize( rows, cols ) {
			_rows = rows || 1;
			_cols = cols || 1;
			if ( root && root.parentNode === _container ) {
				_container.removeChild( root );
			}
			build();
		}

		build();

		return {
			setAllRowsDiff: setAllRowsDiff,
			setAllRows: setAllRows,
			clearPendingUpdates: clearPending,
			resize: resize,
			getRows: function(){ return _rows; },
			getCols: function(){ return _cols; }
		};
	}

	function _createBuiltInPanaplexRenderer( mode ) {
		var layout = _panaplexLayouts[ mode ] || _panaplexLayouts.panaplex7;
		var rowGap = typeof _settings.rowGap === 'number' ? _settings.rowGap : 3;
		var segmentHeight = _settings.segmentHeight || 80;
		var segmentWidth = _settings.segmentWidth || 40;
		var rowBottomBleed = typeof _settings.rowBottomBleed === 'number' ? _settings.rowBottomBleed : 12;
		var speedMultiplier = typeof _settings.speedMultiplier === 'number' ? _settings.speedMultiplier : 1;
		var durationMs = Math.max(120, Math.round(740 / Math.max(0.25, speedMultiplier)));
		var lineState = [];
		var pendingTimeouts = [];
		var cellRows = [];
		var root = null;

		function normalizeLine( text ) {
			var value = String( text || '' ).toUpperCase();
			if ( value.length < _cols ) {
				while ( value.length < _cols ) value += ' ';
			} else if ( value.length > _cols ) {
				value = value.substr( 0, _cols );
			}
			return value;
		}

		function clearPending() {
			for ( var i = 0; i < pendingTimeouts.length; i++ ) {
				clearTimeout( pendingTimeouts[ i ] );
			}
			pendingTimeouts = [];
		}

		function animateCell( rowIndex, colIndex, nextChar ) {
			var cellState = cellRows[ rowIndex ][ colIndex ];
			if ( cellState.value === nextChar ) return;

			var activeSegments = layout.charMap[ nextChar ] || [];
			var activeSet = {};
			for ( var a = 0; a < activeSegments.length; a++ ) {
				activeSet[ activeSegments[ a ] ] = true;
			}
			for ( var key in cellState.segmentMap ) {
				if ( Object.prototype.hasOwnProperty.call( cellState.segmentMap, key ) ) {
					cellState.segmentMap[ key ].classList.toggle( 'on', !!activeSet[ key ] );
				}
			}

			cellState.value = nextChar;
			cellState.cell.classList.remove( 'is-changing' );
			void cellState.cell.offsetWidth;
			cellState.cell.classList.add( 'is-changing' );

			if ( typeof _settings.onSegmentUpdate === 'function' ) {
				_settings.onSegmentUpdate( rowIndex, colIndex );
			}

			var timeoutId = setTimeout(function(){
				cellState.cell.classList.remove( 'is-changing' );
				pendingTimeouts = pendingTimeouts.filter(function(id){ return id !== timeoutId; });
			}, durationMs);

			pendingTimeouts.push( timeoutId );
		}

		function build() {
			clearPending();
			_ensureContainerModeClass( mode );
			_container.style.setProperty( '--ctr-cell-w', segmentWidth + 'px' );
			_container.style.setProperty( '--ctr-cell-h', segmentHeight + 'px' );
			_container.style.setProperty( '--ctr-mode-duration-ms', durationMs + 'ms' );
			_container.style.position = 'relative';
			_container.style.height = ( _rows * segmentHeight + ( _rows - 1 ) * rowGap + rowBottomBleed ) + 'px';

			root = document.createElement( 'div' );
			root.className = 'ctr-display-board ctr-mode-panaplex ctr-mode-' + mode;
			cellRows = [];
			lineState = [];

			for ( var r = 0; r < _rows; r++ ) {
				var rowEl = document.createElement( 'div' );
				rowEl.className = 'ctr-display-row';
				var cellRow = [];
				for ( var c = 0; c < _cols; c++ ) {
					var cell = document.createElement( 'div' );
					cell.className = 'ctr-display-cell';

					var digit = document.createElement( 'div' );
					digit.className = 'ctr-panaplex-digit ' + layout.className;
					var segmentMap = {};
					for ( var s = 0; s < layout.segmentNames.length; s++ ) {
						var segName = layout.segmentNames[ s ];
						var seg = document.createElement( 'span' );
						seg.className = 'ctr-panaplex-seg ctr-panaplex-seg-' + segName;
						digit.appendChild( seg );
						segmentMap[ segName ] = seg;
					}
					cell.appendChild( digit );
					rowEl.appendChild( cell );

					cellRow.push({
						cell: cell,
						segmentMap: segmentMap,
						value: ' '
					});
				}
				root.appendChild( rowEl );
				cellRows.push( cellRow );
				lineState.push( normalizeLine( '' ) );
			}

			_container.appendChild( root );
		}

		function setAllRowsDiff( lines, options ) {
			clearPending();
			lines = lines || [];
			options = options || {};
			var sequential = !!options.sequential;
			var rowDelayMs = typeof options.rowDelayMs === 'number' ? options.rowDelayMs : 1500;

			var changes = [];
			for ( var r = 0; r < _rows; r++ ) {
				var next = normalizeLine( lines[ r ] || '' );
				if ( lineState[ r ] !== next ) {
					changes.push({ row: r, value: next });
				}
			}

			function updateRow( item ) {
				var previous = lineState[ item.row ] || normalizeLine( '' );
				for ( var col = 0; col < _cols; col++ ) {
					var nextChar = item.value[ col ] || ' ';
					var prevChar = previous[ col ] || ' ';
					if ( nextChar !== prevChar ) {
						animateCell( item.row, col, nextChar );
					}
				}
				lineState[ item.row ] = item.value;
			}

			if ( sequential ) {
				for ( var i = 0; i < changes.length; i++ ) {
					(function(order, item){
						var timeoutId = setTimeout(function(){
							updateRow( item );
						}, order * rowDelayMs);
						pendingTimeouts.push( timeoutId );
					})(i, changes[i]);
				}
				return;
			}

			for ( var j = 0; j < changes.length; j++ ) {
				updateRow( changes[ j ] );
			}
		}

		function setAllRows( lines ) {
			lines = lines || [];
			var normalized = [];
			for ( var r = 0; r < _rows; r++ ) {
				normalized.push( normalizeLine( lines[ r ] || '' ) );
			}
			setAllRowsDiff( normalized, { sequential: false } );
		}

		function resize( rows, cols ) {
			_rows = rows || 1;
			_cols = cols || 1;
			if ( root && root.parentNode === _container ) {
				_container.removeChild( root );
			}
			build();
		}

		build();

		return {
			setAllRowsDiff: setAllRowsDiff,
			setAllRows: setAllRows,
			clearPendingUpdates: clearPending,
			resize: resize,
			getRows: function(){ return _rows; },
			getCols: function(){ return _cols; }
		};
	}

	function _createExternalRenderer( mode ) {
		var factory = _renderers[ mode ];
		if ( typeof factory !== 'function' ) return null;

		var board = factory( _cloneBaseSettings() );
		if ( !board || typeof board.setAllRowsDiff !== 'function' ) {
			throw new Error( 'Renderer for mode "' + mode + '" must return an object with setAllRowsDiff(lines, options).' );
		}
		return board;
	}

	function _createBoardForMode( mode ) {
		if ( mode === 'splitflap' ) {
			return _createSplitflapBoard();
		}
		if ( mode === 'nixie' ) {
			return _createBuiltInNixieRenderer();
		}
		if ( mode === 'panaplex7' || mode === 'panaplex14' ) {
			return _createBuiltInPanaplexRenderer( mode );
		}

		var external = _createExternalRenderer( mode );
		if ( external ) return external;

		if ( typeof console !== 'undefined' && console && typeof console.warn === 'function' ) {
			console.warn( 'Unknown board mode "' + mode + '", falling back to splitflap.' );
		}
		return _createSplitflapBoard();
	}

	function _setMode( mode ) {
		var nextMode = mode || 'splitflap';
		if ( _activeBoard && _mode === nextMode ) return;

		if ( _activeBoard && typeof _activeBoard.clearPendingUpdates === 'function' ) {
			_activeBoard.clearPendingUpdates();
		}

		_clearContainer();
		_mode = nextMode;
		_ensureContainerModeClass( _mode );
		_activeBoard = _createBoardForMode( _mode );
	}

	function _ensureContainerModeClass( mode ) {
		if ( !_container ) return;
		if ( _container.dataset ) {
			_container.dataset.mode = mode;
		}
		if ( !_container.classList ) return;
		_container.classList.remove( 'ctr-mode-splitflap' );
		_container.classList.remove( 'ctr-mode-nixie' );
		_container.classList.remove( 'ctr-mode-panaplex7' );
		_container.classList.remove( 'ctr-mode-panaplex14' );
		_container.classList.add( 'ctr-mode-' + mode );
	}

	function _setRowContent( rowIndex, text ) {
		if ( !_activeBoard ) return;
		if ( typeof _activeBoard.setRowContent === 'function' ) {
			_activeBoard.setRowContent( rowIndex, text );
			return;
		}

		var lines = [];
		for ( var i = 0; i < _rows; i++ ) lines.push( '' );
		lines[ rowIndex ] = text || '';
		_activeBoard.setAllRowsDiff( lines );
	}

	function _setAllRows( lines ) {
		if ( !_activeBoard ) return;
		if ( typeof _activeBoard.setAllRows === 'function' ) {
			_activeBoard.setAllRows( lines );
			return;
		}
		_activeBoard.setAllRowsDiff( lines );
	}

	function _setAllRowsDiff( lines, options ) {
		if ( !_activeBoard ) return;
		_activeBoard.setAllRowsDiff( lines, options );
	}

	function _resize( rows, cols ) {
		_rows = rows || 1;
		_cols = cols || 1;

		if ( _activeBoard && typeof _activeBoard.resize === 'function' ) {
			_activeBoard.resize( _rows, _cols );
			return;
		}

		_setMode( _mode );
	}

	function _clearPendingUpdates() {
		if ( _activeBoard && typeof _activeBoard.clearPendingUpdates === 'function' ) {
			_activeBoard.clearPendingUpdates();
		}
	}

	function _getRows() {
		if ( _activeBoard && typeof _activeBoard.getRows === 'function' ) {
			return _activeBoard.getRows();
		}
		return _rows;
	}

	function _getCols() {
		if ( _activeBoard && typeof _activeBoard.getCols === 'function' ) {
			return _activeBoard.getCols();
		}
		return _cols;
	}

	_setMode( _mode );

	return {
		setMode: _setMode,
		getMode: function() { return _mode; },
		setRowContent: _setRowContent,
		setAllRows: _setAllRows,
		setAllRowsDiff: _setAllRowsDiff,
		resize: _resize,
		clearPendingUpdates: _clearPendingUpdates,
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