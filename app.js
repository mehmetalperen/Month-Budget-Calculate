
//***************** BUGET DATA CONTROLER */
var BudgetDataControler = (function() {

    var Income = function(id, value, description) { //creating income item
        this.id = id;
        this.value = value;
        this.description = description;
    }

    var Expence = function(id, value, description) { //creating expence item
        this.id = id;
        this.value = value;
        this.description = description;
    }

    var data = { //data
        allItem: {
            inc: [], //income array that holds income objects that we create above (id, value, description)
            exp: [] //expence array that holds expence objects that we create above (id, value, description)
        },
        totalItem: {
            inc: 0, //total income
            exp: 0,   //total expence
            total: 0
        }
    }

    return {
        addItem: function(val, type, dec) { //type will be either "inc" OR "exp" (because of html options)

            var newItem, ID;
            val = parseFloat(val);

            if (data.allItem[type].length > 0) { // if the lenght of data.allItem.inc OR data.allItem.exp is bigger than 0

                ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
                // ID = last element's ID + 1

                /* A really sexy code here. data.allItem[type].... works because type always be either "inc"
                 OR "exp" and above  we named our arrays same as the possible type names*/
            } else {
                ID = 0;
            }

            if (type === 'inc') {
                newItem = new Income(ID, val, dec);

            } else if (type === 'exp') {
                newItem = new Expence(ID, val, dec);
            }
            data.allItem[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type, id) {

            var ids = data.allItem[type].map( current => {
                return current.id;
            });

            var indexToDelete;

            for (var i = 0; i < ids.length; i++) {
                if (id === ids[i]) {
                    indexToDelete = i;
                }
            }
            data.allItem[type].splice(indexToDelete, 1);
            
        },
        getData: function() {
            return data;
        },
        budgetCalculation: function() {
            var totInc = 0;
            var totExp = 0;

            for (var i = 0; i < data.allItem.inc.length; i++) {
                totInc += data.allItem.inc[i].value;
            }
            for (var i = 0; i < data.allItem.exp.length; i++) {
                totExp += data.allItem.exp[i].value;
            }

            data.totalItem.inc = totInc;
            data.totalItem.exp = totExp;
            data.totalItem.total = (totInc - totExp);

            return {
                totalIncome: data.totalItem.inc,
                totalExpence: data.totalItem.exp,
                overallBudget: data.totalItem.total
            }
        },
        percentageCalculation: function() {
            var itemsPercentages = [];

            for (var i = 0; i < data.allItem.exp.length; i++) {
                var percentage = {
                    id: data.allItem.exp[i].id,
                    per: (((data.allItem.exp[i].value) / data.totalItem.inc) * 100).toFixed(2)
                }
                itemsPercentages.push(percentage);
            }

            return {
                percentages: itemsPercentages,
                totExpPer: ((data.totalItem.exp / data.totalItem.inc) * 100).toFixed(2)
            }
        }
    }

})();
//^^^^^^^^^^^^^^^^^BUGET DATA CONTROLER
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
//**************** USER INTERFACE CONTROLER */
var UIcontroler = (function() {

    var DOMstrings = { // Do NOT forget to put "." and "#"
        inputType: '.add__type',                //will be either "inc" OR "exp"
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputAddBtn: '.add__btn',
        totalBudget: '.budget__value',
        totalIncome: '.budget__income--value',
        totalExpence: '.budget__expenses--value',
        incomeList: '.income__list',
        expenceList: '.expenses__list',
        budgetExpPer: '.budget__expenses--percentage',
        container: '.container',
        month: '.budget__title--month'

    };

    var incomeHtml = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
    var expenceHtml = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    //these are the blue print of the list. In "addItemList", we will be updating some of the things (like id, value, and desctiption), so every item has its unique info
    return {
        getDOMstrings: function() {
            return DOMstrings;
        },
        getInput: function() {
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        manipulateBudget: function(income, expence, total) {
            total = total.toFixed(2);
            income = income.toFixed(2);
            expence = expence.toFixed(2);
            
            document.querySelector(DOMstrings.totalBudget).innerHTML = total;
            document.querySelector(DOMstrings.totalIncome).innerHTML = income;
            document.querySelector(DOMstrings.totalExpence).innerHTML = expence;
        },
        addItemList: function(type, id, description, value) {
            var newHtml, html, element; 
            /*html will be either incomeHtml OR expneseHtml, depending on type.
             And element will be either DOMstrings.incomeList OR  DOMstrings.expenseList, again depending on type*/

             if (type === 'inc') {
                 html = incomeHtml;
                 element = DOMstrings.incomeList;

             } else if (type === 'exp') {
                 html = expenceHtml;
                 element = DOMstrings.expenceList;
             }

             //update some of the properties of the html blueprint
             newHtml = html.replace('%id%', id); 
             newHtml = newHtml.replace('%description%', description);
             newHtml = newHtml.replace('%value%', value.toFixed(2));

             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);//add the newHtml element to the place where element property(incomeHtml OR expneseHtml) ends
        },
        removeItemList: function(type, id) {
            
            if (type === 'inc') {
                document.getElementById('inc-' + id).remove();

            } else if (type === 'exp') {
                document.getElementById('exp-' + id).remove();
            }

        },
        resetInputBox: function() {
            document.querySelector(DOMstrings.inputDescription).value = '';
            document.querySelector(DOMstrings.inputValue).value = '';
            document.querySelector(DOMstrings.inputDescription).focus();

        },
        percentageManipulation: function(percentages, totExpPer) {

            if(totExpPer <= 100) {
                document.querySelector(DOMstrings.budgetExpPer).textContent = totExpPer + '%';

                for (var i = 0; i < percentages.length; i++) {
                    document.querySelector('#exp-' + percentages[i].id + ' .item__percentage').textContent = percentages[i].per + '%';
                }

            } else {
                document.querySelector(DOMstrings.budgetExpPer).textContent = '--';
 
                for (var i = 0; i < percentages.length; i++) {
                    document.querySelector('#exp-' + percentages[i].id + ' .item__percentage').textContent = '--';
                }
            }
        },
        setMonth: function(date) {

            document.querySelector(DOMstrings.month).textContent = date;
        }
        
    }

})();
//^^^^^^^^^^^^^^^^ USER INTERFACE CONTROLER
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
//***************** APP CONTROLER */
var appControler = (function(BudgetControl, UIcontrol) {

    function setupEventListeners() {
        var dom = UIcontrol.getDOMstrings();

        //add item clicked
        document.querySelector(dom.inputAddBtn).addEventListener('click', handleAddItem);

        //ENTER pressed --> add item
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                handleAddItem();
            }
        });

        //delete button pressed
        document.querySelector(dom.container).addEventListener('click', function(event) {
            handleDeleteItem(event);
        });



    }

    function handleAddItem() {

        //get input
        var input = UIcontrol.getInput(); //obj

        if (input.value && input.value > 0) {

            //add the input to the budget control
            var newItem = BudgetControl.addItem(input.value, input.type, input.description);

            // add item to the UI
            UIcontrol.addItemList(input.type, newItem.id, newItem.description, newItem.value);

            // After adding the item, reset the input box and put the focus on the description box
            UIcontrol.resetInputBox();

            //Do the buget calculation
            // update the UI budget
            budgetUpdate();

            //percentage calculation
            //UI percentage manipulation 
            percentageUpdate();

        }
    }

    function handleDeleteItem(event) {

        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            var splitID, type, id;
            splitID = itemID.split('-');
            type = splitID[0];
            id = splitID[1];

            // delete the item from budget data
            BudgetControl.deleteItem(type, id);
            
            //delete the item from UI
            UIcontrol.removeItemList(type, id);

            // redo the budget calculation --> budgetUpdate
            budgetUpdate();

            //redo teh percentage calculation --> percentageUpdate
            percentageUpdate();

        }

    }

    function budgetUpdate() {
        //Do the buget calculation
        var budget = BudgetControl.budgetCalculation(); //budget is an obj {totalIncome, totalExpence, overallBudget}
       
        // update the UI budget
        UIcontrol.manipulateBudget(budget.totalIncome, budget.totalExpence, budget.overallBudget);
    }

    function percentageUpdate() {
        //percentage calculation
        var percentageData = BudgetControl.percentageCalculation();
        var overallExpPer = percentageData.totExpPer;
        var itemsPercentages = percentageData.percentages;

        //UI percentage manipulation 
        UIcontrol.percentageManipulation(itemsPercentages, overallExpPer);
    }





    return {
        initial: function() {
            //Initialization 

            setupEventListeners();
            UIcontrol.manipulateBudget(0, 0, 0);

            //date
            var date = new Date();
            var month = date.getMonth();
            var months = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

            UIcontrol.setMonth(months[month])

        }
    }

})(BudgetDataControler, UIcontroler);
//^^^^^^^^^^^^^^^^^ APP CONTROLER

(function() {
    appControler.initial();
})();