import { userStore, userActions } from "./categories/users";
const getState = ({ getStore, getActions, setStore }) => {
    const store = {
		//Start import categories
		...userStore,
		//Finish Import categories
		currentTheme: localStorage.getItem('theme') ? localStorage.getItem('theme') : window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light",
		currentLanguage: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en_US',
        counter: 0,
    }

    const actions = {
		//Start import categories
		...userActions(getStore, getActions, setStore),
		//Finish import categories
        setCounter: () => {
			const store = getStore();
			setStore({counter: store.counter + 1})
		},
		setTheme: (theme) => {
			document.querySelector("html").setAttribute("data-bs-theme", theme)
			localStorage.setItem('theme', theme)
			setStore({currentTheme: theme})
		},
		setLanguage: (lang) => {
			localStorage.setItem('lang', lang)
			setStore({currentLanguage: lang})
		},
		useFetch: async (url, endpoint, method, isPrivate, body, format) => {
			if (format == "json"){
				body = JSON.stringify(body)
				format = {"Content-Type": "application/json"}
			}else if(format == "formData"){
				const formData = new FormData()
				for (const key in body) formData.append(key, body[key])
				body = formData
				format = undefined
			}
			const requestOptions = {
				method: method,
				headers: {
					...(method != "GET" && format),
					...(isPrivate && {"Authorization": "Bearer "+sessionStorage.getItem("authToken")}),
					redirect: 'follow'
				},
				...(method != "GET" && {body: body}),
			}
			try {
				const promise = await fetch(url+endpoint, requestOptions)
				const res = await promise.json()
				return {data: res, status: promise.status};
			} catch (error) {
				return {error: true}
			}
		},
    }

	// Returns context
    return {store, actions}
};

export default getState;