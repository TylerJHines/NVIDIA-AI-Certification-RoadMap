import {firebaseConfig} from './aio/firebase-config.js';
const status=document.getElementById('cloud-status'),login=document.getElementById('cloud-login'),logout=document.getElementById('cloud-logout');
const ready=Boolean(firebaseConfig.apiKey&&firebaseConfig.authDomain&&firebaseConfig.projectId&&firebaseConfig.appId);
let auth=null,db=null,user=null,loading=true;
const CERT_CODES=['NCA-AIIO','NCP-AII','NCA-APC','NCP-ARI','NCP-AIN','NCP-AIO'];
let badges={},badgeBusy=false,badgeMessage='';
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const updateBadges=()=>window.dispatchEvent(new Event('academy-badges-changed'));
const badgeRef=(uid,code)=>doc(db,'users',uid,'certifications',code);
const showBadgeMessage=message=>{badgeMessage=message;updateBadges()};
function validBadgeUrl(raw){
 try {const u=new URL(raw.trim());if(u.protocol!=='https:')return null;
  const host=u.hostname.toLowerCase();
  if(!['credly.com','www.credly.com','nvidia.com','www.nvidia.com','learn.nvidia.com','certification.nvidia.com','credential.nvidia.com'].includes(host))return null;
  if(u.username||u.password)return null;
  return u.href;
 }catch{return null}
}
const badgesApi={
 html(code){if(!CERT_CODES.includes(code))return '';const b=badges[code],disabled=badgeBusy?'disabled':'';
  const note=badgeMessage?`<p class="badge-message" role="status">${safe(badgeMessage)}</p>`:'';
  if(!user)return `<section class="badge-panel"><strong>Add Certification Badge URL</strong><small>Sign in with Google to save your badge link across devices.</small>${note}</section>`;
  return `<section class="badge-panel">${b?`<strong class="cert-earned">${safe(code)} Certified!</strong><small>Self-reported · Badge link not independently verified</small><div class="badge-controls"><a class="btn" href="${safe(b.url)}" target="_blank" rel="noopener noreferrer">View badge ↗</a><button type="button" ${disabled} onclick="AcademyBadges.remove('${code}')">Remove</button></div>`:'<strong>Add Certification Badge URL</strong><small>Paste your public Credly or NVIDIA badge link.</small>'}<form class="badge-url-form" onsubmit="event.preventDefault();AcademyBadges.save('${code}',this.elements.badgeUrl.value)"><label for="badge-url-input-${safe(code)}">${b?'Update badge link':'Badge URL'}</label><input id="badge-url-input-${safe(code)}" name="badgeUrl" type="url" required placeholder="https://credential.nvidia.com/..." value="${safe(b?.url||'')}" ${disabled}><button type="submit" ${disabled}>${b?'Update badge':'Save badge'}</button></form>${note}</section>`;
 },
 async save(code,raw){if(!user||badgeBusy||!CERT_CODES.includes(code))return;const url=validBadgeUrl(raw);if(!url){showBadgeMessage('Enter a valid HTTPS badge URL from Credly or NVIDIA (including credential.nvidia.com).');return}
  const uid=user.uid;badgeBusy=true;showBadgeMessage('Saving badge link…');try{const record={url,selfReported:true,updatedAt:new Date().toISOString()};await setDoc(badgeRef(uid,code),record);if(auth.currentUser?.uid!==uid)return;badges[code]=record;showBadgeMessage('Badge link saved to your Google account.')}catch(e){showBadgeMessage('Save failed: '+(e.code||e.message))}finally{badgeBusy=false;updateBadges()}
 },
 async remove(code){if(!user||!badges[code]||badgeBusy||!confirm('Remove this badge link?'))return;const uid=user.uid;badgeBusy=true;showBadgeMessage('Removing badge link…');try{await deleteDoc(badgeRef(uid,code));if(auth.currentUser?.uid!==uid)return;delete badges[code];showBadgeMessage('Badge link removed.')}catch(e){showBadgeMessage('Removal failed: '+(e.code||e.message))}finally{badgeBusy=false;updateBadges()}}
};window.AcademyBadges=badgesApi;
let deleteDoc,doc,setDoc,getDoc;
const say=s=>{status.textContent=s};
const api={save:async data=>{if(!user||loading)return;try{const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js');await setDoc(doc(db,'users',user.uid,'academy','progress'),{links:data,updatedAt:new Date().toISOString()},{merge:true});say('Signed in · Progress saved')}catch(e){say('Cloud save failed: '+e.message)}}};window.AcademyCloud=api;
if(!ready){say('Google sign-in not configured. See SETUP-GOOGLE-LOGIN.md. Progress saves on this device only.');}
else try{
 const [{initializeApp},{getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,setPersistence,browserLocalPersistence},{getFirestore,doc:fireDoc,getDoc:fireGetDoc,setDoc:fireSetDoc,deleteDoc:fireDeleteDoc}]=await Promise.all([
 import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')]);
 const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);doc=fireDoc;getDoc=fireGetDoc;setDoc=fireSetDoc;deleteDoc=fireDeleteDoc;await setPersistence(auth,browserLocalPersistence);login.disabled=false;
 login.onclick=async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){say('Sign-in failed: '+(e.code||e.message))}};
 logout.onclick=()=>signOut(auth).catch(e=>say('Sign-out failed: '+e.message));
 onAuthStateChanged(auth,async u=>{user=u;badges={};badgeMessage='';updateBadges();loading=true;login.hidden=!!u;logout.hidden=!u;if(!u){say('Guest mode · Local progress only');loading=false;return}say('Loading your saved progress…');try{
 try {const certResults=await Promise.all(CERT_CODES.map(async code=>{const snap=await getDoc(badgeRef(u.uid,code));return [code,snap.exists()?snap.data():null]}));if(auth.currentUser?.uid!==u.uid)return;badges=Object.fromEntries(certResults.filter(([,data])=>data));updateBadges();}catch(badgeError){showBadgeMessage('Badge sync unavailable: '+(badgeError.code||badgeError.message)+'. Check Firestore certification rules.');}
 const owner=localStorage.getItem('academy-progress-owner-v4');const local=owner&&owner!==u.uid?{}:window.AcademyProgress.get();
 const ref=doc(db,'users',u.uid,'academy','progress');const snap=await getDoc(ref);const remote=snap.exists()?(snap.data().links||{}):{};
 // If signing in to a different account, never import that other user's local checks.
 const merged={...remote,...local};window.AcademyProgress.setRemote(merged);localStorage.setItem('academy-progress-owner-v4',u.uid);
 await setDoc(ref,{links:merged,updatedAt:new Date().toISOString()},{merge:true});say('Signed in as '+(u.displayName||u.email)+' · Progress synced');
 }catch(e){say('Signed in, but cloud sync failed: '+e.message)}finally{loading=false}});
}catch(e){say('Firebase unavailable: '+e.message)}
