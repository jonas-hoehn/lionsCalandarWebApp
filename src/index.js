// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
	getAuth,
	onAuthStateChanged,
	signOut,
	createUserWithEmailAndPassword,
	updateProfile,
	signInWithEmailAndPassword,
	connectAuthEmulator
} from 'firebase/auth';

import {
	hideLoginError,
	showLoginState,
	showLoginForm,
	showApp,
	showLoginError,
	btnLogin,
	btnSignup,
	btnLogout
} from './ui'

import { getDatabase, ref, get, set , remove, child, onValue, query, startAt, endBefore, orderByChild} from "firebase/database";
import {onChildAdded} from "@firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web firebaseApp's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBgEEkQd3bE8QGX2EfD6099uJkbkR8DDOo",
	authDomain: "lions-edeka-adventskalender.firebaseapp.com",
	databaseURL: "https://lions-edeka-adventskalender-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "lions-edeka-adventskalender",
	storageBucket: "lions-edeka-adventskalender.appspot.com",
	messagingSenderId: "635445440186",
	appId: "1:635445440186:web:4c44f1f66710106bb4dc83",
	measurementId: "G-0E3S3SWGZJ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
const databaseScans="calendar-scans/";
const databaseUsers="users/";
const dbRef = ref(database, databaseScans);
const dbUserRef = ref(database, databaseUsers);
let role="";

var lastKeyAdded = 0
onChildAdded(dbRef, (snapshot) => {
	//const data = snapshot.val();
	lastKeyAdded = snapshot.key;
});

const updateSnapshotQuery = query(
	ref(database, databaseScans),
	orderByChild("timestamp")
);

function addTH(parent, content) {
	const th = document.createElement('th')
	th.textContent = content
	th.scope = "col"
	parent.appendChild(th)
	return th
}

function addTD(parent, content) {
	var td = document.createElement("td")
	td.textContent = content
	parent.appendChild(td)
	return td
}

function updateScanSnapshot(snapshot) {
	var table = document.getElementById('scans')
	if (table) {
		table.remove()
		table = document.createElement("table")
		table.id = 'scans'
		const tableHeader = document.createElement("thead")
		table.appendChild(tableHeader)
		const tr = document.createElement("tr")
		tableHeader.appendChild(tr)
		addTH(tr, '#');
		addTH(tr, 'Nummer');
		addTH(tr, 'Scan Datum');
		addTH(tr, 'Kassierer');
		if (role === 'admin') {
			addTH(tr, 'Action');
		}

		document.getElementById("scans-table-holder").appendChild(table)
	}
	const tbody = document.createElement("tbody")
	table.appendChild(tbody)
	table.setAttribute("aria-busy", "true")
	// const reversedData = Object.entries(snapshot).reverse().map(([key, value]) => ({ key, value }));
	var counter = 1
	snapshot.forEach(child => {
		const tr = document.createElement('tr')
		const th = addTH(tr, String(counter++));
		th.scope = "row"
		addTD(tr, child.key);
		if (() => limitedScans("","") === lastKeyAdded) {
			tr.style.backgroundColor = '#ffe396';
		}
		addTD(tr, child.val().date + " " + child.val().time);
		addTD(tr, child.val().cashier);
		if (role === 'admin') {
			const button = document.createElement("button")
			button.textContent = "löschen"
			button.className = 'loeschenButton'
			var td = document.createElement("td")
			button.addEventListener("click", () => deleteScan(child.key))
			td.appendChild(button)
			tr.appendChild(td)
		}
		tbody.appendChild(tr)
	})
	table.removeAttribute("aria-busy")
}

const names = ["stefan", "jonas","justo", "helmut", "enrico", "philipp"]
export function testScan() {
	let day = Math.floor(Math.random() * 9) +1 ;
	let formattedDay = day < 10 ? '0' + day : day.toString();
	let month = Math.floor(Math.random() * 1) +1;
	let formattedMonth = month < 10 ? '0' + month : month.toString();
	let hour = Math.floor(Math.random() * 24);
	let formattedHour = hour < 10 ? '0' + hour : hour.toString();
	let minute = Math.floor(Math.random() * 60);
	let formattedMinute = minute < 10 ? '0' + minute : minute.toString();
	let second = Math.floor(Math.random() * 60);
	let formattedSecond = second < 10 ? '0' + second : second.toString();

	writeCalendarScan(Math.floor(Math.random() * 10000),
		`${formattedDay}.${formattedMonth}.2024`,
		`${formattedHour}:${formattedMinute}:${formattedSecond}`,
		names[Math.floor(Math.random() * names.length)])
}

function writeCalendarScan(nummer,datum,uhrzeit,kassierer){
	const reference=`${databaseScans}${nummer}`
	const dbRef=ref(database,reference);
	const timestamp = convertDateTimeToUnixTimestamp(`${datum} ${uhrzeit}`);
	set(dbRef,{date:datum,time:uhrzeit,timestamp: timestamp, cashier:kassierer})
}

