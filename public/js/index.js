var signup = document.querySelector(".signup");
//console.log(signup)
signup.addEventListener("click", () => {
  $(".mini.modal.m1Form").modal("show");
});

var firestore = firebase.firestore();
var auth = firebase.auth();
console.log(firebase)
console.log(firestore)
console.log(auth)

//handling Signup
var signupForm=document.querySelector("#signupForm")
var fullName=document.querySelector("#fullName")
var email=document.querySelector("#email")
var password=document.querySelector("#password")

var signupHandle= async (e)=>{
e.preventDefault();
var displayName=fullName.value.trim();
var mail=email.value.trim();
var ps=password.value.trim();
if(displayName && mail &&ps){

  try{
    //create new user
    var user=await auth.createUserWithEmailAndPassword(mail, ps);
   // console.log(user);
   var userId=user.user.uid;
   var userObj={
     displayName:displayName,
     email:mail,
     joinedAt:firebase.firestore.Timestamp.fromDate(new Date())
   }
   await firestore.collection("users")
   .doc(userId).set(userObj);
   //redirecting user to expenses.html with his id
  location.assign(`/expenses.html#${userId}`)
  }
  catch(error){
    console.log(error)
  }
}
}

signupForm.addEventListener("submit",(e)=>{
  signupHandle(e);
})

//handle login
var loginForm=document.querySelector("#loginForm")
var loginEmail=document.querySelector("#loginEmail")
var loginPassword=document.querySelector("#loginPassword")

var handleLogin = async (e)=>{
  e.preventDefault();
  var email = loginEmail.value.trim();
  var ps=loginPassword.value.trim();
  if(email && ps)
  {
    try {
      //login user with email and password
      var user=await auth.signInWithEmailAndPassword(email, ps)
      var userId=user.user.uid;
      //redirecting user to expenses.html with his id
      location.assign(`/expenses.html#${userId}`)
    } catch (error) {
      console.log(error)
    }
  }
}
loginForm.addEventListener("submit",(e)=>{
  handleLogin(e);
})

//handle google Login 
var googleLoginBtn=document.querySelector(".googleLogin");
var handleGoogleLogin=async ()=>{
  try {
    var provider = new firebase.auth.GoogleAuthProvider();
    var user = await auth.signInWithPopup(provider);
    var userId=user.user.uid;
   if(user.additionalUserInfo.isNewUser){
     //adding user info to the firestore

     var userObj={
       name:user.additionalUserInfo.profile.name,
       email:user.additionalUserInfo.profile.email,
      joinedAt:firebase.firestore.Timestamp.fromDate(new Date())
      }
      await firestore.collection("users")
      .doc(userId).set(userObj);
      //redirecting user to expenses.html with his id
     location.assign(`/expenses.html#${userId}`)
   }
else
{
  location.assign(`/expenses.html#${userId}`)
}
  } catch (error) {
    console.log(error)
  }
}
googleLoginBtn.addEventListener("click", handleGoogleLogin);