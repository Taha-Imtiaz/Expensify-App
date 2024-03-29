
//fetching id from url
var expenseId=location.hash.substring(1,location.hash.length);

// Initializing firebase services
var firestore=firebase.firestore();
var auth=firebase.auth();

//fetching expense whose id is in url
var fetchSpecificExpense=async expenseId=>{
    var expenseQuery=await firestore
    .collection("expenses")
    .doc(expenseId).get();
    var expense=expenseQuery.data();
    return expense;
}

var editExpenseForm=document.querySelector("#editExpenseForm");
var updateHandler=async e=>{
    e.preventDefault();
    var description=document.querySelector("#description").value.trim();
   
    var cost=document.querySelector("#cost").value.trim();
    var spentAt=document.querySelector("#spentAt").value.trim();
    //  console.log(description,cost,spentAt)
     if(description && cost && spentAt){
    try {
        var updatedExpense = {
            description:description,
            cost: parseInt(cost),
            spentAt: new Date(spentAt)
       } 
      
       //updating expense with new data
       await firestore.collection("expenses")
       .doc(expenseId).update(updatedExpense);
       //redirecting back to expense page
       history.back();
      
    } catch(error) {
        console.log(error)
    }
    }
}
auth.onAuthStateChanged(async user=>{
    var expense=await fetchSpecificExpense(expenseId);

    //auto filling form
    var description=document.querySelector("#description");
    var cost=document.querySelector("#cost");
    var spentAt=document.querySelector("#spentAt");
     //  console.log(expense.spentAt.toDate().toISOString().split("T")[0])

    description.value=expense.description;
    // console.log(description.value)
    cost.value=expense.cost;

//formatting date to match yyyy-MM--dd
//try console.log each step here.
    console.log(expense.spentAt .toDate().toISOString().split("T")[0])
    spentAt.value=expense.spentAt
    .toDate().toISOString().split("T")[0];
    
    editExpenseForm.addEventListener("submit",(e)=>{
        updateHandler(e);
    })
                    

})
