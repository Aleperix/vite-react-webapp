import { useContext, useEffect, useState } from 'react'
import { Context } from "../context/appContext";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useFormik } from "formik"
import * as yup from "yup"

export const SearchBar = () => {
	const { store } = useContext(Context)

    const [txt, setTxt] = useState()


	const searchForm = useFormik({
		initialValues: {search: ''},
		validationSchema: yup.object({
			search: yup.string()
				.required(),
		}),
		onSubmit: () => handleSubmit()
	})

	const handleSubmit = () => {
		console.log('Bien');
	}

	useEffect(() => {
        const loadLanguage = async () => {
            try {
              setTxt(
                await import(
                  `./lang/${store.currentLanguage}/SearchBar.${store.currentLanguage}.json`
                )
              );
            } catch (error) {
              setTxt(await import(`./lang/${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}/SearchBar.${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}.json"`));
            }
        };
        loadLanguage();
      }, [store.currentLanguage])

  return (
    <Form className="d-flex w-100 justify-content-md-center">
        <InputGroup>
            <Form.Control
				name='search'
				className={searchForm.errors.search && searchForm.touched.search && searchForm.submitCount > 0 && "border border-danger bg-danger bg-opacity-10"}
				value={searchForm.values.search}
                type="search"
                placeholder={txt?.searchInput}
                aria-label="Search"
				onChange={searchForm.handleChange}
				onBlur={searchForm.handleBlur}
            />
            <Button variant="outline-success" type="submit" onClick={searchForm.handleSubmit}><i className="bi bi-search"></i> {txt?.searchButton}</Button>
        </InputGroup>
    </Form>
  )
}
