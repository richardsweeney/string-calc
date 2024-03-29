$(document).bind('mobileinit', function () {

	$.extend($.mobile, {
		touchOverflowEnabled: true,
		defaultPageTransition: 'slide'
		//transitionFallbacks.flip: 'slide'
	});

});

$(document).bind('pagecreate', function () {

	// Find lists with only 1 item, for styling.
	$list = $('.iOSlist-container ul');
	if( $list.length ){
		$.each( $list, function(){
			var li = $(this).find('li');
			if( li.length === 1 ) {
				li.addClass('single-list-item');
			}
		});
	}

});

$( function(){

	Vals = {
		// DC's protypal inheritance function
		create: function( obj ){
			var F = function(){};
			F.prototype = obj;
			return new F();
		},
		// Octave offset - mulitpliers to determine correct frequency at whatever octave
		oct: [0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32, 64],
		// Mulitpy/divide values by 1.059463 to move one (equal) semitone higher/lower.
		semiTone: 1.059463,
		metricImperial: '',
		mmToInch: 0.0393700787,
		kgToLbs: 0.45359237,
		// Give default values for the select custom tone page
		customCalc: {
			note: 9,
			octave: 4
		},
		// Array of saved calculations - this will mirror localStorage.resultsList
		resultsList: [],
		calcHelper: {},
		customTunings: {
			tempTuning: {
				name: '',
				stringLength: '',
				tuning: []
			},
			editing: false,
			tempTuningArray: [],
			customTuning: {},
			customTuningsObject: {},
			tuningsArray: [],
			editTuningId: ''
		},
		instruments: {
			lists: {},
			current: {},
			quickie: {
				stringLength: 60,
				material: 'gut',
				pitch: 440,
				density: 1300,
				dataName: 'quickie',
				name: 'Quick Calculation'
			},
			custom: {},
			bowed: [
				{
					dataName: 'violin',
					name: 'Violin',
					stringLength: 33,
					multipleTunings: false,
					tuning: [ [5,5], [0,4], [7,4], [2,3] ]
				},
				{
					dataName: 'viola',
					name: 'Viola',
					stringLength: 36,
					multipleTunings: false,
					tuning: [ [0,4], [7,4], [2,3], [9,3] ]
				},
				{
					dataName: 'cello',
					name: 'Cello',
					stringLength: 68,
					multipleTunings: false,
					tuning: [ [0,3], [7,3], [2,2], [9,2] ]
				},
				{
					dataName: 'doubleBass',
					name: 'Double Bass',
					stringLength: 105,
					multipleTuings: false,
					tuning: [ [2,2], [7,2], [0,1], [5,1] ]
				},
				{
					dataName: 'violinoPiccolo',
					name: 'Violino Piccolo',
					stringLength: 30,
					multipleTunings: false,
					tuning: [ [2,5], [9,5], [4,4], [-1,3] ]
				},
				{
					dataName: 'violoncelloPiccolo',
					name: 'Violoncello Piccolo/da Spalla',
					stringLength: 65,
					multipleTunings: false,
					tuning: [ [5,4], [0,3], [7,3], [2,2], [9,2] ]
				},
				{
					dataName: 'bassViolin',
					name: 'Bass Violin',
					stringLength: 75,
					multipleTunings: false,
					tuning: [ [2,3], [9,3], [4,2], [-1,1] ]
				},
				{
					dataName: 'violaDamore',
					name: 'Viola d\'Amore',
					stringLength: 40,
					multipleTunings: true,
					tuningId: 0,
					tuning: [
						{
							name: 'D major',
							tuning: [ [7,5], [0,4], [3,4], [7,4], [0,3], [7,3], [0,2] ]
						},
						{
							name: 'D minor',
							tuning: [ [7,5], [0,4], [4,4], [7,4], [0,3], [7,3], [0,2] ]
						}
					]
				},
				{
					dataName: 'violaDaGamba',
					name: 'Viola da Gamba',
					stringLength: 69,
					multipleTunings: true,
					tuningId: 2,
					tuning: [
						{
							name: 'D (contrabasso)',
							tuning: [ [7,3], [0,2], [5,2], [9,2], [2,1], [7,1] ]
						},
						{
							name: 'G (violone)',
							tuning: [ [2,3], [7,3], [0,2], [4,2], [9,2], [2,1] ]
						},
						{
							name: 'D (bass)',
							tuning: [ [7,4], [0,3], [5,3], [9,3], [2,2], [7,2] ]
						},
						{
							name: 'G (tenor)',
							tuning: [ [2,4], [7,4], [0,3], [4,3], [9,3], [2,2] ]
						},
						{
							name: 'A (alto)',
							tuning: [ [0,4], [5,4], [-2,3], [2,3], [7,3], [0,2] ]
						},
						{
							name: 'D (treble)',
							tuning: [ [7,3], [0,4], [5,4], [9,4], [2,3], [7,3] ]
						},
						{
							name: '7 string in D',
							tuning: [ [7,4], [0,3], [5,3], [9,3], [2,2], [7,2], [0,1] ]
						}
					]
				}
			],
			plucked: [
				{
					dataName: 'renaissanceLute',
					name: 'Renaissance Lute',
					material: 'gut',
					pitch: 415,
					density: 1300,
					stringLength: 60,
					numberCourses: 10,
					octavesFromCourse: 6,
					showOctaves: true,
					multipleTunings: true,
					tuningId: 4,
					tuning: [
						{
							name: 'C (low bass)',
							tuning: [ [9,4], [2,3], [7,3], [-1,2], [4,2], [9,2], [-1,1], [0,1], [2,1], [4,1], [5,1], [7,1] ]
						},
						{
							name: 'D (bass)',
							tuning: [ [7,4], [0,3], [5,3], [9,3], [2,2], [7,2], [9,2], [-2,1], [0,1], [2,1], [4,1], [5,1] ]
						},
						{
							name: 'E',
							tuning: [ [5,4], [-2,3], [3,3], [7,3], [0,2], [5,2], [7,2], [9,2], [-2,1], [0,1], [2,1], [3,1] ]
						},
						{
							name: 'F',
							tuning: [ [4,4], [9,4], [2,3], [6,3], [-1,2], [4,2], [5,2], [7,2], [9,2], [-1,1], [0,1], [2,1] ]
						},
						{
							name: 'G (tenor)',
							tuning: [ [2,4], [7,4], [0,3], [4,3], [9,3], [2,2], [4,2], [5,2], [7,2], [9,2], [0,1], [-2,1] ]
						},
						{
							name: 'A (alto)',
							tuning: [ [0,4], [5,4], [-2,3], [2,3], [7,3], [0,2], [2,2], [4,2], [5,2], [7,2], [9,2], [-2,1] ]
						},
						{
							name: 'D (treble)',
							tuning: [ [7,3], [0,4], [5,4], [9,4], [2,3], [7,3], [9,3], [-2,2], [0,2], [2,2], [4,2], [5,2] ]
						},
						{
							name: 'G (octave lute)',
							tuning: [ [2,5], [7,5], [0,4], [4,4], [9,4], [2,3], [4,3], [5,3], [7,3], [9,3], [0,1], [-2,1] ]
						}
					]
				},
				{
					dataName: 'baroqueLute',
					name: 'Baroque Lute',
					material: 'gut',
					pitch: 415,
					density: 1300,
					stringLength: 71,
					diapasonLength: 96,
					numberCourses: 13,
					frettedCourses: 8,
					octavesFromCourse: 6,
					showOctaves: true,
					multipleTunings: false,
					tuning: [ [4,4], [7,4], [0,3], [4,3], [7,3], [0,2], [2,2], [4,2], [5,2], [7,2], [9,2], [-2,1], [0,1], [2,1] ]
				},
				{
					dataName: 'archlute',
					name: 'Archlute',
					material: 'gut',
					pitch: 415,
					density: 1300,
					stringLength: 67,
					diapasonLength: 150,
					numberCourses: 14,
					frettedCourses: 6,
					octavesFromCourse: 5,
					singleDiapasons: true,
					showOctaves: true,
					multipleTunings: false,
					tuning: [ [2,4], [7,4], [0,3], [4,3], [9,3], [2,2], [4,2], [5,2], [7,2], [9,2], [-2,1], [0,1], [2,1], [4,1] ]
				},
				{
					dataName: 'theorbo',
					name: 'Theorbo',
					material: 'gut',
					pitch: 415,
					density: 1300,
					stringLength: 90,
					diapasonLength: 160,
					numberCourses: 14,
					frettedCourses: 6,
					octavesFromCourse: 5,
					singleDiapasons: true,
					showOctaves: false,
					multipleTunings: true,
					tuningId: 0,
					tuning: [
						{
							name: 'A: re-entrant 1 + 2',
							tuning: [ [0,3], [5,3], [-2,3], [2,3], [7,3], [0,2], [2,2], [4,2], [5,2], [7,2], [9,2], [-2,1], [0,1], [2,1] ]
						},
						{
							name: 'A: re-entrant 1',
							tuning: [ [0,3], [5,4], [-2,3], [2,3], [7,3], [0,2], [2,2], [4,2], [5,2], [7,2], [9,2], [-2,1], [0,1], [2,1] ]
						},
						{
							name: 'G: re-entrant 1 + 2',
							tuning: [ [2,3], [7,3], [0,3], [4,3], [9,3], [2,2], [4,2], [5,2], [7,2], [9,2], [-2,1], [0,1], [2,1], [4,1] ]
						},
						{
							name: 'G: re-entrant 1',
							tuning: [ [2,3], [7,4], [0,3], [4,3], [9,3], [2,2], [4,2], [5,2], [7,2], [9,2], [-2,1], [0,1], [2,1], [4,1] ]
						},
						{
							name: 'D minor',
							tuning: [ [7,4], [0,3], [4,3], [7,3], [0,2], [2,2], [4,2], [5,2], [7,2], [9,2], [-2,1], [0,1], [2,1], [4,1] ]
						}
					]
				},
				{
					dataName: 'baroqueGuitar',
					name: 'Baroque Guitar',
					material: 'gut',
					pitch: 415,
					density: 1300,
					stringLength: 66,
					numberCourses: 5,
					octavesFromCourse: 4,
					showOctaves: true,
					multipleTunings: false,
					tuning: [ [5,4], [-2,3], [2,3], [7,4], [0,2] ]
				},
/*
				{
					dataName: 'classicalGuitar',
					name: 'Classical Guitar',
					material: 'nylon',
					pitch: 440,
					density: 1140,
					stringLength: 66,
					multipleTunings: false,
					tuning: [ [5,4], [-2,3], [2,3], [7,3], [0,2], [5,2] ]
				},
*/
				{
					dataName: 'mandolin',
					name: 'Mandolin',
					material: 'steel',
					pitch: 440,
					density: 7800,
					stringLength: 33,
					multipleTunings: false,
					tuning: [ [5,5], [0,4], [7,4], [2,3] ]
				},
				{
					dataName: 'ukulele',
					name: 'Ukulele',
					material: 'nylon',
					pitch: 440,
					density: 1140,
					stringLength: 33,
					multipleTunings: true,
					tuningId: 0,
					tuning: [
						{
							name: 'D tuning, re-entrant',
							tuning: [ [-2,4], [3,4], [7,4], [0,4] ]
						},
						{
							name: 'D tuning, low 4th',
							tuning: [ [-2,4], [3,4], [7,4], [0,3] ]
						},
						{
							name:  'C tuning, re-entrant',
							tuning: [ [0,4], [5,4], [9,4], [2,4] ]
						},
						{
							name: 'C tuning, low 4th',
							tuning: [ [0,4], [5,4], [9,4], [2,3] ]
						},
						{
							name: 'G tuning, re-entrant',
							tuning: [ [5,4], [-2,3], [2,3], [7,4] ]
						},
						{
							name: 'G tuning, low 4th',
							tuning: [ [5,4], [-2,3], [2,3], [7,3] ]
						}
					]
				},
				{
					dataName: 'oud',
					name: 'Oud',
					material: 'gut',
					pitch: 440,
					density: 1300,
					stringLength: 63,
					octavesFromCourse: 5,
					showOctaves: true,
					multipleTunings: true,
					tuningId: 0,
					tuning: [
						{
							name: 'C, G, D, A, E, C',
							tuning: [ [9,4], [2,3], [7,3], [0,2], [5,2], [9,2] ]
						},
						{
							name: 'C, G, D, A, F, C',
							tuning: [ [9,4], [2,3], [7,3], [0,2], [4,2], [9,2] ]
						},
						{
							name: 'C, G, D, A, G, D',
							tuning: [ [9,4], [2,3], [7,3], [0,2], [2,2], [7,2] ]
						},
						{
							name: 'C, G, D, A, F, D',
							tuning: [ [9,4], [2,3], [7,3], [0,2], [4,2], [7,2] ]
						},
						{
							name: 'D, A, E, B, G, D',
							tuning: [ [7,4], [0,3], [5,3], [-2,2], [2,2], [7,2] ]
						},
						{
							name: 'D, A, E, B, F#, D',
							tuning: [ [7,4], [0,3], [5,3], [-2,2], [3,2], [7,2] ]
						},
						{
							name: 'D, A, E, B, F#, C#',
							tuning: [ [7,4], [0,3], [5,3], [-2,2], [3,2], [8,2] ]
						},
						{
							name: 'D, A, E, B, F#, B',
							tuning: [ [7,4], [0,3], [5,3], [-2,2], [3,2], [-2,1] ]
						}
					]
				}
			]
		},
		materials: [
			{
				name: 'Nylon',
				dataName: 'nylon',
				density: 1140
			},
			{
				name: 'Nylgut',
				dataName: 'nylgut',
				density: 1260
			},
			{
				name: 'Gut / Silk',
				dataName: 'gut',
				density: 1300
			},
			{
				name: 'New Nylgut',
				dataName: 'newNylgut',
				density: 1300
			},
			{
				name: 'Carbon',
				dataName: 'carbon',
				density: 1790
			},
			{
				name: 'Steel',
				dataName: 'steel',
				density: 7800
			},
			{
				name: 'Iron',
				dataName: 'iron',
				density: 7870
			},
			{
				name: 'Bronze',
				dataName: 'bronze',
				density: 8600
			},
			{
				name: 'Copper',
				dataName: 'copper',
				density: 8900
			}
		],
		pitches: [ 392, 415, 430, 440, 466 ],
		longLutes: [ 'archlute', 'baroqueLute', 'theorbo' ],


	/**
		* Lists the instruments
		*
		* @param string category of instrument (bowed or plucked)
		* @return <ul> of instruments
		*/
		listInstruments: function( instrumentType ) {
			var instType = rico.instruments[instrumentType],
				instrumentBlob = '<ul id="instrumentList" data-role="listview" data-inset="true">';
			for( var i = 0, l = instType.length; i < l; i++ ){
				instrumentBlob +=	'<li><a class="choose-instrument" href="#options" data-id="' + i + '" data-instrument="' + instType[i].dataName + '">' + instType[i].name + '</a></li>';
			}
			instrumentBlob += '</ul>';
			return instrumentBlob;
		},

		// Custom Tones
		customTone: {
			accidental: 'natural',
			note: 'C',
			octave: 4,
			pitchOffset: 9
		},

		calculations: function( noteIndex, pitchOffset, octave, diapason ){
			var noteName;
			switch( pitchOffset ) {
				case 9: noteName = 'C';
					break;
				case 8: noteName = 'C#';
					break;
				case 7: noteName = 'D';
					break;
				case 6: noteName = 'Eb';
					break;
				case 5: noteName = 'E';
					break;
				case 4: noteName = 'F';
					break;
				case 3: noteName = 'F#';
					break;
				case 2: noteName = 'G';
					break;
				case 1: noteName = 'G#';
					break;
				case 0: noteName = 'A';
					break;
				case -1: noteName = 'Bb';
					break;
				case -2: noteName = 'B';
					break;
				default: 0;
			}
			var calcBlob = '<div data-role="collapsible" class="daddy" data-collapsed="true" data-pitchOffset="' + pitchOffset + '" data-octave="' + octave + '">'
				+ '<h3 class="calculations">' + noteIndex + ' - ' + noteName + octave + '</h3>'
				+	'<label class="dab" for="diameter">Enter the diameter or tension</label>'
					+	'<input class="diameterOrTension" type="number" data-key="diameterOrTension" id="diameter" />'
					+ '<fieldset class="ui-grid-a">'
						+ '<div class="ui-block-a">'
							+ '<button class="trigger calculateDiameter';
							if( diapason === true ) calcBlob += ' diapason';
							calcBlob += '" type="submit">Calculate Diameter</button>'
						+ '</div>'
						+ '<div class="ui-block-b">'
							+ '<button class="trigger calculateTension';
							if( diapason === true ) calcBlob += ' diapason';
							calcBlob += '" type="submit">Calculate Tension</button>'
						+ '</div>'
					+ '</fieldset>'
					+ '<p class="resultat off"></p>'
				+ '</div>'
			;
			return calcBlob;
		},

	/**
		* Capitalize the first letter of a string
		*
		* @param string
		* @return string
		*/
		capitalizeFirstLetter: function( string ){
	    return string.charAt(0).toUpperCase() + string.slice(1);
		},


	 /**
		* Disply each tuning as a radio input
		*
		* @param integer id of the tuning
		* @param string human name of the tuning
		* @param string name of the tuning without spaces, for easy comparison
		* @return HTML <input> + <label>
		*/
		// olikaTunings: function( id, tuningName, tuningDataName ){
		// 	return '<input class="tuning" id="' + id + '" type="radio" name="tuning" value="' + tuningDataName + '" /><label for="' + id + '">' + tuningName + '</label>';
		// },


	 /**
		* Calculate note name from pitch offset
		*
		* @param string the note from which to calculate the pitch offset
		* @return integer pitch-offset
		*/
		whichTone: function( note ) {
			var pitchOffset;
			switch ( note ) {
				case 'C': pitchOffset = 9;
					break;
				case 'D': pitchOffset = 7;
					break;
				case 'E': pitchOffset = 5;
				 	break;
			 	case 'F': pitchOffset = 4;
					break;
				case 'G': pitchOffset = 2;
					break;
				case 'A': pitchOffset = 0;
					break;
				case 'B':
				case 'H': pitchOffset = -2;
					break;
			}
			return pitchOffset;
		},

	 /**
		* Calculate pitch offset from note name
		*
		* @param integer the pitch offset from which to calculate the note name
		* @return string the name of the note
		*/
		whichNote: function( pitchOffset ){
			var noteName = '';
			switch( pitchOffset ) {
				case 9: noteName = 'C';
					break;
				case 8: noteName = 'C#';
					break;
				case 7: noteName = 'D';
					break;
				case 6: noteName = 'Eb';
					break;
				case 5: noteName = 'E';
					break;
				case 4: noteName = 'F';
					break;
				case 3: noteName = 'F#';
					break;
				case 2: noteName = 'G';
					break;
				case 1: noteName = 'G#';
					break;
				case 0: noteName = 'A';
					break;
				case -1: noteName = 'Bb';
					break;
				case -2: noteName = 'B';
					break;
				default: 0;
			}
			return noteName;
		},

	 /**
		* Display the list of options as a <ul> on the option page
		*
		* @return HTML list of options
		*/
		options: function(){
			var
				thisInstrument = this.instruments.current,
				sl = ( localStorage.metricImperial === 'metric' ) ? +thisInstrument.stringLength : Math.round( ( +thisInstrument.stringLength * this.mmToInch ) * 100 ) / 10,
				densityName = thisInstrument.material
			;
			if( thisInstrument.material === 'newNylgut' ){
				densityName = 'New Nylgut';
			} else if( thisInstrument.material === 'gut' ){
				densityName = 'Gut / Silk';
			} else {
				densityName = this.capitalizeFirstLetter( thisInstrument.material );
			}
			var optionsBlob = '<ul id="optionsList" data-role="false">'
			+ '<li><a data-transition="flip" href="#pitch"><span>Pitch:</span> ' + thisInstrument.pitch + ' Hz</a></li>'
			+ '<li><a data-transition="flip" href="#material"><span>String material:</span> ' + densityName + '</a></li>';
			if( thisInstrument.diapasonLength !== undefined ) {
				var	dl = ( localStorage.metricImperial === 'metric' ) ? +thisInstrument.diapasonLength : Math.round( ( +thisInstrument.diapasonLength * rico.mmToInch ) * 100 ) / 10;
				optionsBlob += '<li><a data-transition="flip" href="#string-length"><span>String lengths:</span> ' + sl + ' / ' + dl + ' ' + this.unitLength + '</a></li>';
			} else {
				optionsBlob += '<li><a data-transition="flip" href="#string-length"><span>String length:</span> ' + sl + ' ' + this.unitLength + '</a></li>';
			}
			if( thisInstrument.numberCourses !== undefined ) {
				optionsBlob += '<li><a data-transition="flip" href="#number-courses"><span>Number of courses:</span> ' + thisInstrument.numberCourses + '</a></li>';
			}
			if( thisInstrument.diapasonLength !== undefined ) {
				var fc = thisInstrument.frettedCourses;
				optionsBlob += '<li><a data-transition="flip" href="#number-fretted-courses"><span>Fretted courses:</span> ' + fc + '</a></li>';
			}
			if( thisInstrument.multipleTunings === true ){
				var
					tuningId = +thisInstrument.tuningId,
					thisTuning = thisInstrument.tuning[ tuningId ].name
				;
				optionsBlob += '<li><a data-transition="flip" href="#dynamic-tuning"><span>Tuning:</span> ' + thisTuning + '</a></li>';
			}


			/* Remove alternate diapason tuning for now */

			// if( thisInstrument.numberCourses !== undefined && thisInstrument.dataName !== 'baroqueGuitar' ) {
			// 	var
			// 		arr = ( thisInstrument.multipleTunings === true ) ? thisInstrument.tuning[ +thisInstrument.tuningId ].tuning : thisInstrument.tuning,
			// 		diapasonsArray = arr.slice( 6, thisInstrument.numberCourses ), // from the 7th course, downward
			// 		diapasonString = ''
			// 	;
			// 	for( var i = 0, l = diapasonsArray.length; i < l; i++ ) {
			// 		diapasonString += this.whichNote( diapasonsArray[i][0] );
			// 		if( i !== l - 1 ) {
			// 			diapasonString += ', ';
			// 		}
			// 	}
			// 	optionsBlob += '<li><a data-transition="flip" href="#diapason-tuning"><span>Diapasons:</span> ' + diapasonString + '</a></li>';
			// }

			if( thisInstrument.showOctaves !== undefined ) {
				if( thisInstrument.showOctaves === true ) {
					optionsBlob += '<li><a data-transition="flip" href="#octave-courses"><span>Show octaves from course:</span> ' + +thisInstrument.octavesFromCourse + '</a></li>';
				} else if( thisInstrument.showOctaves === false ) {
					optionsBlob += '<li><a data-transition="flip" href="#octave-courses"><span>Show octave courses:</span> no</a></li>';
				}
			}
			if( thisInstrument.singleDiapasons !== undefined ) {
				var singleDiapasons = ( thisInstrument.singleDiapasons === true ) ? 'yes' : 'doubles';
				optionsBlob += '<li><a data-transition="flip" href="#single-diapasons-page"><span>Single diapasons:</span> ' + singleDiapasons + '</a></li>';
			}
			optionsBlob += '</ul>';
			return optionsBlob;
		},

		/**
		 * Feedback for click on saved button.
		 */
		showSavedMessage: function(button) {
			var message = $('<span class="saved-message">Saved!</span>').insertBefore(button);
			setTimeout(function () {
				message.addClass('woot');
				setTimeout(function () {
					message.addClass('skoot');
					setTimeout(function () {
						message.remove();
					}, 250);
				}, 1500);
			}, 10);
		}

	}


 /**
 	* Create the rico object
 	*/
	var rico = Vals.create( Vals );

	// if( $(window).width() >= 768 ) {
	// 	alert("It looks as though you're accessing this site on a non-mobile device. stringCalc isn't really designed for large screens. Feel free to use it, if you so desire, but for best results try using an iPhone or Android phone.");
	// }

 /**
	* Local Storage shenannigans & 'caching'
	* Get & Set local storage metric settings
	* Custom Defaulst, Custom Tunings & Saved results
	*
	* Create instrument lists here too
	*/
	(function initDefaults(){
		rico.isLocalStorage = (function() {
      var uid = new Date,
      	result;
      try {
        localStorage.setItem(uid, uid);
        result = localStorage.getItem(uid) == uid;
        localStorage.removeItem(uid);
        return result;
      } catch(e) {}
    })();
    if( rico.isLocalStorage === true ) {
			rico.customTunings.tuningsArray = ( localStorage.customTunings !== undefined ) ? JSON.parse( localStorage.customTunings ) : [];
			rico.customDefaults = ( localStorage.customDefaults !== undefined ) ? JSON.parse( localStorage.customDefaults ) : [];
			rico.resultsList = ( localStorage.resultsList !== undefined ) ? JSON.parse( localStorage.resultsList ) : [];
			// Cache the instruments lists here, to speed things up
			rico.instruments.lists.bowed = rico.listInstruments('bowed');
			rico.instruments.lists.plucked = rico.listInstruments('plucked');
			if( $.isEmptyObject(rico.instruments.current) ) {
				if( localStorage.current !== undefined ) {
					rico.instruments.current = JSON.parse(localStorage.current);
				}
			}
		} else {
			alert("Local storage is not available on your device. You won't be able to save results and/or preferences. Go get yourself an iPhone and all your problems will be solved :)");
		}
		switch( localStorage.metricImperial ){
			case undefined:
				localStorage.metricImperial = 'metric';
				rico.metricImperial = 'metric';
				rico.unitDiameter = 'mm';
				rico.unitDensity = 'kg';
				rico.unitLength = 'cm';
			break;
			case 'metric':
				rico.metricImperial = 'metric';
				rico.unitDiameter = 'mm';
				rico.unitDensity = 'kg';
				rico.unitLength = 'cm';
			break;
			case 'imperial':
				rico.metricImperial = 'imperial';
				rico.unitDiameter = 'in';
				rico.unitDensity = 'lbs';
				rico.unitLength = 'in';
			break;
		}
	})();


 /**
  * Add the custom materials & densities to the page
  *
  * @param string name of the material
  * @param integer density of the material
  * @param string computer friendly name for the material
  * @return HTML blob
  */
	rico.addMaterialsToPage = function( material, density, dataName ) {
		var materialBlob = '<label for="' + dataName + '">' + material + ' (' + density + ' kg/m&sup3;)</label>';
		if( this.instruments.current.material === dataName ) {
			materialBlob += '<input class="density" id="' + dataName + '" name="density" data-key="density" type="radio" value="' + density + '" checked="checked" />';
		} else {
			materialBlob += '<input class="density" id="' + dataName + '" name="density" data-key="density" type="radio" value="' + density + '" />';
		}
		return materialBlob;
	}


 /**
	* Add the various pitches to the page
	*
	* @param integer pitch in Hz
	* @return HTML blob of pitches
	*/
	rico.addPitchesToPage = function( pitch ) {
		var pitchBlob = '<label for="pitch-' + pitch + '">' + pitch + ' Hz</label>';
		if( this.instruments.current.pitch == pitch ) {
			pitchBlob += '<input class="pitch" type="radio" name="pitch" data-key="pitch" id="pitch-' + pitch + '" value="' + pitch + '" checked="checked" />';
		} else {
			pitchBlob += '<input class="pitch" type="radio" name="pitch" data-key="pitch" id="pitch-' + pitch + '" value="' + pitch + '" />';
		}
		return pitchBlob;
	}


 /**
	* Add the various tunings to the tunings page.
	*
	* @return HTML blob of tunings
	*/
	rico.addTuningsToPage = function() {
		var
			theseTunings = this.instruments.current.tuning,
			tuningId = +this.instruments.current.tuningId,
			tuningsBlob = '<fieldset id="fieldContainer" class="quickChange" data-role="controlgroup">'
		;
		for( var i = 0, l = theseTunings.length; i < l; i++ ) {
			var
				tuningName = theseTunings[i].name,
				tuningDataName = theseTunings[i].dataName
			;
			tuningsBlob += ( i === tuningId ) ? '<input class="tuning" id="' + i + '" type="radio" name="tuning" value="' + tuningDataName + '" checked="checked" /><label for="' + i + '">' + tuningName + '</label>' : '<input class="tuning" id="' + i + '" type="radio" name="tuning" value="' + tuningDataName + '" /><label for="' + i + '">' + tuningName + '</label>';
		}
		tuningsBlob += '</fieldset>';
		return tuningsBlob;
	}


 /**
	* Add calculations to the calculations page.
	*
	* @return HTML blob of calculations
	*/
	rico.addCalcsToPage = function() {
		var
			currInst = this.instruments.current,
			whichTuning = ( currInst.multipleTunings === true ) ? currInst.tuning[ +currInst.tuningId ].tuning : currInst.tuning,
			tuningArray = whichTuning.slice( 0, currInst.numberCourses ),
			calcBlob = '<select name="select-string" id="select-string">'
		;
		if( currInst.frettedCourses !== undefined ) {
			var
				numFrettedCourses = currInst.frettedCourses,
				tuningArray = tuningArray.slice( 0, numFrettedCourses ),
				arr = ( currInst.multipleTunings === true ) ? currInst.tuning[ +currInst.tuningId ].tuning : currInst.tuning,
				diapasonsArray = arr.slice( numFrettedCourses, currInst.numberCourses )
			;
			calcBlob += '<optgroup label="Fretted Strings">';
			for( var i = 0, l = tuningArray.length; i < l; i++ ) {
				calcBlob += '<option value="' + i + '">' + ( i + 1 ) + ': ' + this.whichNote( tuningArray[i][0] ) + tuningArray[i][1] + '</option>';
			}
			calcBlob += '</optgroup><optgroup label="Diapasons">';
			for( var i = 0, l = diapasonsArray.length; i < l; i++ ) {
				calcBlob += '<option value="' + ( +currInst.frettedCourses + i ) + '">' + ( ( +currInst.frettedCourses + i ) + 1 ) + ': ' + this.whichNote( diapasonsArray[i][0] ) + diapasonsArray[i][1] + '</option>';
			}
			calcBlob += '</optgroup>';
		} else {
			for( var i = 0, l = tuningArray.length; i < l; i++ ) {
				calcBlob += '<option value="' + i + '">' + ( i + 1 ) + ': ' + this.whichNote( tuningArray[i][0] ) + tuningArray[i][1] + '</option>';
			}
		}
		calcBlob += '</select>';
		return calcBlob;
	}


 /**
	* Calculate the frequency of any pitch
	*
	* @param integer pitch offset from A
	* @param integer number of octaves from middle octave
	*
	* @return integer calculated frequency
	*/
	rico.calculateFrequency = function( pitchOffset, octaveOffset ) {
		return ( rico.instruments.current.pitch / Math.pow( this.semiTone, pitchOffset ) ) * octaveOffset;
	}


 /**
	* Add the select lists to the #instruments page
	*
	* @param array :
	*	[0] = class of container
	* [1] = number of items in list
	* [2] = id of select list
	* @param string the class of the select list
	* @return HTML select list(s)
	*/
	rico.createDiameterTensionSelectLists = function( selectArray, listClass ) {
		for( var i = 0, l = selectArray.length; i < l; i++ ){
			var sel = function() {
				var
					howMany = selectArray[i][1],
					selectBlob = '<select class="' + listClass + '" data-iconpos="none" id="' + selectArray[i][2] + '">'
				;
				for( var j = 0; j < howMany; j++ ){
					selectBlob += '<option value="' + j + '">' + j + '</option>';
				}
				selectBlob += '</select>';
				return selectBlob;
			}
			$( '#' + selectArray[i][0] ).append( sel ).trigger( 'create' );
		}
	}


 /**
	* Create a select list for all note values
	*
	* @param string id of the select list
	* @return HTML select list blob
	*/
	rico.createNoteSelectList = function( id ) {
		var
			noteBlob = '<div data-role="fieldcontain" class="rps"><select data-iconpos="none" class="custom-tone-select" name="select-string" id="' + id + '">',
			noteArray = [ 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B' ]
		;
		for( var i = 0, j = 9, l = noteArray.length; i < l; i++, j-- ){
			noteBlob += '<option value="' + j + '">' + noteArray[i] + '</option>';
		}
		noteBlob += '</select></div>';
		return noteBlob;
	}

 /**
	* Create a select list for the octave values
	*
	* @param string id of the select list
	* @return HTML select list blob
	*/
	rico.createOctaveSelectList = function( id ) {
		var
			octaveBlob = '<div data-role="fieldcontain" class="rps"><select data-iconpos="none" class="custom-tone-select" name="select-string" id="' + id + '">',
			octaveArray = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
		;
		for( var i = 0, l = octaveArray.length; i < l; i++ ){
			octaveBlob += '<option value="' + octaveArray[i] + '">' + octaveArray[i] + '</option>';
		}
		octaveBlob += '</select></div>';
		return octaveBlob;
	}


 /**
	* Calculate the tension / diameter of the string
	* Appends the results directly to the page
	*
	* @return null
	*/
	rico.doCalcs = function() {

		var currInst = this.instruments.current, // The current instrument
			stringLength = ( this.calcHelper.diapason === true ) ? currInst.diapasonLength : currInst.stringLength, // Whether it a diapason or a regular string
			tensDiam = this.calcHelper.tensDiam; // Are we calculating the tension or the diameter

		// Calculate the tension
		if ( this.tensionOrDiameter === 'tension' ) {

			// Set tension variable
			this.tension = tensDiam;

			// Imperial conversions
			var tension = ( this.metricImperial === 'imperial' ) ? tensDiam * this.kgToLbs : tensDiam;

			// Calculate the diameter of the string (BIG thanks to Arto Wikla for the formula)
			this.diameter = Math.sqrt( Math.pow( ( 10e+4 / this.frequency ), 2 ) * tension * 9.81 / Math.pow( stringLength, 2 ) / Math.PI / currInst.density );

			if( this.metricImperial === 'metric' ) {

				// Round up the diameter & fix decimal places
				this.diameter = ( Math.round( this.diameter * 100 ) / 100 ).toFixed( 2 );
				// Get octave diameter
				this.diameterOct = ( this.diameter / 2 ).toFixed( 2 );

			}	else if( this.metricImperial === 'imperial' ) {

				// Round up the diameter & fix decimal places
				this.diameter = ( Math.round( ( this.diameter * this.mmToInch ) * 1000 ) / 1000 ).toFixed( 3 );
				// Get octave diameter
				this.diameterOct = ( this.diameter / 2 ).toFixed( 3 );

			}

			// this.diameter = this.diameter.toLocaleString();
			// this.diameterOct = this.diameterOct.toLocaleString();
			// this.tension = this.tension.toLocaleString();

			var resultsText = '';

			// If we should show the octave results too
			if( this.calcHelper.showOctave === true && currInst.showOctaves === true ) {
				resultsText = this.tension + ' ' + this.unitDensity + ' = ' + this.diameter + '/' + this.diameterOct + ' ' + this.unitDiameter;
			} else {
				resultsText = this.tension + ' ' + this.unitDensity + ' = ' + this.diameter + ' ' + this.unitDiameter;
			}

		// If we should calculate the diameter
		} else if( this.tensionOrDiameter === 'diameter' ) {

			this.diameter = tensDiam;

			// Imperial conversion
			var diameter = ( this.metricImperial === 'imperial' ) ? tensDiam * this.mmToInch : tensDiam;

			// Calculate the tension of the string (HUGE thanks to Arto Wikla for the formula!)
			this.tension = Math.pow( ( this.frequency * ( stringLength * 10 ) * diameter ), 2 ) * ( Math.PI * currInst.density / 981e+10 );

			// Correct results for decimal points & metric/imperial
			if( this.metricImperial === 'metric' ) {
				this.tension = ( Math.round( ( this.tension ) * 100 ) / 100 );

			} else if( this.metricImperial === 'imperial' ) {

			 	this.tension = ( Math.round( ( this.tension * this.kgToLbs ) * 1000 ) / 1000 );
				this.diameter = this.diameter.toFixed( 3 );
			}

			// this.diameter = this.diameter.toLocaleString();
			// this.tension = this.tension.toLocaleString();

			// Append results to the DOM
			resultsText = this.diameter + ' ' + this.unitDiameter + ' = ' + this.tension + ' ' + this.unitDensity;

		}

		$('#calc-results').text(resultsText).addClass('pretty-bg').css({ 'margin-top': '15px' });

	}


 /**
  * Loop through custom tunings.
  *
  * @return HTML <ul> blob of tunings
  */
	rico.addCustomTuningsToPage = function() {
		var
			tuningsArray = rico.customTunings.tuningsArray,
			cTblob = '<ul id="customInstrumentList" data-role="none">',
			container = $('<div class="edit-ct-container" data-role="collapsible-set" />')
		;
		if( tuningsArray.length ) {
			for( var i = 0, l = tuningsArray.length; i < l; i++ ){
				cTblob += '<li><a class="customTuning" href="#" data-id="' + i + '" data-instrument="' + tuningsArray[i].name + '">' + tuningsArray[i].name + '</a></li>';
			}
			cTblob += '</ul>';
			return cTblob;
		}
	}



 /**
 	* Add list of results to results page
 	*
 	* @return HTML blob of results
 	*/
	rico.listResults = function() {
		var resultsBlob,
			len = rico.resultsList.length;
		if( len ) {
			resultsBlob = '<ul id="results-list" data-role="none">';
			var liClass = (len === 1) ? ' class="single-list-item"' : '';
			for( var i = 0; i < len; i++ ){
				resultsBlob += '<li' + liClass + '><a href="#" data-id="' + i + '">' + rico.resultsList[i].name + ': ' + rico.resultsList[i].stringLength + ' ' + rico.unitLength + ', ' + rico.resultsList[i].pitch + ' Hz</a></li>';
			}
			resultsBlob += '</ul>';
		} else {
			resultsBlob = '<p>There are currently no saved results</p>';
		}
		return resultsBlob;
	}


 /**
 	* Add results to single results page
 	*
 	* @return HTML blob of results
 	*/
	rico.listSingleResults = function() {
		var theseResults = rico.resultsList[this.theseResultsId],
			materialName = '';
		for( var i = 0, l = rico.materials.length; i < l; i++ ) {
			if( rico.materials[i].dataName === theseResults.material ) {
				materialName = rico.materials[i].name + ', ';
			}
		}

		var theseResultsBlob = '<h3 class="header">' + materialName + theseResults.stringLength + ' ' + rico.unitLength + ', ' + theseResults.pitch + ' Hz</h3>'
			+ '<table id="	"><thead><tr><th scope="col">string</th><th>tension</th><th>diameter</th></tr></thead><tbody>';
		;
		for( var i = 0, l = theseResults.results.length; i < l; i++ ){
			console.log(theseResults.results[i]);
		  theseResultsBlob += '<tr><td>' + theseResults.results[i].string + '</td><td>' + theseResults.results[i].tension + ' ' + rico.unitDensity + '</td><td>' + theseResults.results[i].diameter + ' ' + rico.unitDiameter + '</td></tr>';
		}
		theseResultsBlob += '</tbody></table>';
		return theseResultsBlob;
	}




	/**************** Now all the different pages stuff ***************/

 /**
  * Give links an active class when clicked
  */
	$('.iOSlist-container ul a').live('vclick', function (){
		$(this).addClass('active-link');
	});


 /**
  * Remove active class on page hide
  */
	$(document).bind('pagehide', function () {
		$( '.iOSlist-container li a' ).removeClass('active-link');
	});


 /**
 	* Index Page
 	*/
	$('#index').bind('pagecreate', function indexPageCreate(){
		$('.instrument-type').bind( 'vclick', function(){
			rico.instrumentType = $(this).attr('data-instrument-type');
			if( $(this).hasClass('quickie') ) {
				rico.instruments.current = rico.instruments.quickie;
			}
		});
	});


 /**
 	* List of instruments
 	*/
	$('#instrument-lists-page')
		.bind('pagebeforeshow', function instrumentListsPageBeforeShow(){
			/* var list = rico.listInstruments( rico.instrumentType ); */
			$('#instrument-list-container').append( rico.instruments.lists[ rico.instrumentType ] );
		})
		.bind('pageinit', function instrumentListsPageInit(){
			$('.choose-instrument').live('vclick', function(){
				var
					instrumentId = +$(this).attr('data-id'),
					match = false;
				rico.instruments.current = rico.instruments[ rico.instrumentType ][ instrumentId ];
	  		if( rico.isLocalStorage === true ) {
					localStorage.current = JSON.stringify( rico.instruments.current );
				}
				for( var i = 0, l = rico.customDefaults.length; i < l; i++ ){
					if( rico.customDefaults[ i ].dataName === rico.instruments[ rico.instrumentType ][ instrumentId ].dataName ) {
						match = true;
						var thisId = i;
					}
				}
				if( match === true ) {
					rico.instruments.current = rico.customDefaults[ thisId ];
				} else {
					if( rico.instrumentType === 'bowed' ) {
						rico.instruments.current.material = 'gut';
						rico.instruments.current.pitch = 415;
						rico.instruments.current.density = 1300;
					}
				}
			});
		})
		.bind('pagehide', function instrumentListsPageHide(){
			$('#instrument-list-container').empty();
		})
	;



 /**
 	* Saved Results Page
 	*/
	$('#saved-results-page')
		.bind('pagebeforeshow', function savedResultsPageBeforeShow(){
			var myResults = rico.listResults();
			$('#saved-results-container').append( myResults ).trigger('create');
		})
		.bind('pageinit', function savedResultsPageInit(){
			$('#results-list li a').live('vclick', function(){
				rico.theseResultsId = +$(this).attr('data-id');
				$.mobile.changePage( $('#individual-results-page') );
				return false;
			});
		})
		.bind('pagehide', function savedResultsPageHide(){
			$('#saved-results-container').empty();
		})
	;


 /**
 	* Individual Results Page
 	*/
	$('#individual-results-page')
		.bind('pagebeforeshow', function individualResultsPageBeforeShow(){
			var singleResults = rico.listSingleResults();
			$('h1.page-header').text(rico.resultsList[rico.theseResultsId]['name']);
			$('#individual-results-container').append( singleResults ).trigger('create');
		})
		.bind('pageinit', function individualResultsPageInit(){
			$('#delete-these-results').bind('vclick', function(){
				rico.resultsList.splice( rico.theseResultsId, 1 );
	  		localStorage.resultsList = JSON.stringify( rico.resultsList );
				$.mobile.changePage( $('#saved-results-page'), {
					reverse: true
				});
			});
		})
		.bind('pagehide', function individualResultsPageHide(){
			$('#individual-results-container').empty();
		})
	;


 /**
 	* Options Page
 	*/
	$('#options')
		.bind('pagebeforeshow',function OptionsPageBeforeShow(){
			var optionsBlob = rico.options(),
				okButton = '<a class="button" id="whereTo" href="#calculations-page">Go</a>',
				optionsWrap = $('<div id="optionsWrap" />');
			$('#optionsContent').append( optionsWrap );
			$('h1#options-title').text( rico.instruments.current.name );
			if( rico.instruments.current.dataName === 'quickie' ) {
				okButton = '<a class="button" id="whereTo" href="#custom-note">Go</a>';
				$('#options-page-back-link').attr('href', '#index');
				$('#optionsWrap').prepend( optionsBlob ).append( okButton ).trigger('create');
			} else if( rico.instruments.current.dataName === 'customTuning' ) {
				$('#options-page-back-link').attr('href', '#custom-tunings-page').trigger('create');
				okButton =
					'<fieldset class="ui-grid-a custom-tuning-funk">'
						+ '<div class="ui-block-a"><a id="edit-this-custom-tuning" class="button" href="#">Edit</a></div>'
						+ '<div class="ui-block-b"><a href="#calculations-page" class="button">Go</a></div>'
					+ '</fieldset>'
				;
				$('#optionsWrap').prepend( optionsBlob ).append( okButton ).trigger('create');
			} else {
				$('#options-page-back-link').attr('href', '#instrument-lists-page').trigger('create');
				var saveInstrument = '<input type="checkbox" name="remember-settings" id="remember-settings" /><label for="remember-settings">Remember these settings</label>';
				$('#optionsWrap').prepend( optionsBlob ).append( saveInstrument, okButton ).trigger('create');
			}
		})
		.bind('pageinit', function OptionsPageInit(){
			$('#edit-this-custom-tuning').live('vclick', function(e){
				e.preventDefault();
				rico.customTunings.editing = true;
				$.mobile.changePage( $('#create-custom-tuning-page') );
			});
			$('#options-page-back-link, #home-link, #whereTo').live('vclick', function(){
				if( $('#remember-settings').attr('checked') == 'checked' ) {
					rico.replaceDefault = rico.instruments.current;
					if( rico.customDefaults.length === 0 ) {
						rico.customDefaults.push( rico.replaceDefault );
					} else {
						var notHere = true;
						for( var i = 0, l = rico.customDefaults.length; i < l; i++ ){
							if( rico.customDefaults[i].dataName === rico.replaceDefault.dataName ){
						 		var hereInArray = i;
						 		notHere = false;
							}
						}
						if( notHere === true ) {
							rico.customDefaults.push( rico.replaceDefault );
						} else {
							rico.customDefaults[hereInArray] = rico.replaceDefault;
						}
	  				if( rico.isLocalStorage === true ) {
							localStorage.customDefaults = JSON.stringify( rico.customDefaults );
						} else {
							alert("Seems like storage is not available on your device. I'm afraid I won't be able to save your prefrences.");
						}
					}
				}
			});
		})
		.bind('pagehide',function OptionsPageHide(){
			$('.custom-tuning-funk, #optionsWrap').remove();
		})
	;


 /**
 	* Settings Page ( imperial / metric )
 	*/
	// $('#settings')
	// 	.bind( 'pagebeforeshow', function refreshMetricImperialRadio() {
	// 		if( localStorage.metricImperial === 'metric' ) {
	// 			$( 'input.metric' ).eq( 0 ).attr( 'checked', 'checked' ).checkboxradio( 'refresh' );
	// 		} else {
	// 			$( 'input.metric' ).eq( 1 ).attr( 'checked', 'checked' ).checkboxradio( 'refresh' );
	// 		}
	// 	}).bind('pageinit', function(){
	// 		$( 'input.metric' ).bind( 'change', function getMetricOrImperialVals(){
	// 			localStorage.metricImperial = $(this).val();
	// 			if(localStorage.metricImperial === 'metric' ) {
	// 				rico.unitDiameter = 'mm';
	// 				rico.unitDensity = 'kg';
	// 				rico.unitLength = 'cm';
	// 			} else if ( localStorage.metricImperial === 'imperial' ) {
	// 				rico.unitDiameter = 'in';
	// 				rico.unitDensity = 'lbs';
	// 				rico.unitLength = 'in';
	// 			}
	// 			rico.metricImperial = localStorage.metricImperial;
	// 			$.mobile.changePage( $('#index'), {
	// 				reverse: true
	// 			});
	// 			console.log( rico.unitDiameter, rico.unitDensity );
	// 		});
	// 	})
	// ;



 /**
 	* Pitch Page
 	*/
	$('#pitch')
		.bind('pagebeforeshow', function PitchPageBeforeShow(){
			var
				pitches = rico.pitches,
				fieldset = $('<fieldset class="quickChange" data-role="controlgroup" />');
			for( var i = 0, l = pitches.length; i < l; i++ ) {
				var pitchBlob = rico.addPitchesToPage( pitches[i] );
				fieldset.append( pitchBlob );
			}
			$('#pitch-container').append( fieldset ).trigger('create');
		})
		.bind('pageinit', function PitchPageInit(){
			$('.pitch').live('change', function(e){
				rico.instruments.current.pitch = +$(this).val();
				$('#customPitch').val('');
				setTimeout(function () {
					$.mobile.changePage( $('#options'), {
						transition: 'flip',
						reverse: true
					});
				}, 250);
			});
			$('#customPitch').bind('change', function(){
				rico.instruments.current.pitch = +$(this).val();
			});
		})
		.bind('pagehide', function PitchPageHide(){
			$('#pitch-container').empty();
		})
	;



 /**
 	* Materials Page
 	*/
	$('#material')
		.bind('pagebeforeshow', function materialsPageBeforeShow(){
			var
				materials = rico.materials,
				fieldset = $('<fieldset class="quickChange" data-role="controlgroup" />');
			for( var i = 0, l = materials.length; i < l; i++ ) {
				var
					material = materials[i].name,
					density = materials[i].density,
					dataName = materials[i].dataName
					materialBlob = rico.addMaterialsToPage( material, density, dataName );
				fieldset.append( materialBlob )
			}
			$('#material-container').append( fieldset ).trigger('create');
		})
		.bind('pageinit', function materialsPageInit(){
			$('.density').live('change', function(e){
				$('#customDensity').val('');
				rico.instruments.current.material = $(this).attr('id');
				rico.instruments.current.density = +$(this).val();
				setTimeout(function () {
					$.mobile.changePage( $('#options'), {
						transition: 'flip',
						reverse: true
					});
				}, 250);
			});
			$('#customDensity').bind('change', function(){
				rico.instruments.current.material = 'Custom density';
				rico.instruments.current.density = +$(this).val();
			});
		})
		.bind('pagehide', function materialsPageHide(){
			$('#material-container').empty();
		})
	;



 /**
 	* Stringlength Page
 	*/
	$('#string-length')
		.bind('pagebeforeshow', function StringLengthPageBeforeShow(){
			var
				currInst = rico.instruments.current,
				sl = ( localStorage.metricImperial === 'metric' ) ? currInst.stringLength : Math.round( ( currInst.stringLength * rico.mmToInch ) * 100 ) / 10,
				stringLength = '<div data-role="fieldcontain" id="string-length-div">'
					+ '<label class="whatUnit" for="string-length-input">Enter a string length in ' + rico.unitLength + '.*</label>'
					+ '<input type="number" id="string-length-input" value="' + sl + '" />'
				+ '</div>';
			$('#string-length-container').prepend( stringLength ).trigger('create');
			if( currInst.diapasonLength !== undefined ) {
				var
					dl = ( localStorage.metricImperial === 'metric' ) ? +currInst.diapasonLength : Math.round( ( +currInst.diapasonLength * rico.mmToInch ) * 100 ) / 10,
					diapasonLength = '<div class="archTuning">'
						+ '<label class="whatUnit" for="diapasonLength">Enter a diapason length in ' + rico.unitLength + '.</label>'
						+ '<input type="number" id="diapasonLength" data-key="diapasonLength" value="' + dl + '" />'
					+ '</div>';
				$('#string-length-div').append( diapasonLength ).trigger('create');
			}
		})
		.bind('pageinit', function StringLengthPageInit(){
			$('#string-length-input').live('change', function(){
				rico.instruments.current.stringLength = +$(this).val();
			});
			if( rico.instruments.current.diapasonLength !== undefined ) {
				$('#diapasonLength').live('change', function(){
					rico.instruments.current.diapasonLength = +$(this).val();
				});
			}
		})
		.bind('pagehide', function StringLengthPageHide(){
			$('#string-length-container').empty();
		})
	;



 /**
 	* Number of courses page
 	*/
	$('#number-courses')
		.bind('pagebeforeshow', function numberCoursesPageBeforeShow(){
			var
				currInst = rico.instruments.current,
				min = 10,
				max = 14;
			switch( currInst.dataName ) {
				case 'baroqueGuitar':
					min = 4, max = 6;
				break;
				case 'renaissanceLute':
					min = 6, max = 12;
				break;
			}
			$('#num-courses').attr('min', min).attr('max', max).val( currInst.numberCourses ).slider('refresh');
		})
		.bind('pageinit', function numberCoursesPageInit(){
			$('#num-courses').bind('change', function(){
				rico.instruments.current.numberCourses = +$(this).val();
				if( rico.instruments.current.frettedCourses > rico.instruments.current.numberCourses ) {
					rico.instruments.current.frettedCourses = rico.instruments.current.numberCourses;
				}
			});
		})
	;



	// Number of fretted courses
	$('#number-fretted-courses')
		.bind('pagebeforeshow', function(){
			var
				currInst = rico.instruments.current,
				nfc = +currInst.frettedCourses,
				min = 6,
				max = currInst.tuning.length;
			if( currInst.dataName === 'renaissanceLute' ) {
				max = 10;
			} else if( currInst.dataName === 'theorbo' ){
				max = 8;
			}
			max = ( currInst.numberCourses < max ) ? currInst.numberCourses : max;
			$('#frettedCourses').val( nfc ).attr( 'min', min ).attr( 'max', max ).slider('refresh');
		})
		.bind('pageinit', function(){
			$('#frettedCourses').live('change', function(){
				rico.instruments.current.frettedCourses = +$(this).val();
			})
		;
	});



	// From which course (if any) to show octave stringing
	$('#octave-courses')
		.bind('pagebeforeshow', function(){
			var
				ofc = +rico.instruments.current.octavesFromCourse,
				max = rico.instruments.current.tuning.length,
				min = 4
			;
			switch( rico.instruments.current.dataName ){
				case 'renaissanceLute':
				case 'archlute':
					max = 7;
				break;
				case 'theorbo':
					min = 5, max = 7;
				break;
				case 'oud':
					max = 6;
				break;
				case 'baroqueGuitar':
					min = 3;
				break;
			}
			$('#octaveCourses').attr('min', min).attr('max', max).val( ofc ).slider('refresh');
			if( rico.instruments.current.showOctaves === true ) {
				$('#no-octaves').attr('checked', false);
				$('#yes-octaves').attr('checked', true);
			} else if( rico.instruments.current.showOctaves === false ) {
				$('#yes-octaves').attr('checked', false);
				$('#no-octaves').attr('checked', true);
				$('#octaveCourses').slider('disable');
			}
			$('.yes-no-octaves').checkboxradio('refresh')
		})
		.bind('pageinit', function(){
			$('#octaveCourses').live('change', function(){
				rico.instruments.current.octavesFromCourse = +$(this).val();
			});
			$('.yes-no-octaves').live('change', function(){
				var detta = $(this);
				if( detta.attr('id') === 'no-octaves' ) {
					$('#octaveCourses').slider('disable');
				} else {
					$('#octaveCourses').slider('enable');
				}
				if( detta.val() === 'yes' ){
					rico.instruments.current.showOctaves = true;
				} else if( detta.val() === 'no' ){
					rico.instruments.current.showOctaves = false;
				}
			});
		})
	;



	// How does sir with to tune his diapasons today?
	$('#diapason-tuning')

		.bind('pagebeforeshow', function(){

			rico.editingThisString = '';
			rico.thisStringNoteOctave = [];

			if( !$('#diapason-tuning-select-note').length ) {

				var noteBlob = rico.createNoteSelectList('diapason-tuning-select-note'),
					octaveBlob = rico.createOctaveSelectList('diapason-tuning-select-octave');

				$('#diapason-tuning-note-container').append( noteBlob ).trigger('create');
				$('#diapason-tuning-octave-container').append( octaveBlob ).trigger('create');

				var noteSel = $('#diapason-tuning-select-note');
				noteSel[0].selectedIndex = 9;

				var octSel = $('#diapason-tuning-select-octave');
				octSel[0].selectedIndex = 2;

				noteSel.add( octSel ).selectmenu('refresh');

			}

			$('#diapason-show-hide').hide();

			// Append the list of diapasons to the DOM
			var container = $('#diapason-tuning-container'),
				table = '<table id="diapason-tuning-list"><thead><tr><th>Course</th><th>Note</th><th>Action</th></tr></thead><tbody>';
				thisInstrument = rico.instruments.current,
				arr = ( thisInstrument.multipleTunings === true ) ? thisInstrument.tuning[ +thisInstrument.tuningId ].tuning : thisInstrument.tuning,
				diapasonsArray = arr.slice( 6, thisInstrument.numberCourses ), // from the 6th course, downward
				li = '',
				i = 0,
				l = diapasonsArray.length;

			for( ; i < l; i++ ) {

				var note = diapasonsArray[i][0],
					octave = diapasonsArray[i][1];

				table += '<tr data-list-number="' + ( i + 1 ) + '" data-note="' + note + '" data-octave="' + octave + '"><td class="number">' + ( i + 7 ) + '.</td><td class="change-this"><span class="note-name">' + rico.whichNote( note ) + octave + '</span></td><td><a class="editLi" href="#">change</a></td></tr>';

			}
			table += '</tbody></table>';

			container.append( table ).trigger( 'create' );

		})

		.bind('pageinit', function(){

			// Edit a diapason
			$('#diapason-tuning-list a').live('vclick', function(){

					// If we're already editing a string - change that stuff back
				if( rico.editingThisString != '' && rico.thisStringNoteOctave.length > 0 ) {

					var oldNote = rico.thisStringNoteOctave[0],
						oldOctave = rico.thisStringNoteOctave[1],
						tr = $( '#diapason-tuning-list tr' ).eq( rico.editingThisString - 1 );

					tr.find( 'span.note-name' ).html( rico.whichNote( oldNote ) + oldOctave );

					$( '#diapason-tuning-list' ).trigger( 'create' );

				}

				rico.thisStringNoteOctave = [];

				var thisTr = $(this).closest( 'tr' ),
					note = +thisTr.attr('data-note'),
					octave = +thisTr.attr('data-octave');

				rico.thisStringNoteOctave.push( note, octave );
				rico.editingThisString = +thisTr.attr('data-list-number');

/*
				var
					note = $(this).parent().parent().attr('data-note')
					octave = $(this).parent().parent().attr('data-octave')
					noteSel = $('#diapason-tuning-select-note')
					octSel = $('#diapason-tuning-select-octave')
				;
				console.log( note, octave );
				noteSel[0].selectedIndex = note;
				octSel[0].selectedIndex = octave;
				noteSel.add( octSel ).selectmenu('refresh');
*/
				$( '#diapason-show-hide' ).show();

				$(this).parent().html('select a note above');

			});

			$('#edit-diapason').live('vclick', function(){

				var note = +$('#diapason-tuning-select-note').val(),
					octave = +$('#diapason-tuning-select-octave').val(),
					tr = $('#diapason-tuning-list tr').eq( rico.editingThisString )
					tuningArray = ( rico.instruments.current.multipleTunings === true ) ? rico.instruments.current.tuning[ +rico.instruments.current.tuningId ].tuning : rico.instruments.current.tuning,
					where = rico.editingThisString + 6,
					arr = [];

				arr.push( note, octave );
				tuningArray.splice( where, 1, arr );

				tr.find('span.note-name').html( rico.whichNote( note ) + octave ).trigger('create');
				rico.editingThisString = '';
				rico.thisStringNoteOctave	= [];



			});

		})

		.bind('pagehide', function(){

			$('#diapason-tuning-note-container', '#diapason-tuning-octave-container').empty();
			$('#diapason-tuning-list').remove();

		});




	// Single or double diapasons
	$('#single-diapasons-page').bind('pageinit', function(){
		$('.single-double-diapasons').live('change', function(){
			var disVal = $(this).val();
			if( disVal === 'single' ) {
				rico.instruments.current.singleDiapasons = true;
			} else if( disVal === 'double' ) {
				rico.instruments.current.singleDiapasons = false;
			}
			$.mobile.changePage( $('#options'), {
				transition: 'flip',
				reverse: true
			});
		});
	});



	// Alternate tunings
	$('#dynamic-tuning')
		.bind('pagebeforeshow', function(){
			var tunings = rico.addTuningsToPage(),
				fieldsetContainer = $('<div data-role="fieldcontain" />');
			$('#tunings-container').prepend( fieldsetContainer );
			fieldsetContainer.append( tunings ).trigger('create');
		})
		.bind('pageinit', function(){
			$('.quickChange input').live('change', function(){
				rico.instruments.current.tuningId = +$(this).attr('id');
				$.mobile.changePage( $('#options'), {
					transition: 'flip',
					reverse: true
				});
			});
		})
		.bind('pagehide', function(){
	  	$('#fieldContainer').remove();
		})
	;



	// Calculations page
	$('#calculations-page').bind('pagebeforeshow', function calculactionsPageBeforeShow() {

		$('#tension-diameter-input').val('');

		var calcBlob = rico.addCalcsToPage(),
			container = $('<div id="container" />');

		// Create helper object to get around jQuery mobile's caching stuff.
		rico.calcHelper = {
			diapason: false,
			showOctave: false,
			disTuningArray: ( rico.instruments.current.multipleTunings === true ) ? rico.instruments.current.tuning[+rico.instruments.current.tuningId].tuning[0] : rico.instruments.current.tuning[0],
			tensDiam: '',
			currentString: 0
		};

		rico.calcHelper.octaveOffset = rico.oct[ rico.calcHelper.disTuningArray[1] ];
  	rico.frequency = rico.calculateFrequency( rico.calcHelper.disTuningArray[0], rico.calcHelper.octaveOffset );
  	rico.tensionOrDiameter = 'tension';

		$('#selectBox').prepend( container );

		container.append( calcBlob ).trigger('create');

		$('#diameter-container').hide();
  	$('h1#instrument-name').text( rico.instruments.current.name );
		$('#tension-diameter-span').text( rico.unitDensity );
  	$('.tension-diameter').filter(':first').attr('checked', true).checkboxradio('refresh');
  	$('#radio-choice-2').attr('checked', false).checkboxradio('refresh');

	}).bind('pageinit', function calculactionsPageInit() {

		$('#tension-diameter-input').bind('change', function getTensionDiameterInput() {
			rico.calcHelper.tensDiam = +$(this).val();
			rico.doCalcs();
		});

		$('#calc-button').click( function () {
			rico.doCalcs();
		});

  	$('.tension-diameter').bind('change', function() {

			rico.tensionOrDiameter = $(this).val();
			$('#tension-diameter-input').val('');

			if( rico.tensionOrDiameter === 'diameter' ) {
				rico.calcHelper.tensDiam = rico.diameter;
				$('#tension-diameter-span').text('mm');
			} else if( rico.tensionOrDiameter === 'tension' ) {
				rico.calcHelper.tensDiam = rico.tension;
				$('#tension-diameter-span').text('kg');
			}

  	});

		$('#select-string').live('change', function selectString() {

  		rico.calcHelper.currentString = +$(this).val();

  		if( rico.instruments.current.frettedCourses === undefined ) {
  			rico.calcHelper.diapason = false;
  		} else {
  			if( rico.calcHelper.currentString >= +rico.instruments.current.frettedCourses ){
  				rico.calcHelper.diapason = true;
  			}	else {
  				rico.calcHelper.diapason = false;
  			}
  		}

			if( rico.instruments.current.octavesFromCourse === undefined ) {
				rico.calcHelper.showOctave = false;
			} else {
				if( rico.calcHelper.currentString >= ( +rico.instruments.current.octavesFromCourse - 1 ) ) {
					if( $.inArray( rico.instruments.current.dataName, [ 'theorbo', 'archlute' ] ) >= 0 && rico.calcHelper.diapason === true ) {
						rico.calcHelper.showOctave = ( rico.instruments.current.singleDiapasons === true ) ? false : true;
					} else {
						rico.calcHelper.showOctave = true;
					}
				} else {
					rico.calcHelper.showOctave = false;
				}
			}

  		rico.calcHelper.disTuningArray = ( rico.instruments.current.multipleTunings === true ) ? rico.instruments.current.tuning[+rico.instruments.current.tuningId].tuning[rico.calcHelper.currentString] : rico.instruments.current.tuning[rico.calcHelper.currentString];
			rico.calcHelper.octaveOffset = rico.oct[ rico.calcHelper.disTuningArray[1] ];
  		rico.frequency = rico.calculateFrequency( rico.calcHelper.disTuningArray[0], rico.calcHelper.octaveOffset );

  		if( rico.calcHelper.tensDiam !== '' ) {
  			rico.doCalcs();
			}

	  });

	  $('#save-this-calculation').bind('click', function saveThisCalculation() {

	  	if( $('#tension-diameter-input').val() != '' ) {

		  	var saveResultsButton = '<a id="save-results-list" class="button">Save all results</a>',
		  		table = '<table id="results-table"><thead><tr><th scope="col">string</th><th>tension</th><th>diameter</th><th>action</th></tr></thead><tbody></tbody></table>',
		  		noteName;

		  	if( rico.instruments.current.multipleTunings === true ) {
	  			noteName = rico.whichNote( rico.instruments.current.tuning[+rico.instruments.current.tuningId].tuning[rico.calcHelper.currentString][0] ) + rico.instruments.current.tuning[+rico.instruments.current.tuningId].tuning[rico.calcHelper.currentString][1];
	  		} else {
	  		  noteName = rico.whichNote( rico.instruments.current.tuning[rico.calcHelper.currentString][0] ) + rico.instruments.current.tuning[rico.calcHelper.currentString][1];
	  		}

	  		var diam = (rico.calcHelper.showOctave === true) ? rico.diameter + '/' + rico.diameterOct : rico.diameter;

	  		var results = '<tr data-string="' + ( rico.calcHelper.currentString + 1 ) + '" data-tension="' + rico.tension + '" data-diameter="' + diam +  '"><td>' + ( rico.calcHelper.currentString + 1 ) + '</td><td>' + rico.tension + ' ' + rico.unitDensity + '</td>';

		  	results += '<td>' + diam + ' ' + rico.unitDiameter + '</td>';
		  	results += '<td><a href="#" class="delete-results">delete</a></td></tr>';

		  	if( !$('#results-table').length ) {
		  		$('#save-calcs-container').append( table );
		  	}

		  	$('#results-table tbody').append( results ).trigger('create');

		  	if( !$('#save-results-list').length ) {
		  		$('#save-calcs-container').append( saveResultsButton ).trigger('create');
		  	}

		  	rico.showSavedMessage($(this));

		  }

	  });

	  $('a.delete-results').live('click', function deleteResults() {

	  	$(this).parent().parent().remove();
	  	if( !$('#results-table tr').length <= 1 ) {
	  		$('#save-calcs-container').empty().removeClass('pretty-bg');
	  	}

	  });

	  $('#save-results-list').live('click', function saveResultsList(){

	  	var fullResults = {
	  		name: rico.instruments.current.name,
	  		material: rico.instruments.current.material,
	  		stringLength: rico.instruments.current.stringLength,
	  		pitch: rico.instruments.current.pitch,
	  		results: []
	  	};

	  	$.each( $('#results-table tr'), function(i){
	  		var $this = $(this);
	  		// First result is the table header!
	  		if( i >= 1 ) {
	  			var myVals = {
		  			string: +$this.attr('data-string'),
		  			tension: +$this.attr('data-tension'),
		  			diameter: $this.attr('data-diameter')
		  		};
	  			fullResults.results.push( myVals );
	  		}

	  	});
	  	rico.resultsList.push( fullResults );
	  	if( rico.isLocalStorage === true ) {
	  		localStorage.resultsList = JSON.stringify( rico.resultsList );
	  	} else {
	  		alert("Local storage is not available on your device. I'm afraid you won't be able to save your results.")
	  	}

		  rico.showSavedMessage($(this));

	  });

	}).bind('pagehide', function removeHTMLonPageHide() {

		rico.calcHelper.tensDiam = '';
		$('#container, #container2').remove();
		$('.diameterResults, .tensionResults, #save-calcs-container').empty().removeClass('pretty-bg');
		$('#calc-results').empty().removeClass('pretty-bg').css({ 'margin-top': 0 });

	});



	// Custom note shenannigans
	$('#custom-note').bind('pagebeforecreate', function() {

		rico.calcHelper = {
			diapason: false,
			showOctave: false,
			currentString: 0
		};

  	rico.tensionOrDiameter = 'tension';

	}).bind('pagebeforeshow', function(){
	}).bind('pageinit', function(){
	}).bind('pageshow', function(){

		rico.calcHelper.tensDiam = '';
		$('.diameterResults, .tensionResults, #save-calcs-container').empty().removeClass('pretty-bg');
		$('#calc-results').empty().removeClass('pretty-bg').css({ 'margin-top': 0 });
	});


});