//1. following is the Module Pattern = immidately invoke function expression + Closure
//2. cause the closure, ourside cannot access to x, but we can use it by "return" with a function to public
//3. Structure: separate data by different controller: a) budgetController, b) UIController, c) controller

// **BUDGET CONTROLLER**
var budgetController = (function() {})();

// **UI CONTROLLER**
var UIController = (function() {
  //organize class name in UI in the following object, incase you change it in the html file
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  };
  return {
    getInput: function() {
      //return the following object containing the input values for "controller" to use
      return {
        type: document.querySelector(DOMstrings.inputType).value, //will be wither inc or exp
        descript: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    // pass the DOMstrings for other "controller" to use, which is expose DOMstrings to public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// **GLOBAL CONTROLLER**
// pass the budgetController and UIController as argument, so that the can be connected inside controller
// this controller can use other's code
var controller = (function(budgetCtrl, UICtrl) {
  //get DOMstrings from UIController
  var DOM = UICtrl.getDOMstrings();
  // for DRY, ctrlAddItem is for the function inside btn clicked && key pressed
  var ctrlAddItem = function() {
    // 1. Get the filed input data
    var input = UICtrl.getInput();
    console.log(input);
    // 2. Add the item to the budgetcontroller
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  // create the event by addEventListener when button was clicked
  document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

  // create the event by addEventListener when return was pressed
  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
