/*
File: Format number- Add Separator.js
Description: Adds Thousand Separators provided by the user, to all numbers in all selected text boxes
*/

//import basic checks
if (typeof (isLayoutOpen) == "undefined") {
	//import basic checks
	app.importScript(app.getAppScriptsFolder() + "/Dependencies/qx_validations.js");
	console.log("Loaded library for basic validation checks from application.");
}

//Import necessary support scripts, if not included already
if (typeof (getValidStringInput) == "undefined") {
	//import basic checks
	let inputsScript = app.getAppScriptsFolder() + "/Dependencies/qx_inputs.js";
	app.importScript(inputsScript);
	console.log("Loaded library qx_inputs for User Input.");
}

//Set the desired Thousand Separators and Decimal here
let defaultThousandSeparator = ",";
let defaultDecimal = ".";

var formattedNumberCount = 0;

if (isLayoutOpen()) {
	activeBoxes = getSelectedTextBoxes();

	if (activeBoxes != null && activeBoxes.length >= 1)// check if at least one box is selected
	{
		//get Thousand Separator
		defaultThousandSeparator = getValidStringInput("Enter the Thousand Separators to use:", defaultThousandSeparator);

		if (defaultThousandSeparator != null) {
			//get Decimal Separator
			defaultDecimal = getValidStringInput("Enter the Decimal Character to use:", defaultDecimal);
			if (defaultDecimal != null) {
				//Some countries use "space" as separator, so not using TRIM here
				//defaultThousandSeparator = defaultThousandSeparator.trim();
				//defaultDecimal = defaultDecimal.trim();

				if ("" === defaultThousandSeparator || "" === defaultDecimal || defaultThousandSeparator.length != 1 || defaultDecimal.length != 1) {//empty input, or more than one characters
					alert("Invalid Input. Please enter a single character for both the Thousand Separator and the Decimal Separator.")
				}
				else {
					//Iterate through all active boxes
					for (let i = 0; i < activeBoxes.length; i++) {
						//Get all the text runs from the box
						let boxTextSpans;
						boxTextSpans = activeBoxes[i].getElementsByTagName("qx-span");

						if (null != boxTextSpans) {
							//Iterate through all the Spans and Format the Numbers
							for (let j = 0; j < boxTextSpans.length; j++) {
								let spanChildren = boxTextSpans[j].childNodes;
								if (null != spanChildren) {
									for (let k = 0; k < spanChildren.length; k++) {
										//Check if it is a text node
										if (spanChildren[k].nodeType === 3) {
											formattedText = formatNumbersInString(spanChildren[k].nodeValue, defaultThousandSeparator);
											if (null != formattedText) {
												spanChildren[k].nodeValue = formattedText;
											}
											//alert ("String with formatted numbers: " + spanChildren[k].nodeValue);
										}
									}
								}
							}
						}
					}
					console.log(formattedNumberCount + " number(s) updated in " + activeBoxes.length + " text boxes.");
					alert(formattedNumberCount + " number(s) updated in " + activeBoxes.length + " text boxes.");
				}
			}
		}

	}
	else {
		//No Active Box
		alert("Please select one or more text boxes to run the script. Tables, Grouped Items, and Composition Zones are not supported.");
	}
}

/******** Local Functions for the Script ********/
function formatNumbersInString(unformattedString, thousandSeparator) {
	let isInputFormatted = false;

	//Test String with Numbers and Text
	//let unformattedString = 'Text at start 2.212px More Text 23.1px Some More 234px Negative Number -2345.6px A long Number 23456789.123456789 Text at the end';	

	//Regex to find all numbers, including decimal numbers and negatives
	//let numRegEx = /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g;
	let numRegEx = RegExp('[-]{0,1}[\\d]*[\\' + defaultDecimal + ']{0,1}[\\d]+', 'g');

	//Find all the matches in the source string, with the given RegEx
	let numbersFromString = unformattedString.match(numRegEx);

	//To Store Formatted Numbers
	let formattedNumber;

	//Check if a match has been found
	if (null != numbersFromString) {
		//Iterate through all numbers
		for (let i = 0; i < numbersFromString.length; i++) {
			//Get a formatted number from the function
			formattedNumber = addSeparatorsNF(numbersFromString[i], defaultDecimal, defaultDecimal, thousandSeparator);
			//Replace the original number in the String
			if (formattedNumber != numbersFromString[i]) {
				console.log("Original: " + numbersFromString[i] + " || Formatted: " + formattedNumber);
				unformattedString = unformattedString.replace(numbersFromString[i], formattedNumber);
				isInputFormatted = true;
				formattedNumberCount++;
			}
		}
	}

	//Return the updated String, only if a change has been made. Otherwise return "null"
	if (isInputFormatted) {
		return unformattedString;
		console.log("Returning: " + unformattedString);
	}
	else {
		return null;
	}
}

//Function to Add Separators to a Number. Source: http://www.mredkj.com/javascript/nfbasic.html
//To use addSeparatorsNF, you need to pass it the following arguments: 
//nStr: The number to be formatted, as a string or number. No validation is done, so don't input a formatted number. If inD is something other than a period, then nStr must be passed in as a string. 
//inD: The decimal character for the input, such as '.' for the number 100.2
//outD: The decimal character for the output, such as ',' for the number 100,2
//sep: The separator character for the output, such as ',' for the number 1,000.2
function addSeparatorsNF(nStr, inD, outD, sep) {
	nStr += '';
	let dpos = nStr.indexOf(inD);
	let nStrEnd = '';
	if (dpos != -1) {
		nStrEnd = outD + nStr.substring(dpos + 1, nStr.length);
		nStr = nStr.substring(0, dpos);
	}
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(nStr)) {
		nStr = nStr.replace(rgx, '$1' + sep + '$2');
	}
	return nStr + nStrEnd;
}
