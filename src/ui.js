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
	login.style.display = 'none'
	app.style.display = 'block'
	window.menuLogout.style.display = 'block'
}

export const hideLoginError = () => {
	divLoginError.style.display = 'none'
	lblLoginErrorMessage.innerHTML = ''
}

export const showLoginError = (error) => {
	if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
		divLoginError.style.display = 'block'
		lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`
	}
	else {
		divLoginError.style.display = 'none'
	}
}

export const showLoginState = (user) => {
	lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
}

hideLoginError()
