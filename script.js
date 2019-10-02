// We set up the calculator object, where we will keep updating it's state
const calculator = {
    calculatorValue: "0",
    firstNumber: null,
    secondNumber: false,
    operator: null,
};

// This object is containing all the basic operators and their main functions
const resolveCalculation = {
    '+': (firstValue, secondValue) => firstValue + secondValue,

    '-': (firstValue, secondValue) => firstValue - secondValue,

    '*': (firstValue, secondValue) => firstValue * secondValue,

    '/': (firstValue, secondValue) => firstValue / secondValue,

    '=': (resultValue) => resultValue
};

// This function will update the calculator object state according to user input
function inputNumber(number) {
    let { calculatorValue, secondNumber } = calculator; // ECMAScript 6 (JavaScript 2015) destructuring

    // This will be executed when we are listening for the second set of numbers to be input
    if (secondNumber === true) {
        calculator.calculatorValue = number; 
        calculator.secondNumber = false;
    // Otherwise we first check if the calulator value is 0, since we don't want duplicated zeros for first entry
    } else {
        if (calculatorValue == "0") {
            calculator.calculatorValue = number; // If the zero exists, we simply overwrite it so the user can't input a number full of zeroes
        } else {
            calculator.calculatorValue = calculator.calculatorValue + number; // If user enters a legit value, we append it
        }
    }
}

// This function will handle the decimal input
function inputDecimal(decimal) {
    // We check if the user wants to add the decimal immediately after he used an operator, which sets the listening to second number to true
    if (calculator.secondNumber === true) return;

    // We check if the decimal is already existing, if not we append it
    if (!calculator.calculatorValue.includes(decimal)) {
        calculator.calculatorValue += decimal;
    }
}

// This function will deal with different operator scenarios
function resolveOperator(setOperator) {
    let { calculatorValue, firstNumber, operator } = calculator; // ECMAScript 6 (JavaScript 2015) destructuring
    let inputValue = parseFloat(calculatorValue); // Since our input is text type, we convert the value to a number

    // Here we check if the operator already exists while we are already waiting for the second set of numbers
    // The purpose of this is that the user can change his mind about the operator
    if (operator && calculator.secondNumber) {
        calculator.operator = setOperator;
        return;
    }

    // If firstNumber is equal to null, we first store it's value, otherwise we check if operator was set
    if (firstNumber === null) {
        calculator.firstNumber = inputValue;
    } else if (operator) {
        // If firstNumber was already set, that means we need to check what kind of operations to perform
        let calculationResult = resolveCalculation[operator](firstNumber, inputValue);
        calculator.calculatorValue = calculationResult;
        calculator.firstNumber = calculationResult; // After operation we set the firstNumber to the new calculated value, so the user may continue calculating
    }
    calculator.secondNumber = true; // This will set the calculator to listen for the second set of numbers to be input by the user
    calculator.operator = setOperator; // This will store which operator was used to perform the calculation
}

// This function is in charge of writing the calculation value into the calculator's "display"
function calculatorOutput() {
    let calculatorInput = document.getElementById("calculatorInput");
    calculatorInput.value = calculator.calculatorValue;
}

// This function resets the main calculator object back to default values
function calculatorClear() {
    calculator.calculatorValue = "0";
    calculator.firstNumber = null;
    calculator.secondNumber = false;
    calculator.operator = null;
}

// This will grab the .calculatorButton class element, which is containing all the buttons, saving us the effort of writing that many getElementById calls
let allButtonsQuery = document.querySelector(".calculatorButtons");

allButtonsQuery.addEventListener("click", function (event) {
    let target = event.target; // This will save the whole clicked HTML element into a variable so we can target it's value

    // We exit the method early if we click something thats not a button, avoiding the undefined error.
    if (!target.matches("button")) {
        return;
    }

    // This will check what kind of button was clicked by checking their class names
    if (target.classList.contains("operator")) {
        resolveOperator(target.value);
        calculatorOutput();
        return;
    }
    if (target.classList.contains("decimal")) {
        inputDecimal(target.value);
        calculatorOutput();
        return;
    }
    if (target.classList.contains("clear")) {
        calculatorClear();
        calculatorOutput();
        return;
    }

    inputNumber(target.value);
    calculatorOutput();
});

// This creates nodeList of all the buttons, which makes it possible to loop through, again avoiding multiple getElementById calls
let allButtonsNodeList = document.getElementsByTagName("button");

document.addEventListener("keydown", function (event) {
    event.preventDefault();

    // We'll isolate the enter button and assign it's functionality to the equals operator
    let enterKey = this.getElementById("enterKey");

    // This will detect if enter or equals button was pressed    
    if (event.keyCode === 13 || event.key == "=") {
        enterKey.click(); // the click function triggers (or simulates) our existing button to be pressed, this means we that we dont input the values directly from keyboard, but we are instead just triggering buttons which do so
        enterKey.focus();
        return;
    }
    // This will detect if backspace button was pressed
    // It will not work if we try to erase the calculation result (checked mac OS calculator's behaviour)
    // We can achieve that by checking when the backspace is not dealing with a number type, since we store our result after we convert it into a number while our keyboard input is adding string values.
    if (event.keyCode === 8 && typeof calculator.calculatorValue != "number") {
        calculator.calculatorValue = calculator.calculatorValue.substr(0, calculator.calculatorValue.length -1);
        // We have to reset the value of the input if we delete our whole string, since it's value in that case is NaN and that breakes the calculator
        if (calculator.calculatorValue.length === 0){
            calculator.calculatorValue = "0";
        }
        calculatorOutput();
        return;
    }
    // This will loop through all the buttons and compare buttons clicked to button values
    for (let i = 0; i < allButtonsNodeList.length; i++) {
        if (event.key == allButtonsNodeList[i].value) {
            allButtonsNodeList[i].click();
            allButtonsNodeList[i].focus();
        }
    }
});