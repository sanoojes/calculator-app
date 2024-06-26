const display = document.getElementById("calc");
const historyDisplay = document.getElementById("history");
let currentNumber = "";
let previousNumber = null;
let operation = null;
const history = [];
const maxHistoryEntries = 5;

const updateDisplay = (value) => {
  display.textContent = value;
};

const clearAll = () => {
  currentNumber = "";
  previousNumber = null;
  operation = null;
  updateDisplay("");
  history.length = 0;
  showRecentHistory();
};

const appendToDisplay = (input) => {
  if (currentNumber === "" && ["+", "-", "x", "÷", "%"].includes(input)) return;

  const isOperator = ["+", "-", "x", "÷", "%"].includes(input);

  if (
    isOperator &&
    isNaN(parseFloat(currentNumber[currentNumber.length - 1]))
  ) {
    currentNumber = currentNumber.slice(0, -1) + input;
  } else {
    currentNumber += input;
  }

  updateDisplay(currentNumber);
};

const handleOperator = (op) => {
  appendToDisplay(op);
  if (currentNumber === "") return;
  if (operation !== null) {
    calculate();
  }
  previousNumber = parseFloat(currentNumber);
  operation = op;
};

const calculate = () => {
  if (currentNumber === "" || previousNumber === null || operation === null)
    return;

  const expression = currentNumber;
  console.log(expression);

  try {
    let result = 0;
    const parts = expression.split(/([-+x÷])/);
    let operator = "+";
    for (let part of parts) {
      if (["+", "-", "x", "÷"].includes(part)) {
        operator = part;
      } else {
        switch (operator) {
          case "+":
            result += parseFloat(part);
            break;
          case "-":
            result -= parseFloat(part);
            break;
          case "x":
            result *= parseFloat(part);
            break;
          case "÷":
            result /= parseFloat(part);
            break;
        }
      }
    }
    updateDisplay(result);
    history.push(`${expression}`);

    // Update variables
    previousNumber = result;
    currentNumber = "";
    operation = null;
    showRecentHistory();
  } catch (error) {
    alert("Error in calculation!");
  }
};

const handleNumber = (buttonId) => {
  appendToDisplay(buttonId);
};

const handleDecimal = () => {
  if (currentNumber.indexOf(".") === -1) {
    appendToDisplay(".");
  }
};

const handlePlusMinus = () => {
  if (currentNumber === "") return;
  currentNumber = parseFloat(currentNumber) * -1;
  updateDisplay(currentNumber);
};

const handlePercent = () => {
  if (currentNumber === "" || previousNumber === null) return;
  const percent = (previousNumber / 100) * parseFloat(currentNumber);
  currentNumber = percent.toString();
  operation = "%";
  appendToDisplay(operation);
  updateDisplay(currentNumber);
};

const showRecentHistory = () => {
  let historyText = "";
  if (history.length > 0) {
    const recentEntries = history.slice(-maxHistoryEntries).reverse();
    for (const entry of recentEntries) {
      historyText += `${entry}<br>`;
    }
  } else {
    historyText = "No history yet.";
  }
  historyDisplay.innerHTML = historyText;
};

const showFullHistory = () => {
  let fullHistoryText = "";
  for (const entry of history.reverse()) {
    fullHistoryText += `${entry}<br>`;
  }
  historyDisplay.innerHTML = fullHistoryText;
};

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const buttonId = button.id;
    historyDisplay.innerHTML = "";

    if (buttonId === "clear") {
      clearAll();
    } else if (buttonId === "equals") {
      calculate();
    } else if (buttonId === "plusorminus") {
      handlePlusMinus();
    } else if (buttonId === "percent") {
      handlePercent();
    } else if (/\d/.test(buttonId)) {
      handleNumber(buttonId);
    } else if (buttonId === "dot") {
      handleDecimal();
    } else if (
      buttonId === "÷" ||
      buttonId === "x" ||
      buttonId === "-" ||
      buttonId === "+"
    ) {
      handleOperator(buttonId);
    } else if (buttonId === "showHistory") {
      showFullHistory();
    }
  });
});
