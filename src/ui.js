import { AuthErrorCodes } from 'firebase/auth';

export const txtEmail = document.querySelector('#txtEmail')
export const txtDisplayName = document.querySelector('#txtDisplayName')
export const txtPassword = document.querySelector('#txtPassword')

export const btnLogin = document.querySelector('#btnLogin')
export const btnSignup = document.querySelector('#btnSignup')

export const btnLogout = document.querySelector('#btnLogout')

export const divAuthState = document.querySelector('#divAuthState')
export const lblAuthState = document.querySelector('#lblAuthState')

export const divLoginError = document.querySelector('#divLoginError')
export const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage')

export const showLoginForm = () => {
	login.style.display = 'block'
	app.style.display = 'none'
}

export const showApp = () => {
	if (document.querySelector('#login')) {
		login.style.display = 'none'
		app.style.display = 'block'
		window.menuLogout.style.display = 'block'
	}
}

export const hideLoginError = () => {
	if (!divLoginError) return;
	divLoginError.style.display = 'none'
	lblLoginErrorMessage.innerHTML = ''
}

export const showLoginError = (error) => {
	if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
		divLoginError.style.display = 'block'
		lblLoginErrorMessage.innerHTML = `Falsches Passwort. Bitte erneut versuchen.`
	} else if (error.code == AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
		divLoginError.style.display = 'block'
		lblLoginErrorMessage.innerHTML = `Falsche Login Daten. Bitte erneut versuchen.`
	} else if (error.code == AuthErrorCodes.USER_NOT_FOUND) {
		divLoginError.style.display = 'block'
		lblLoginErrorMessage.innerHTML = `Benutzer nicht gefunden. Bitte erneut versuchen.`
	} else if (error.code == AuthErrorCodes.EMAIL_ALREADY_IN_USE) {
		divLoginError.style.display = 'block'
		lblLoginErrorMessage.innerHTML = `Email bereits in Verwendung. Bitte erneut versuchen.`
	} else if (error.code) {
		divLoginError.style.display = 'block'
		lblLoginErrorMessage.innerHTML = `Fehler: ${error.message}. Bitte wenden Sie sich an den Administrator.`
	}
	else {
		divLoginError.style.display = 'none'
	}
}

export const showLoginState = (user) => {
	lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
}

hideLoginError()
