export const userStore = {
	currentTheme: localStorage.getItem('color_mode') ? localStorage.getItem('color_mode') : window.matchMedia('(prefers-color-scheme: light)').matches ? "light" : import.meta.env.VITE_APP_DEFAULT_COLOR_MODE,
  currentLanguage: localStorage.getItem('lang') ? localStorage.getItem('lang') : import.meta.env.VITE_APP_DEFAULT_LANGUAGE,
  current_user: null,
};

export const userActions = (getStore, getActions, setStore) => {
  return {
    isAuth: async () => {
      const actions = getActions();
      const getUser = await actions.useFetch(
        import.meta.env.VITE_API_URL,
        "/user/isauth",
        "GET",
        true
      );
      console.log(getUser);
      getUser.status === 200
        ? actions.setCurrentUser(getUser.data, "isAuth")
        : setStore({ current_user: false });
    },
    setCurrentUser: (data, method) => {
      if (method == "login") {
        console.log(data);
        setStore({ current_user: data.user });
        sessionStorage.setItem("authToken", data.access_token);
      } else if (method == "isAuth") setStore({ current_user: data });
    },
    logout: async () => {
      const actions = getActions();
      const res = await actions.useFetch(
        import.meta.env.VITE_API_URL,
        "/user/logout",
        "POST",
        true
      );
      console.log(res);
      res.status === 200 && setStore({ current_user: false });
      sessionStorage.removeItem("authToken");
    },
    getCurrentColorMode: () => {
      return localStorage.getItem("color_mode");
    },
    setColorMode: (color_mode, save) => {
      const rootTag = document.querySelector("html");
			rootTag.setAttribute("data-bs-theme", color_mode);
      if ((color_mode == "dark" || color_mode == "light") && save) {
				localStorage.setItem('color_mode', color_mode)
      }
    },
    getCurrentLanguage: () => {
      return localStorage.getItem("color_mode");
    },
    setLanguage: (lang, save) => {
      setStore({currentLanguage: lang})
      if(save){
        localStorage.setItem('lang', lang)
      }
    },
  };
};
