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

  //use this function, looping through the value and sum up by forEach(), then store the sum in data.totals[]
  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
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
    },
    budget: 0,
    //-1 means nonexistent
    percentage: -1
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

    deleteItem=function(type,id){
      var ids, index;

      // if want to delete item with id=6
      // not just use data.allItems[type][id]; because id are not in orders
      // ex: ids = [1 2 4 6 8]
      // the index of id=6 is 3

      // mpa() will go through each item and the callback function will return the current id in order
      ids = data.allItems[type].map(function(current){
        return current.id;
      });

      // get the index of the item's ID in ids by indexOf()
      index = ids.indexOf(id);

      // -1 means non-existent; (so if not equal to -1); remove the item by splice() by index just get and only remove 1 item
      if(index !==-1){
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      //calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      //calculate the budget : income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      //calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    expensesContainer: ".expenses__list",
    //the class name used to do DOM manipulation for display budget
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container"
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

    //display the budget to UI
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    // pass the DOMstrings for other "controller" to use, which is expose DOMstrings to public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// **GLOBAL APP CONTROLLER**
// pass the budgetController and UIController as argument, so that the can be connected inside controller
// this controller can use other's code
var controller = (function(budgetCtrl, UICtrl) {
  //get DOMstrings from UIController
  var DOM = UICtrl.getDOMstrings();

  var setupEventListeners = function() {
    // create the event by addEventListener when button was clicked
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    // create the event by ctrlAddItem when return was pressed
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    // delete the event by ctrlDeleteItem using "Event Delegation"
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 6. Calculate the budget
    budgetCtrl.calculateBudget();
    // 7. Return the budget
    var budget = budgetCtrl.getBudget();
    // 8. Display the budget on the UI
    UICtrl.displayBudget(budget);
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

  // use DOM Traversing to find the class and ID when we click the delete button and later delete the item
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    // use parentNode to find out the item ID which we can use to delete item later
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    // split the ID when ctrlDeleteItem is fire and if there is a itemID
    // use split function to elimate the '-' by split('-'); ex: 'inc-1' to (inc, 1)
    if (itemID) {
      // inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = splitID[1];

      // 1. Delete the item from data structure

      // 2. Delete the item from UI

      // 3. Update and show the new budget
    }
  };

  return {
    init: function() {
      console.log("Application has started.");
      //set default number to zero
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

// the only code outside controller, this app start after we call the init()
controller.init();
