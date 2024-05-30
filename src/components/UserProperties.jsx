/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react'
import { Context } from "../context/appContext";
import enUsFlag from "../icons/flags/en_US.svg";
import esEsFlag from "../icons/flags/es_ES.svg";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

const UserProperties = () => {
    const { store, actions } = useContext(Context)

    const [theme, setTheme] = useState(store.currentTheme)
    const [lang, setLang] = useState(store.currentLanguage)
    const [txt, setTxt] = useState()

    useEffect(() => {
        actions.setTheme(theme)
    }, [theme])

    useEffect(() => {
        actions.setLanguage(lang) 
    }, [lang])

    useEffect(() => {
        const loadLanguage = async () => {
            try {
              setTxt(
                await import(
                  `./lang/${store.currentLanguage}/UserProperties.${store.currentLanguage}.json`
                )
              );
            } catch (error) {
              setTxt(await import(`./lang/${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}/UserProperties.${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}.json"`));
            }
        };
        loadLanguage();
      }, [store.currentLanguage])
    
    return (
        <>
            {/* Start toggle color mode & language */}
            <Dropdown className="position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle" 
                drop='up'>
                <Dropdown.Toggle className='btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center' 
                    id="bd-theme"
                    title={txt?.manageProperties}
                    aria-expanded="false">
                    <i className={store.currentTheme === "light" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill"}></i>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="fade">
                    <Dropdown.Item className={`d-flex align-items-center ${theme !== "light" && 'opacity-25'}`} title={txt?.tooltipLight} data-bs-theme-value="light" aria-pressed="false" onClick={(e) => {
                        e.stopPropagation()
                        setTheme('light')
                    }}>
                        <i className="bi bi-sun-fill me-2 opacity-50 theme-icon" width="1em" height="1em"></i>
                        {txt?.themeLight}
                    </Dropdown.Item>
                    <Dropdown.Item className={`d-flex align-items-center ${theme !== "dark" && 'opacity-25'}`} title={txt?.tooltipDark} data-bs-theme-value="dark" aria-pressed="false" onClick={(e) => {
                        e.stopPropagation()
                        setTheme('dark')
                    }}>
                        <i className="bi bi-moon-stars-fill me-2 opacity-50 theme-icon" width="1em" height="1em"></i>
                        {txt?.themeDark}
                    </Dropdown.Item>
                    <Dropdown.Item className='d-flex py-1 justify-content-center' onClick={(e) => e.stopPropagation()}>
                        <Button variant='none' className={lang !== "en_US" && 'opacity-25'} title={txt?.tooltipEn} onClick={() => setLang('en_US')}>
                            <img src={enUsFlag} width="30px" alt="United States flag" />
                        </Button>
                        <Button variant='none' className={lang !== "es_ES" && 'opacity-25'} title={txt?.tooltipEs} onClick={() => setLang('es_ES')}>
                            <img src={esEsFlag} width="30px" alt="Spain flag" />
                        </Button>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            {/* End toggle color mode & language */}
        </>
    )
}

export default UserProperties