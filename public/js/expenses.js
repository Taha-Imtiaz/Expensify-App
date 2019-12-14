var auth=firebase.auth();
var firestore=firebase.firestore();
var userId=location.hash.substring(1,location.hash.length)
var expensesNode=document.querySelector(".expenses")
//console.log(userId)
var filterButton=document.querySelector(".filterButton")
console.log(filterButton)
var totalCost=0;
var totalCostNode=document.querySelector(".totalCost")
// console.log(totalCostNode)


var renderExpenses=expenseArr=>{
  expensesNode.innerHTML="";
  console.log(expenseArr)

  for(var expense of expenseArr){
    console.log(expense)
    expensesNode.insertAdjacentHTML("afterbegin",
  `<div class="expense flex">
  <h1>${expense.description}</h1>
  <h2>${expense.cost}</h2>
  <div id=${expense.expenseId} class="edit btn">EDIT</div>
  <div id=${expense.expenseId} class="delete btn">DELETE</div>
  
  </div>`)
  }
  
}

var fetchExpenses=async ()=>{
var expenses=[];

//fetching expenses from firestore
var expensesQuery=await firestore.collection("expenses")
                        .where ("userId", "==", userId)
                        .orderBy("spentAt", "desc").get();
  expensesQuery.forEach(doc=>{
    expenses.push({...doc.data(),expenseId:doc.id});
   
  })
return expenses;
}

var fetchFilterExpense=async ()=>{
  var i1=document.querySelector(".i1").value.trim();
  var i2=document.querySelector(".i2").value.trim();

  i1=new Date(i1);
  i2=new Date(i2)
 
  console.log(i1,i2)
  var expenses=[]
  if(i1 && i2){
    var expensesQuery=await firestore.collection("expenses").orderBy("spentAt", "desc")
                      .where ("userId", "==", userId).where("spentAt",">=",i1)
                      .where("spentAt","<=",i2) .get();
                    
    
   expensesQuery.forEach(doc=>{
      expenses.push({...doc.data(),expenseId:doc.id});
                     
   })
   return expenses;
  }

}
 //Adding or rendering fetchFilterExpense
var renderFilterExpense=async (e) =>{
e.preventDefault();
console.log("expense rendering")
var expenses=await fetchFilterExpense();
renderExpenses(expenses);
sumCalculator(expenses);

}
filterButton.addEventListener("click",(e)=>{
renderFilterExpense(e)
})
var addExpense=async (e)=>{
  e.preventDefault();
  var description=document.querySelector("#description").value.trim();
  var cost=document.querySelector("#cost").value.trim();
  var spentAt=document.querySelector("#spentAt").value.trim();
if(description && cost && spentAt)
{
  var expenseObj={
    description:description,
    cost:parseInt(cost),
    spentAt:new Date(spentAt),
    userId:userId
  };
  //console.log(expenseObj)
  await firestore.collection("expenses").add(expenseObj);
 //fetching and rendering
 var expenses=await fetchExpenses();
 renderExpenses(expenses)
 sumCalculator(expenses);
  $(".mini.modal.m1Form").modal("hide");
}
}
var deleteHandler =async expenseId=>{
  await firestore.collection("expenses")
  .doc(expenseId).delete();
  var expenses=await fetchExpenses();
  renderExpenses(expenses);
  sumCalculator(expenses);
}
var sumCalculator=expenseArr=>{
  totalCost=0;
  for(var expense of expenseArr){
    totalCost+=expense.cost;
  }
  // console.log(totalCostNode)
  totalCostNode.textContent = `${totalCost} RS`;
}
auth.onAuthStateChanged(async user=>{
  if(user.uid===userId){
     console.log(user)
    var userNameNode = document.querySelector(".userName");
    userNameNode.textContent = user.displayName;

    //attaching lister to add expense form

    var expenses=await fetchExpenses();
    renderExpenses(expenses);
    sumCalculator(expenses)
    // console.log(expenses);

    expensesNode.addEventListener("click",async (e)=>{
     if(e.target.classList[0]==="edit"){
       var expenseId=e.target.id;
      //  console.log(expenseId)
      location.assign(`/editExpense.html#${expenseId}`)
     }
       else if(e.target.classList[0]==="delete"){
        var expenseId=e.target.id;
        deleteHandler(expenseId)
       }
     

     
    })

    //attaching lister to add expense form
    var addExpenseForm = document.querySelector("#addExpenseForm");
    addExpenseForm.addEventListener("submit", e => {
      addExpense(e);
    });

   
  }
})


var add = document.querySelector(".add");
add.addEventListener("click", () => {
  $(".mini.modal.m1Form").modal("show");
});
