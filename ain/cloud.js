import {firebaseConfig} from '../aio/firebase-config.js';
const status=document.getElementById('ain-cloud-status');
const say=s=>{if(status)status.textContent=s};
if(!(firebaseConfig.apiKey&&firebaseConfig.authDomain&&firebaseConfig.projectId&&firebaseConfig.appId)){
 say('Local progress only · Sign in from academy after Firebase setup');
}else try{
 const [{initializeApp},{getAuth,onAuthStateChanged,setPersistence,browserLocalPersistence},{getFirestore,doc,getDoc,setDoc}]=await Promise.all([
 import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
 import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
 import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')]);
 const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
 await setPersistence(auth,browserLocalPersistence);
 let user=null,loading=true,queued=false,needsInitialSave=false;
 const ref=uid=>doc(db,'users',uid,'ain','progress');
 async function save(){if(!user||loading)return;try{
  await setDoc(ref(user.uid),{completed:[...completed],mock:mock||null,updatedAt:new Date().toISOString()});say('Google account · AIN progress synced');
 }catch(e){say('AIN cloud save failed: '+e.message)}}
 window.addEventListener('ain-progress-changed',()=>{if(!loading)save();else queued=true});
 onAuthStateChanged(auth,async u=>{
  loading=true;user=u;
  if(!u){say('Guest mode · Sign in on academy homepage to sync');loading=false;return}
  say('Loading AIN progress…');try{
   const prev=localStorage.getItem('ain-progress-owner-v7');
   const snap=await getDoc(ref(u.uid));const remote=snap.exists()?snap.data():null;needsInitialSave=!remote;
   if(remote){completed=new Set(remote.completed||[]);mock=remote.mock||null}
   else if(prev&&prev!==u.uid){completed=new Set();mock=null}
   localStorage.setItem('ain-done-v3',JSON.stringify([...completed]));
   if(mock)localStorage.setItem('ain-mock-v3',JSON.stringify(mock));else localStorage.removeItem('ain-mock-v3');
   localStorage.setItem('ain-progress-owner-v7',u.uid);
   render();say('Signed in as '+(u.displayName||u.email)+' · AIN progress loaded');
  }catch(e){say('AIN cloud load failed: '+e.message)}finally{loading=false;if(queued||needsInitialSave){queued=false;needsInitialSave=false;await save()} }
 });
}catch(e){say('AIN Firebase initialization failed: '+e.message)}
