console.clear();

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"; //Data source.

const monthNames = [ "January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];





//#2f80ed to #9cecfb,  #FBD786,  #f5af19 to #f12711
const colours = [ '#2f80ed', '#009ff8', '#27bbfb', '#65d5fa', '#9cecfb', '#FBD786', '#f5af19', '#f69400', '#f67800', '#f55600', '#f12711' ]

const svgWidth = 900; //Width of SVG.
const svgHeight = 500; //Height of SVG.
const svgPadding = 70; //Padding from edge of SVG.

let tooltipDiv = d3.select( "body" ) //This is the div that holds the tooltip.
	.append( "div" )
	.attr( "id", "tooltip" )


d3.json( url, function( err, data ) { //Gets the data from the json file.
	//Defines elements for the x-axis.
	// console.log('baseTemperature: ' + data.baseTemperature);  // 8.66
	// console.log(data.monthlyVariance[0]);  // {year: 1753, month: 1, variance: -1.366}
	// console.log(data.monthlyVariance[3152]); // {year: 2015, month: 9, variance: 0.87}

	// var actualDate = new Date();
	// console.log(actualDate)

	let yearsDate = data.monthlyVariance.map( function( item ) { //Maps out date as a date object.
		return new Date( item[ 'year' ], item[ 'month' ] - 1, 1 );
	} );
	// console.log(yearsDate[0]);  // Mon Jan 01 1753 00:00:00
	// console.log(yearsDate[3152]);  // Tues Sep 01 2015 00:00:00

	let minYear = d3.min( data.monthlyVariance, function( d ) {
		return d.year
	} ); //Gets smallest year from yearsDate.
	// console.log("minYear", minYear)  // 1753

	let maxYear = d3.max( data.monthlyVariance, function( d ) {
		return d.year
	} ); //Gets largest year from yearsDate.
	// console.log("maxYear", maxYear)  // 2015

	//Probably not 275
	const barWidth = svgWidth / ( maxYear - minYear ); //There are 262 years in the database.
	// console.log(barWidth) //3.435114503816794


	let ourYears = data.monthlyVariance.map( function( item ) {
		return item[ 'year' ]; //Maps out each year to this array.
	} );
	// console.log("ourYears: ", ourYears[0]);  // 1753
	// console.log("ourYears: ", ourYears[3152]);  // 2015


	let xScale = d3 //Scale for the x-axis.
		.scaleLinear()
		.domain( [ minYear, maxYear ] ) //Uses smallest year from yearsDate, and maxYear as biggest year.
		.range( [ svgPadding, svgWidth - ( svgPadding / 1.5 ) ] )
	// console.log(xScale);  // Math lingo.

	let xAxis = d3.axisBottom() //The x-axis.
		.scale( xScale )
		.tickFormat( d3.format( 'd' ) )
		.ticks( 26 )
	// console.log(xAxis);  // Math lingo.


	//Defines elements for the y-axis.      
	let ourVariances = data.monthlyVariance.map( function( item ) {
		return item[ 'variance' ]; //Maps out each Variance to this array.
	} );
	// console.log("ourVariance", ourVariances);

	let minVariance = d3.min( ourVariances ); //Gets the lowest Variance.
	console.log( "minVariance:", minVariance ); // -6.976

	let maxVariance = d3.max( ourVariances ); //Gets the highest Variance.
	// console.log("maxVariance:", maxVariance);  // 5.228


	// Is this scale needed?
	let linearScale = d3.scaleLinear() //A linear scale based on maxVariance and height of the chart.
		.domain( [ 0, maxVariance ] ) //Uses 0 and biggest Variance from data.
		.range( [ 0, svgHeight - ( svgPadding * 2 ) ] );
	// console.log(linearScale);  // Math lingo.

	let scaledVariances = ourVariances.map( function( item ) { //Runs each value of ourVariance through the linearScale to get a vertical height for each bar.
		// console.log(linearScale(item));  // Is this right?
		return linearScale( item );
	} );
	console.log( "scaledVariances", scaledVariances[ 0 ] ); // -94.0627390971691 : Lowest height.
	// console.log("scaledVariances", scaledVariances[3152]);  // 59.90818668706963 : Highest height.


	let yScale = d3.scaleBand() //Scale for the y-axis.
		// .domain([0, maxVariance]) //Uses 0 and biggest Variance from data.
		.domain( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] )
		.range( [ svgPadding, svgHeight - svgPadding ] );
	// console.log(yScale);  // Math lingo.

	const barHeight = yScale.bandwidth()
	// console.log(barHeight)  // 30

	let yAxis = d3.axisLeft( yScale ) //The y-axis.
		.tickValues( yScale.domain() )
		.tickFormat( function( d ) {
			return monthNames[ d ];
		} );
	// console.log(yAxis);  // Math lingo.


	//Defines the main SVG element.
	let svgContainer = d3.select( "body" )
		.append( "svg" )
		.attr( "width", svgWidth )
		.attr( "height", svgHeight );

	svgContainer.append( "text" ) //Appends the Title element.
		.attr( "id", "title" )
		.attr( "transform", "translate(100,0)" )
		.attr( "x", svgWidth / 20 )
		.attr( "y", svgPadding / 1.5 )
		.text( "Monthly Global Land-Surface Temperature" )

	svgContainer.append( "text" ) //X-Axis label.
		.attr( "transform", "translate(100,0)" )
		.attr( "x", svgWidth / 2.8 )
		.attr( "y", svgHeight - 20 )
		.text( "Years" )

	svgContainer.append( "text" ) //Y-Axis label.
		.attr( "transform", "rotate(-90)" )
		.attr( "x", 0 - ( svgHeight / 1.65 ) )
		.attr( "y", 20 )
		.text( "Months" )

	// console.log(svgContainer);

	d3.select( 'svg' ).selectAll( 'rect' ) //Appends all of the Bar rectangles.
		.data( data.monthlyVariance )
		.enter()
		.append( 'rect' )
		.attr( 'class', 'cell' )

		.attr( 'x', function( d ) { //Controls x-value for rectangles. Uses ?.
			// console.log("X position:" , xScale(d.year)) // Something like 535.2999566923778
			return xScale( d.year );
		} )

		.attr( 'y', function( d ) { //Controls y-value for rectangles. Uses ?.
			// console.log("Y position:" , yScale(d.month - 1)) // Something like ?????
			return yScale( d.month - 1 );
		} )
		.attr( 'width', barWidth ) //Width of all rectangles.
		.attr( 'height', barHeight ) //Height of all rectangles.


		//                     .attr('transform', 'translate(' + svgPadding + ', 0)') //Controls translation along x, y axis.

		.attr( 'data-month', function( d, i ) { //Only visible with Chrome Dev tools.
			// console.log("The data-month field: ", d.month - 1);
			return d.month - 1; //Uses date from data.
		} )
		.attr( 'data-year', function( d, i ) { //Only visible with Chrome Dev tools.
			// console.log("The data-year field: ", d.year);
			return d.year; //Uses date from data.
		} )
		.attr( 'data-temp', function( d, i ) { //Only visible with Chrome Dev tools.
			// console.log("The data-temp field: ", d.variance);
			return d.variance; //Uses date from data.
		} )

		.style( 'fill', ( d, i ) => {
			let temp = parseFloat( d.variance + data.baseTemperature );

			if ( temp < 2.8 ) {
				return colours[ 0 ]
			} else if ( temp < 3.9 ) {
				return colours[ 1 ]
			} else if ( temp < 5 ) {
				return colours[ 2 ]
			} else if ( temp < 6.1 ) {
				return colours[ 3 ]
			} else if ( temp < 7.2 ) {
				return colours[ 4 ]
			} else if ( temp < 8.3 ) {
				return colours[ 5 ]
			} else if ( temp < 9.4 ) {
				return colours[ 6 ]
			} else if ( temp < 10.5 ) {
				return colours[ 7 ]
			} else if ( temp < 11.6 ) {
				return colours[ 8 ]
			} else if ( temp < 12.7 ) {
				return colours[ 9 ]
			} else { // 13.8?
				return colours[ 10 ]
			}

		} )


		// Fix this
		.on( "mouseover", function( d, i ) { //When user mouse's over a rectangle.
			tooltipDiv.style( "opacity", .9 ); //Tooltip div is made visible.
			tooltipDiv.attr( "data-year", d.year ); //Only visible with Chrome Dev tools. Uses date from data.
			//console.log("The data-date field: ", data.data[i][0]);

			//Populates tooltip div with current iteration from ourYears, quarters, and ourGDP.
			tooltipDiv.html( `<p>Variance ${d.variance}</p><p>Temperature: ${d.variance + data.baseTemperature}</p>` ) //Adds a comma in the money value.
				.style( "left", ( d3.event.pageX + 25 ) + "px" ) //Div appears to the right of the rectangle.
				.style( "top", ( d3.event.pageY - 10 ) + "px" );
		} )
		.on( "mouseout", function( d ) { //When user mouses's away from rectangle.
			tooltipDiv.style( "opacity", 0 ); //Tooltip div is made invisible.
		} );


	svgContainer.append( "g" ) //Appends the x-axis to the SVG file.
		.attr( "id", "x-axis" )
		.attr( "transform", "translate(0," + ( svgHeight - svgPadding ) + ")" )
		.call( xAxis )

	svgContainer.append( "g" ) //Appends the y-axis to the SVG file.
		.call( yAxis )
		.attr( "id", "y-axis" )
		.attr( "transform", "translate(" + ( svgPadding ) + ",0)" )


	//Check this numbers
	const svgLegend = d3
		.select( 'body' )
		.append( 'svg' )
		.attr( 'class', 'svg-legend' )
		.attr( 'width', 550 )
		.attr( 'height', 250 )
		.attr( 'x', svgPadding )
		.attr( 'y', 50 )
		.attr( 'id', 'legend' );

	const xScaleLegend = d3
		.scaleLinear()
		.domain( [ 0, 10 ] )
		.range( [ svgPadding, ( 500 ) - svgPadding ] );

	const xAxisLegend = d3
		.axisBottom( xScaleLegend )
		.tickFormat( ( d, i ) => {
			const scaleLabel = ( 2.8 + ( 1.1 * i ) )
			return scaleLabel.toFixed( 1 )
		} )

	svgLegend
		.append( 'g' )
		.attr( 'transform', 'translate(0, 40)' )
		.attr( 'id', 'x-axislegend' )
		.call( xAxisLegend )

	svgLegend
		.selectAll( 'rect' )
		.data( colours )
		.enter()
		.append( 'rect' )
		.attr( 'x', ( d, i ) => {
			return xScaleLegend( i - 1 );
		} )
		.attr( 'y', ( d ) => {
			return 10;
		} )
		.attr( 'width', 300 )
		.attr( 'height', 30 )
		.style( 'fill', ( d, i ) => {
			return colours[ i ];
		} );

	console.log( "End of chart" );
} );

console.log( "End of program" );