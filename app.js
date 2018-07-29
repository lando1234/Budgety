var budgetController = (function(){

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){

        var total;
        total = 0;

        data.allItems[type].forEach( function(el){
            total += el.value;
        });

        data.totals[type] = total;

    }
    var data = {
        allItems:{
            expense:[],
            income:[]
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1,
    }

    return {

        addItem: function(type, description, value){
            var newItem;

            var ID = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length - 1].id +1:0;

            if( type === 'expense'){
                newItem = new Expense( ID, description, value );
            } else {
                newItem = new Income( ID, description, value );
            }

            data.allItems[type].push(newItem);
            data.totals[type]+= newItem.value;

            return newItem;
        },
        calculateBudget: function(){
            calculateTotal('income');
            calculateTotal('expense');
            
            data.budget = data.totals.income - data.totals.expense;
            if( data.totals.income > 0){
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            }else {
                data.percentage = -1;
            }
        },
        getBudget: function(){
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalIncome: data.totals.income,
                totalExpense:data.totals.expense
            };
        }

    }


})();

var uiController = (function(){

    var DOMStrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
    }

    return {
        getInput: function(){
            return {
                type:document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value ) 
            }        
        },
        addListItem: function(obj,type){
        var html, newHTML, element;    
        if( type === 'income'){
            element = DOMStrings.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>'

        }
        else {
            element = DOMStrings.expenseContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

        newHTML = html.replace('%id%',obj.id).replace('%description%',obj.description).replace('%value%',obj.value);

        document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },
        clearFields:function(){
            var fields,fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription +', '+ DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(curr){
                curr.value = "";
            });

            fieldsArr[0].focus();
        },  
        displayBudget: function( budget ){

            console.log(budget);

            document.querySelector( DOMStrings.budgetLabel ).textContent = budget.budget;
            
            document.querySelector( DOMStrings.incomeLabel ).textContent = '+ '  + budget.totalIncome;
            
            document.querySelector( DOMStrings.expenseLabel ).textContent = '- ' + budget.totalExpense;
            if( budget.percentage > 0){
                document.querySelector( DOMStrings.percentageLabel ).textContent = budget.percentage + '%';
            }
            else {
                document.querySelector( DOMStrings.percentageLabel).textContent = '---';
            }
        },
        getDOMStrings: function(){
            return DOMStrings;
        }
    }

})();

var controller = ( function(budgetCtrl, uiCtrl) {

    var setupEventListeners = function(){
        var DOM = uiCtrl.getDOMStrings();

        document.querySelector( DOM.inputBtn ).addEventListener( 'click', ctrlAddItem );

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13 ){
                ctrlAddItem();
            }
    
        });
    };


    var updateBudget = function(){
        
        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        uiCtrl.displayBudget( budget );

    }

    var ctrlAddItem = function(){
        
        var input,newItem;

        input = uiCtrl.getInput();
        if( input.description !== "" && !isNaN( input.value ) && input.value > 0){
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);

            uiCtrl.addListItem(newItem,input.type);

            uiCtrl.clearFields();

            updateBudget();
        }
    };

    return {
        init: function(){
            setupEventListeners();
            uiCtrl.displayBudget({budget:0,totalIncome:0,totalExpense:0,percentage:-1});
        }
    }

})(budgetController,uiController);


controller.init();