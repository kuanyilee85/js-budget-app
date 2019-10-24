//1. following is the Module Pattern = immidately invoke function expression + Closure
//2. cause the closure, ourside cannot access to x, but we can use it by "return" with a function to public
//3. Structure: separate data by different controller: a) budgetController, b) UIController, c) controller

// **BUDGET CONTROLLER**
var budgetController = (function() {
  //use object and function constructor to store multiple data for expense
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //use object and function constructor to store multiple data for income
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //store all items in data object
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //Create new ID; ID = LAST id + 1
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //Push it into data structure
      data.allItems[type].push(newItem);

      //Return the new element
      return newItem;
    },

    testing: function() {
      console.log(data);
    }
  };
})();

// **UI CONTROLLER**
var UIController = (function() {
  //organize class name in UI in the following object, incase you change it in the html file
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };
  return {
    getInput: function() {
      //return the following object containing the input values for "controller" to use
      return {
        type: document.querySelector(DOMstrings.inputType).value, //will be wither inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      //Create HTML string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearFields: function() {
      var fields, fieldsArr;

      //select fields that we want to clear; but it will give a list, will need to convert to array
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      //convert "List" to "Array" by calling slice()
      fieldsArr = Array.prototype.slice.call(fields);

      //clean the fieldsArr array by forEach()
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
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

  var setupEventListeners = function() {
    // create the event by addEventListener when button was clicked
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    // create the event by addEventListener when return was pressed
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var updateBudget = function() {
    // 6. Calculate the budget
    // 7. Return the budget
    // 8. Display the budget on the UI
  };

  // for DRY, ctrlAddItem is for the function inside btn clicked && key pressed
  var ctrlAddItem = function() {
    var input, newItem;
    // 1. Get the filed input data
    input = UICtrl.getInput();

    //Test if the input: a) has description, b) has a number, c) greater than zero, if does, then execute
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budgetcontroller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UIController.clearFields();

      // 5.Calculate and update the budget
      updateBudget();
    }
  };

  return {
    init: function() {
      console.log("Application has started.");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

// the only code outside controller, this app start after we call the init()
controller.init();