// takes the format "DD.MM.YYYY HH24:MM:SS"
function parseGermanDate(dateString) {
	const parts = dateString.split(/\.|\s|:|T/);
	const day = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10) - 1; // Months are zero-indexed (January = 0)
	const year = parseInt(parts[2], 10);
	const hour = parseInt(parts[3], 10);
	const minute = parseInt(parts[4], 10);
	const second = parseInt(parts[5], 10) || 0; // Optional seconds

	// Create a new Date object
	const date = new Date(year, month, day, hour, minute, second);

	// Return the Date object
	return date;
}

function convertDateTimeToUnixTimestamp(dateTimeString) {
	// requires the format "2023-11-23T12:34:56Z"
	const unixTimestamp = parseGermanDate(dateTimeString).getTime();
	return unixTimestamp;
}

window.testScan=testScan

// window._1 = () => limitedScans("","")
// window._1 = function() {limitedScans("","")}

function limitedScans(startDate, endDate) {
	const databaseRef = ref(database, databaseScans)
	const queryRef = query(
		databaseRef,
		orderByChild("timestamp"),
		startAt(startDate),
		endBefore(endDate)
	);

	var table = document.getElementById('scans')
	if (table) {
		table.remove()
		table = document.createElement("table")
		table.id = 'scans'
		document.getElementById("scans-table-holder").appendChild(table)
	}

	onValue(queryRef, (snapshot) => {
		updateScanSnapshot(snapshot)
	});
}
window.limitedScans = limitedScans


const loginEmailPassword = async () => {
	const loginEmail = txtEmail.value
	const loginPassword = txtPassword.value

	try {
	   await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
	 }
	 catch(error) {
	   console.log(`There was an error: ${error}`)
	   showLoginError(error)
	 }
}

// Create new account using email/password
const createAccount = async () => {
	const email = txtEmail.value
	const password = txtPassword.value
	const displayName = txtDisplayName.value

	try {
		await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
			// User created successfully
			const user = userCredential.user;

			// Now, update the user's profile to set the display name
			updateProfile(user, {
				displayName: displayName
			}).then(() => {
				// Profile updated successfully
				console.log("User created with display name: " + displayName);
			}).catch((error) => {
				// An error occurred while updating the profile
				console.error("Error updating display name: ", error);
			});
		})
			.catch((error) => {
				// An error occurred during user creation
				console.error("Error creating user: ", error);
			});
	}
	catch(error) {
		console.log(`There was an error: ${error}`)
		showLoginError(error)
	}
}


const monitorAuthState = async () => {
	onAuthStateChanged(auth, user => {
		if (user) {
			const uid = user.uid;

			get(child(dbUserRef, `${uid}`)).then((snapshot) => {
				if (snapshot.exists()) {
					const userData = snapshot.val();
					role = userData.role;
					if (role === 'admin') {
						// Provide admin access
						console.log('Admin logged in - only admins can write to the db which is check on firebase side - sorry guys...');
					} else {
						// Provide normal user access
						console.log('User logged in');
					}
					window.menuDisplayName.innerHTML=userData.displayName
					onValue(updateSnapshotQuery, (snapshot) => {
						updateScanSnapshot(snapshot);
					})
				} else {
					console.log('No user data found');
				}
			}).catch((error) => {
				console.error('Error fetching user data:', error);
			});
			console.log(user)
			showApp()
			hideLoginError()
		}
		else {
			showLoginForm()
			window.menuDisplayName.innerHTML=""
			//lblAuthState.innerHTML = `You're not logged in.`
		}

	})
}


// Log out
const logout = async () => {
	await signOut(auth);
}



btnLogin.addEventListener("click", loginEmailPassword)
btnSignup.addEventListener("click", createAccount)
window.menuLogout.addEventListener("click", logout)


//connectAuthEmulator(auth, "http://localhost:9099");

monitorAuthState();

const keyQuestion = document.getElementById('deleteKeyQuestion')
const modal = document.getElementById('customModal');
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');

function deleteScan(key)  {

	keyQuestion.textContent = `Möchten Sie den Kalendereintrag ${key} wirklich löschen?`
	keyQuestion.setAttribute('key', key)
	modal.style.display = 'block';
	noBtn.focus();
}

noBtn.onclick = function() {
	modal.style.display = 'none';
	alert("Der Eintrag wurde nicht entfernt.");
}

yesBtn.onclick = function() {
	modal.style.display = 'none';
	const key = keyQuestion.getAttribute('key')
	console.info(`Deleting ${key} ...`)
	const deleteRef = ref(database, databaseScans+ key)
	remove(deleteRef)
		.then(() => {
			alert(`Eintrag ${key} wurde gelöscht`);
		})
		.catch((error) => {
			alert(`Eintrag ${key} konnte nicht gelöscht werden:`, error);
		});
}

// Close the modal if clicked outside of the content
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = 'none';
	}
}
