import {firebaseConfig} from './aio/firebase-config.js';
const status=document.getElementById('cloud-status'),login=document.getElementById('cloud-login'),logout=document.getElementById('cloud-logout');
const ready=Boolean(firebaseConfig.apiKey&&firebaseConfig.authDomain&&firebaseConfig.projectId&&firebaseConfig.appId);
let auth=null,db=null,user=null,loading=true,storage=null;
const CERT_CODES=['NCA-AIIO','NCP-AII','NCA-APC','NCP-ARI','NCP-AIN','NCP-AIO'];
let badges={},badgeBusy=false,badgeMessage='';
const safe=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const updateBadges=()=>window.dispatchEvent(new Event('academy-badges-changed'));
const badgeRef=(uid,code)=>doc(db,'users',uid,'certifications',code);
const storagePath=(uid,code)=>`users/${uid}/certifications/${code}/evidence`;
const showBadgeMessage=message=>{badgeMessage=message;updateBadges()};
const badgesApi={
 html(code){if(!CERT_CODES.includes(code))return '';const b=badges[code];const disabled=badgeBusy?'disabled':'';const note=badgeMessage?`<p class="badge-message" role="status">${safe(badgeMessage)}</p>`:'';if(!user)return `<section class="badge-panel"><b>Upload Certification or Badge</b><p class="muted">Sign in with Google to upload and save your certificate.</p>${note}</section>`;return `<section class="badge-panel">${b?`<strong class="cert-earned">${safe(code)} Certified!</strong><small>Self-reported · Uploaded, not independently verified</small><p class="badge-file">${safe(b.fileName||'Certification evidence')}</p><div class="badge-controls"><button type="button" ${disabled} onclick="AcademyBadges.view('${code}')">View</button><button type="button" ${disabled} onclick="AcademyBadges.remove('${code}')">Remove</button></div>`:`<strong>Upload your Certification or Badge!</strong><small>PDF, PNG, or JPG · maximum 5 MB</small>`}<label class="badge-upload-label">${b?'Replace badge':'Choose file'}<input id="cert-upload-input" type="file" accept="application/pdf,image/png,image/jpeg" ${disabled} aria-label="Upload ${safe(code)} certification"></label>${note}</section>`},
 async upload(code,file){if(!user||badgeBusy||!CERT_CODES.includes(code))return;if(!['application/pdf','image/png','image/jpeg'].includes(file.type)||file.size>5*1024*1024||file.size===0){showBadgeMessage('Choose a PDF, PNG, or JPG file smaller than 5 MB.');return}const uid=user.uid;badgeBusy=true;showBadgeMessage('Uploading certification…');try{const ref=storageRef(storage,storagePath(uid,code));await uploadBytes(ref,file,{contentType:file.type});if(auth.currentUser?.uid!==uid)throw Error('Account changed during upload. Please sign in again.');const metadata={fileName:file.name,contentType:file.type,size:file.size,uploadedAt:new Date().toISOString(),selfReported:true};await setDoc(badgeRef(uid,code),metadata);badges[code]=metadata;showBadgeMessage('Certification saved to your Google account.')}catch(e){showBadgeMessage('Upload failed: '+(e.code||e.message))}finally{badgeBusy=false;updateBadges()}},
 async view(code){if(!user||!badges[code])return;try{const url=await getDownloadURL(storageRef(storage,storagePath(user.uid,code)));window.open(url,'_blank','noopener,noreferrer')}catch(e){showBadgeMessage('Could not open file: '+(e.code||e.message))}},
 async remove(code){if(!user||!badges[code]||badgeBusy||!confirm('Remove this certification and its uploaded file?'))return;badgeBusy=true;showBadgeMessage('Removing certification…');try{await deleteObject(storageRef(storage,storagePath(user.uid,code)));await deleteDoc(badgeRef(user.uid,code));delete badges[code];showBadgeMessage('Certification removed.')}catch(e){showBadgeMessage('Removal failed: '+(e.code||e.message))}finally{badgeBusy=false;updateBadges()}}
};window.AcademyBadges=badgesApi;
let storageRef,uploadBytes,getDownloadURL,deleteObject,deleteDoc,doc,setDoc,getDoc;
const say=s=>{status.textContent=s};
const api={save:async data=>{if(!user||loading)return;try{const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js');await setDoc(doc(db,'users',user.uid,'academy','progress'),{links:data,updatedAt:new Date().toISOString()},{merge:true});say('Signed in · Progress saved')}catch(e){say('Cloud save failed: '+e.message)}}};window.AcademyCloud=api;
if(!ready){say('Google sign-in not configured. See SETUP-GOOGLE-LOGIN.md. Progress saves on this device only.');}
else try{
 const [{initializeApp},{getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,setPersistence,browserLocalPersistence},{getFirestore,doc:fireDoc,getDoc:fireGetDoc,setDoc:fireSetDoc,deleteDoc:fireDeleteDoc},{getStorage,ref:refStorage,uploadBytes:uploadFile,getDownloadURL:getFileURL,deleteObject:deleteFile}]=await Promise.all([
 import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js')]);
 const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);storage=getStorage(app);storageRef=refStorage;uploadBytes=uploadFile;getDownloadURL=getFileURL;deleteObject=deleteFile;doc=fireDoc;getDoc=fireGetDoc;setDoc=fireSetDoc;deleteDoc=fireDeleteDoc;await setPersistence(auth,browserLocalPersistence);login.disabled=false;
 login.onclick=async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){say('Sign-in failed: '+(e.code||e.message))}};
 logout.onclick=()=>signOut(auth).catch(e=>say('Sign-out failed: '+e.message));
 onAuthStateChanged(auth,async u=>{user=u;badges={};badgeMessage='';updateBadges();loading=true;login.hidden=!!u;logout.hidden=!u;if(!u){say('Guest mode · Local progress only');loading=false;return}say('Loading your saved progress…');try{
 const certResults=await Promise.all(CERT_CODES.map(async code=>{const snap=await getDoc(badgeRef(u.uid,code));return [code,snap.exists()?snap.data():null]}));if(auth.currentUser?.uid!==u.uid)return;badges=Object.fromEntries(certResults.filter(([,data])=>data));updateBadges();
 const owner=localStorage.getItem('academy-progress-owner-v4');const local=owner&&owner!==u.uid?{}:window.AcademyProgress.get();
 const ref=doc(db,'users',u.uid,'academy','progress');const snap=await getDoc(ref);const remote=snap.exists()?(snap.data().links||{}):{};
 // If signing in to a different account, never import that other user's local checks.
 const merged={...remote,...local};window.AcademyProgress.setRemote(merged);localStorage.setItem('academy-progress-owner-v4',u.uid);
 await setDoc(ref,{links:merged,updatedAt:new Date().toISOString()},{merge:true});say('Signed in as '+(u.displayName||u.email)+' · Progress synced');
 }catch(e){say('Signed in, but cloud sync failed: '+e.message)}finally{loading=false}});
}catch(e){say('Firebase unavailable: '+e.message)}
