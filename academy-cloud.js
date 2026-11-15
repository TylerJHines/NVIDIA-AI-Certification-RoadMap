import {firebaseConfig} from './aio/firebase-config.js';
const status=document.getElementById('cloud-status'),login=document.getElementById('cloud-login'),logout=document.getElementById('cloud-logout');
const ready=Boolean(firebaseConfig.apiKey&&firebaseConfig.authDomain&&firebaseConfig.projectId&&firebaseConfig.appId);
let auth=null,db=null,user=null,loading=true;
const say=s=>{status.textContent=s};
const api={save:async data=>{if(!user||loading)return;try{const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js');await setDoc(doc(db,'users',user.uid,'academy','progress'),{links:data,updatedAt:new Date().toISOString()},{merge:true});say('Signed in · Progress saved')}catch(e){say('Cloud save failed: '+e.message)}}};window.AcademyCloud=api;
if(!ready){say('Google sign-in not configured. See SETUP-GOOGLE-LOGIN.md. Progress saves on this device only.');}
else try{
 const [{initializeApp},{getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,setPersistence,browserLocalPersistence},{getFirestore,doc,getDoc,setDoc}]=await Promise.all([
 import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')]);
 const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);await setPersistence(auth,browserLocalPersistence);login.disabled=false;
 login.onclick=async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){say('Sign-in failed: '+(e.code||e.message))}};
 logout.onclick=()=>signOut(auth).catch(e=>say('Sign-out failed: '+e.message));
 onAuthStateChanged(auth,async u=>{user=u;loading=true;login.hidden=!!u;logout.hidden=!u;if(!u){say('Guest mode · Local progress only');loading=false;return}say('Loading your saved progress…');try{
 const owner=localStorage.getItem('academy-progress-owner-v4');const local=owner&&owner!==u.uid?{}:window.AcademyProgress.get();
 const ref=doc(db,'users',u.uid,'academy','progress');const snap=await getDoc(ref);const remote=snap.exists()?(snap.data().links||{}):{};
 // If signing in to a different account, never import that other user's local checks.
 const merged={...remote,...local};window.AcademyProgress.setRemote(merged);localStorage.setItem('academy-progress-owner-v4',u.uid);
 await setDoc(ref,{links:merged,updatedAt:new Date().toISOString()},{merge:true});say('Signed in as '+(u.displayName||u.email)+' · Progress synced');
 }catch(e){say('Signed in, but cloud sync failed: '+e.message)}finally{loading=false}});
}catch(e){say('Firebase unavailable: '+e.message)}
