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

    var data = {
        allItems:{
            expense:[],
            income:[]
        },
        totals: {
            expense: 0,
            income: 0
        }
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

    }


})();

var uiController = (function(){

    var DOMStrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list'
    }

    return {
        getInput: function(){
            return {
                type:document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value 
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

    var ctrlAddItem = function(){
        
        var input,newItem;

        input = uiCtrl.getInput();

        newItem = budgetCtrl.addItem(input.type,input.description,input.value);

        uiCtrl.addListItem(newItem,input.type);


    };

    return {
        init: function(){
            setupEventListeners();
        }
    }

})(budgetController,uiController);


controller.init();