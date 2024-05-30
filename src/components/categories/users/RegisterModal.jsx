import PropTypes from "prop-types";
import { Modal } from "@/components/Modal"
import { Form } from "react-bootstrap"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect, useContext } from "react";
import { Context } from "@/context/appContext";
import { useFormik } from "formik"
import * as yup from "yup"
import Swal from 'sweetalert2'
import countries from '@/assets/countries.json'

export const RegisterModal = (props) => {
	const {store, actions} = useContext(Context)
	const [txt, setTxt] = useState()

	const [success, setSuccess] = useState(false)
	const [selectedCountry, setSelectedCountry] = useState({})


	const registerForm = useFormik({
		initialValues: {username: '', email: '', confirmEmail: '', firstName: '', lastName: '', password: '', confirmPassword: '', country: '', state: ''},
		validationSchema: yup.object({
			username: yup.string()
				.required(txt?.errors.required),
			email: yup.string()
				.required(txt?.errors.required),
			confirmEmail: yup.string()
				.oneOf([yup.ref('email'), null], txt?.errors.confirmEmail)
				.required(txt?.errors.required),
			firstName: yup.string()
				.required(txt?.errors.required),
			lastName: yup.string()
				.required(txt?.errors.required),
			password: yup.string()
				.min(4, txt?.errors.passwordTooShort)
				.required(txt?.errors.required),
			confirmPassword: yup.string()
				.oneOf([yup.ref('password'), null], txt?.errors.confirmPassword)
				.required(txt?.errors.required),
			country: yup.string()
				.required(txt?.errors.required),
			state: yup.string()
				.required(txt?.errors.required),
		}),
		onSubmit: () => handleSubmit()
	})

	const handleSubmit = async () => {
		const values = {
			username: registerForm.values.username,
			email: registerForm.values.email,
			first_name: registerForm.values.firstName,
			last_name: registerForm.values.lastName,
			password: registerForm.values.password,
			country: {"name": countries.find(country => country.code2 === registerForm.values.country)["name"], "abbreviation": registerForm.values.country},
			state: {"name": selectedCountry.states.find(state => state.code === registerForm.values.state)["name"], "abbreviation": registerForm.values.state},
		}
		let res = await actions.useFetch(import.meta.env.VITE_API_URL, '/user', 'POST', false, values, "json")
		if(res.status == 200){
			setSuccess(true)
			Swal.fire({
				title: `${txt?.success.title}!`,
				text: `${txt?.success.user} ${registerForm.values.username} ${txt?.success.created}!`,
				icon: "success",
				timer: 2000,
				customClass: {
					popup: 'bg-'+store.currentTheme
				},
				showConfirmButton: false
			})
			registerForm.resetForm()
			setTimeout(() => {
				props.onHide()
				setSuccess(false)
			}, 2000)
		} else {
            console.log(res);
            Swal.fire({
                title: txt?.errors.title+"!",
                text: txt?.errors.unexpected,
                icon: "error",
                timer: 3000,
                customClass: {
                    popup: 'bg-'+store.currentTheme
                },
                showConfirmButton: false
            })
        }
	}

	useEffect(() => {
        const loadLanguage = async () => {
            try {
              setTxt(
                await import(
                  `./lang/${store.currentLanguage}/RegisterModal.${store.currentLanguage}.json`
                )
              );
            } catch (error) {
              setTxt(await import(`./lang/${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}/RegisterModal.${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}.json"`));
            }
        };
        loadLanguage();
	}, [store.currentLanguage])

	useEffect(() => {
        registerForm.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txt])
	useEffect(() => {
        setSelectedCountry(countries.find(country => country.code2 === registerForm.values.country))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerForm.values.country])

	
	return (
		!success && store.current_user == false &&
		<Modal 
			title={txt?.registerTitle}
			show={props.show} 
			onHide={props.onHide} 
			onSubmit={registerForm.handleSubmit}
			onKeyDown={((e) =>  e.key == "Enter" && registerForm.handleSubmit())}
			close={txt?.closeButton}
			submit={txt?.submitButton}
			cancelindex={10}
			submitindex={11}
			>
					<Form>
						<Row>
							<Col md>
								<Form.Group className="mb-3" controlId="registerForm.usernameInput">
									<Form.Label className="d-flex justify-content-between text-info">{txt?.label.username}: {registerForm.errors.username && registerForm.touched.username && <small className="text-danger">{registerForm.errors.username}</small>}</Form.Label>
									<Form.Control tabIndex={1} name="username" value={registerForm.values.username} className={registerForm.errors.username && registerForm.touched.username ? "py-3 mb-3 border border-danger bg-danger bg-opacity-10" : "py-3 mb-3"} type="username" placeholder={txt?.input.username} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur} autoFocus/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col md>
								<Form.Group className="mb-3" controlId="registerForm.emailInput">
									<Form.Label className="d-flex justify-content-between text-info">{txt?.label.email}: {registerForm.errors.email && registerForm.touched.email && <small className="text-danger">{registerForm.errors.email}</small>}</Form.Label>
									<Form.Control tabIndex={2} name="email" value={registerForm.values.email} className={registerForm.errors.email && registerForm.touched.email ? "py-3 mb-3 border border-danger bg-danger bg-opacity-10" : "py-3 mb-3"} type="email" placeholder={txt?.input.email} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur}/>
								</Form.Group>
							</Col>
							<Col md>
								<Form.Group className="mb-3" controlId="registerForm.confirmEmailInput">
									<Form.Label className="d-flex justify-content-between text-info">{txt?.label.confirmEmail}: {registerForm.errors.confirmEmail && registerForm.touched.confirmEmail && <small className="text-danger">{registerForm.errors.confirmEmail}</small>}</Form.Label>
									<Form.Control tabIndex={3} name="confirmEmail" value={registerForm.values.confirmEmail} className={registerForm.errors.confirmEmail && registerForm.touched.confirmEmail ? "py-3 mb-3 border border-danger bg-danger bg-opacity-10" : "py-3 mb-3"} type="email" placeholder={txt?.input.email} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur}/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col md>
								<Form.Group className="mb-3" controlId="registerForm.firstNameInput">
									<Form.Label className="d-flex justify-content-between text-info">{txt?.label.firstName}: {registerForm.errors.firstName && registerForm.touched.firstName && <small className="text-danger">{registerForm.errors.firstName}</small>}</Form.Label>
									<Form.Control tabIndex={4} name="firstName" value={registerForm.values.firstName} className={registerForm.errors.firstName && registerForm.touched.firstName ? "py-3 mb-3 border border-danger bg-danger bg-opacity-10" : "py-3 mb-3"} type="firstname" placeholder={txt?.input.firstName} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur}/>
								</Form.Group>
							</Col>
							<Col md>
								<Form.Group className="mb-3" controlId="registerForm.lastNameInput">
									<Form.Label className="d-flex justify-content-between text-info">{txt?.label.lastName}: {registerForm.errors.lastName && registerForm.touched.lastName && <small className="text-danger">{registerForm.errors.lastName}</small>}</Form.Label>
									<Form.Control tabIndex={5} name="lastName" value={registerForm.values.lastName} className={registerForm.errors.lastName && registerForm.touched.lastName ? "py-3 mb-3 border border-danger bg-danger bg-opacity-10" : "py-3 mb-3"} type="lastname" placeholder={txt?.input.lastName} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur}/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col md>
								<Form.Group className="mb-3" controlId="registerForm.passwordInput">
									<Form.Label className="d-flex justify-content-between text-info">{txt?.label.password}: {registerForm.errors.password && registerForm.touched.password && <small className="text-danger">{registerForm.errors.password}</small>}</Form.Label>
									<Form.Control tabIndex={6} name="password" value={registerForm.values.password} className={registerForm.errors.password && registerForm.touched.password ? "py-3 border border-danger bg-danger bg-opacity-10" : "py-3"} type="password" placeholder={txt?.input.password} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur}/>
								</Form.Group>
							</Col>
							<Col md>
								<Form.Group className="mb-3" controlId="registerForm.confirmPasswordInput">
									<Form.Label className="d-flex justify-content-between text-info">{txt?.label.confirmPassword}: {registerForm.errors.confirmPassword && registerForm.touched.confirmPassword && <small className="text-danger">{registerForm.errors.confirmPassword}</small>}</Form.Label>
									<Form.Control tabIndex={7} name="confirmPassword" value={registerForm.values.confirmPassword} className={registerForm.errors.confirmPassword && registerForm.touched.confirmPassword ? "py-3 border border-danger bg-danger bg-opacity-10" : "py-3"} type="password" placeholder={txt?.input.password} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur}/>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col md>
								<Form.Group className="mb-3" controlId="registerForm.countrySelect">
									<Form.Label className="d-flex justify-content-between text-info">{txt?.label.country}: {registerForm.errors.country && registerForm.touched.country && <small className="text-danger">{registerForm.errors.country}</small>}</Form.Label>
									<Form.Select tabIndex={8} name="country" value={registerForm.values.country} className={registerForm.errors.country && registerForm.touched.country ? "py-3 mb-3 border border-danger bg-danger bg-opacity-10" : "py-3 mb-3"} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur} aria-label="Default select example">
										<option value="" disabled>{txt?.input.country}</option>
										{countries.map((country, index) => {
											return (
												<option key={index} value={country.code2}>{country.name}</option>
											)
										})}
									</Form.Select>
								</Form.Group>
							</Col>
							<Col md>
								<Form.Group className="mb-3" controlId="registerForm.stateSelect">
								<Form.Label className="d-flex justify-content-between text-info">{txt?.label.state}: {registerForm.errors.state && registerForm.touched.state && <small className="text-danger">{registerForm.errors.state}</small>}</Form.Label>
									<Form.Select tabIndex={9} name="state" value={registerForm.values.state} className={registerForm.errors.state && registerForm.touched.state ? "py-3 mb-3 border border-danger bg-danger bg-opacity-10" : "py-3 mb-3"} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur} aria-label="Default select example">
										<option value="" disabled>{txt?.input.state}</option>
										{selectedCountry?.states && selectedCountry?.states.length > 0 && selectedCountry?.states.map((state, index) => {
											return (
												<option key={index} value={state.code}>{state.name}</option>
											)
										})}
									</Form.Select>
								</Form.Group>
							</Col>
						</Row>
					</Form>
		</Modal>
	)
}

RegisterModal.propTypes = {
	show: PropTypes.bool,
    onHide: PropTypes.func
};