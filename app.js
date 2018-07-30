var budgetController = (function(){

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if( totalIncome > 0 ){
            this.percentage = Math.round( (this.value / totalIncome ) * 100);
        } else {
            this.percentage = -1;
        }        
    };

    Expense.prototype.getPercentage = function(){ return this.percentage };

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
        deleteItem: function(type, id){
            var ids = data.allItems[type].map( function(element){
               return element.id;
            });

            index = ids.indexOf( id );

            if( index !== -1 ){
                data.allItems[type].splice(index,1);
            }

        },
        calculatePercentages: function(){
            data.allItems['expense'].forEach( function( el ){ el.calcPercentage( data.totals['income'] )});
        },
        getPercentages: function(){
            var allPerc = data.allItems.expense.map(function(el){ return el.percentage });
            return allPerc;
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
        container:'.container',
        expensesPercentLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }
    var formatNumber = function(number, type){

        var numSplit,int,dec;

        var number = Math.abs( number );
        number = number.toFixed(2);

        numSplit = number.split( '.' );

        int = numSplit[0];
        dec = numSplit[1];

        if( int.length > 3 ){
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        

        return (type === 'expense'? '-':'+') + ' ' + int + '.' + dec;

    }

    
    var nodeListForEach = function( nodeList, cf){
        for ( var i = 0; i< nodeList.length ; i++){
            cf(nodeList[i],i);
        }
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
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>'

        }
        else {
            element = DOMStrings.expenseContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

        newHTML = html.replace('%id%',obj.id).replace('%description%',obj.description).replace('%value%',formatNumber(obj.value, type) );

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
            document.querySelector( DOMStrings.budgetLabel ).textContent = formatNumber(budget.budget,budget.budget>0?'income':'expense');
            
            document.querySelector( DOMStrings.incomeLabel ).textContent = formatNumber(budget.totalIncome, 'income');
            
            document.querySelector( DOMStrings.expenseLabel ).textContent = formatNumber(budget.totalExpense,'expense');
            if( budget.percentage > 0){
                document.querySelector( DOMStrings.percentageLabel ).textContent = budget.percentage + '%';
            }
            else {
                document.querySelector( DOMStrings.percentageLabel).textContent = '---';
            }
        },
        deleteListItem: function( id ){
            document.getElementById( id ).parentNode.removeChild( document.getElementById( id ) );
        },
        displayPercentages: function( percentages ){
            var fields;
            fields = document.querySelectorAll(DOMStrings.expensesPercentLabel);


            nodeListForEach( fields, function(el,index){
                if( percentages[index] > 0){
                    el.textContent = percentages[index] + '%';
                } else {
                    el.textContent = '---';
                }
            });
        },
        displayMonth:function(){
            var now, year,month, months; 
            now = new Date();
            
            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


            document.querySelector( DOMStrings.dateLabel ).textContent = months[month] + ' ' + year;
        },
        changeType: function(){
            var fields = document.querySelectorAll( DOMStrings.inputType + ',' +
                                                    DOMStrings.inputDescription + ','+
                                                    DOMStrings.inputValue);

            nodeListForEach( fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem );

        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changeType)
    };


    var updateBudget = function(){
        
        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        uiCtrl.displayBudget( budget );

    }

    var updatePercentages = function(){
        budgetCtrl.calculatePercentages();
        
        var perc = budgetCtrl.getPercentages();

        uiCtrl.displayPercentages( perc );
    }

    var ctrlAddItem = function(){
        
        var input,newItem;

        input = uiCtrl.getInput();
        if( input.description !== "" && !isNaN( input.value ) && input.value > 0){
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);

            uiCtrl.addListItem(newItem,input.type);

            uiCtrl.clearFields();

            updateBudget();

            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID,splitID,type,id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if( itemID ){
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt( splitID[1] );

            budgetCtrl.deleteItem( type, id );
            uiCtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    };

    return {
        init: function(){
            setupEventListeners();
            uiCtrl.displayMonth();
            uiCtrl.displayBudget({budget:0,totalIncome:0,totalExpense:0,percentage:-1});
        }
    }

})(budgetController,uiController);


controller.init();