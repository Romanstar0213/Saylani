import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import { getFirestore, getDoc, collection, orderBy, deleteDoc, increment, query, addDoc, where, setDoc, getDocs, updateDoc, doc, Timestamp, onSnapshot, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAB6BGICPCxGWiQuC9mtWRr0yCarIzQGT8",
  authDomain: "newproject-1f011.firebaseapp.com",
  projectId: "newproject-1f011",
  storageBucket: "newproject-1f011.appspot.com",
  messagingSenderId: "17415106477",
  appId: "1:17415106477:web:b89409a2a30e29553bfb24",
  measurementId: "G-HV3MWJG5H0"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// sign up

let allblogs = document.getElementById("allblogs")
let myblogdata = document.getElementById("myblogdata")
let sfname = document.getElementById("sfname")
let slname = document.getElementById("slname")
let semail = document.getElementById("semail")
let spassword = document.getElementById("spassword")
let srpassword = document.getElementById("srpassword")
let signupbtn = document.getElementById("signupbtn")
let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let currentTime = moment().format('MMMM Do YYYY, h:mm:ss a')
let loadermain = document.getElementById("loadermain")
let logbtn = document.getElementById("logsign")
let loginnam = document.getElementById("loginname")

// home section
// console.log(user)
const home = async () => {
  allblogs.innerHTML = ""
  
  const querySnapshot = await getDocs(collection(db, "usersPosts"));
  querySnapshot.forEach((doc) => {
    let fromNowTime = moment(doc.data().time,'MMMM Do YYYY, h:mm:ss a').fromNow()
    
    

    allblogs.innerHTML += `<div class="myblogsmain m-3 p-3">
  <div class="myblogsupper d-flex justify-content-center">
      <div class="profileimg">
          <div class="imagediv">
              <img src="https://img.freepik.com/free-icon/user_318-159711.jpg?w=2000" alt="">
          </div>
      </div>
      <div class="blogtext px-3">
          <div class="blogname">${doc.data().username}</div>
          <div class="postinfo">
              <h5>${doc.data().blogname}</h5>
              <div class="blogname" style="font-size:12px !important">${fromNowTime}</div>
          </div>
      </div>
  </div>
  <div class="mybloglower px-2">
      <p>${doc.data().details}</p>
  
  </div>
  
  </div>`

  });

}
home()

// home section


const logsign = () => {

  location.href = "signup.html"

}
window.logsign = logsign



const signup = async () => {
  console.log("signup")
  loadermain.classList.remove("d-none")
  console.log(sfname)
  if (semail.value.match(emailFormat)) {

    if (spassword.value.length > 7) {
      // alert("true")
      if (spassword.value === srpassword.value) {
        // alert("password right")


        createUserWithEmailAndPassword(auth, semail.value, spassword.value)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user.uid)
            
            const adduserdata =async()=>{

              await setDoc(doc(db, "usersInfo", user.uid), {
                id: user.uid,
                name: sfname.value,
                lastname: slname.value,
                email: semail.value,
                time: currentTime
              });
  
              
              location.href = ("../dashboard.html")
            }
            adduserdata()



          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
          });

      }
      else {
        alert("password doesnt match")

      }
    }
    else {
      alert("password length must be 8 letters")
    }


  }
  else {
    alert("wrong format")
  }



  loadermain.classList.add("d-none")


}
window.signup = signup

// sign up


// getting login user 

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // console.log("uid")
    logbtn.innerHTML = "logOut"
    logbtn.removeAttribute("onclick", "logsign()")
    logbtn.setAttribute("onclick", "logout()")
    // console.log(logbtn)


    const usersignindata = async () => {
      const docRef = doc(db, "usersInfo", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    usersignindata()



    const post = async () => {
      loadermain.classList.remove("d-none")
      let blogname = document.getElementById("blogname")
      let textareaa = document.getElementById("textareaa")
      let fromNowTime = moment("August 18th 2023, 1:00:21 am", 'MMMM Do YYYY, h:mm:ss a').fromNow()
      console.log("dsdsd")
      loadermain.classList.remove("d-none")


      await addDoc(collection(db, "usersPosts"), {
        userId: uid,
        username: loginnam.innerHTML,
        blogname: blogname.value,
        details: textareaa.value,
        time: currentTime

      });

      loadermain.classList.add("d-none")
    }
    window.post = post


    const mydashboard = async () => {
      myblogdata.innerHTML = ""
      // console.log(uid)
      const q = query(collection(db, "usersPosts"), where("userId", "==", uid));

      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data();
        // console.log(doc.data())
        let fromNowTime = moment(doc.data().time,'MMMM Do YYYY, h:mm:ss a').fromNow()
        

        myblogdata.innerHTML += `<div class="myblogsmain m-3 p-3">
<div class="myblogsupper d-flex justify-content-center">
    <div class="profileimg">
        <div class="imagediv">
            <img src="https://img.freepik.com/free-icon/user_318-159711.jpg?w=2000" alt="">
        </div>
    </div>
    <div class="blogtext px-3">
        <div class="blogname">${doc.data().username}</div>
        <div class="postinfo">
            <h5>${doc.data().blogname}</h5>
        <div class="blogname" style="font-size:12px !important">${fromNowTime}</div>

        </div>
    </div>
</div>
<div class="mybloglower px-2">
    <p>${doc.data().details}</p>

</div>
<div class="blogbtns d-flex">

    <button class="btn btn-primary mx-2">add</button>
    <button class="btn btn-primary">delete</button>

</div>
</div>`




      });


    }
    mydashboard()


    const loginname = async () => {
      // console.log("dsdsdsadasd")
      const q = query(collection(db, "usersInfo"), where("id", "==", uid));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data();
        console.log(doc.data().user)
        loginnam.innerHTML = doc.data().name
        // console.log()


      });


    }
    loginname()




    // ...
  } else {
    // User is signed out
    // ...
  }
});

const logout = () => {

  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("logout")
    logbtn.removeAttribute("onclick", "logout()")
    logbtn.innerHTML = "SignUp"
    logbtn.removeAttribute("onclick", "logsign()")
    window.location.href = "index.html"
    myblogdata.innerHTML = ""
    loginnam.innerHTML = ""

  }).catch((error) => {
    // An error happened.
  });

}
window.logout = logout

const hom=()=>{
  console.log("home")
  window.location.href="index.html"

}
window.hom = hom

const myblogs = async () => {
  let blogdata = document.getElementById("blogdata")
  // loadermain.classList.remove("d-none")

  const q = query(collection(db, "usersPosts"), where("capital", "==", true));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });



}
myblogs()
window.myblogs = myblogs
window.signup = signup

const signIn=()=>{
  let lusername = document.getElementById("lusername")
  let lpassword = document.getElementById("lpassword")
  

  signInWithEmailAndPassword(auth, lusername.value, lpassword.value)
  .then((userCredential) => {
    // Signed in 
    // const user = userCredential.user;
    location.href = "dashboard.html"

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    alert("wrong email and password")
    const errorMessage = error.message;
  });


}
window.signIn = signIn