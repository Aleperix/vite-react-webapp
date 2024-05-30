import PropTypes from "prop-types";
import { Modal } from "@/components/Modal";
import { Form } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { Context } from "@/context/appContext";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from 'sweetalert2'

export const LoginModal = (props) => {
    const { store, actions } = useContext(Context);
    const [txt, setTxt] = useState()

    const loginForm = useFormik({
        initialValues: { username: "", password: "" },
        validationSchema: yup.object({
            username: yup.string().required(txt?.errors.required),
            password: yup
                .string()
                .min(4, txt?.errors.passwordTooShort)
                .required(txt?.errors.required),
        }),
        onSubmit: () => handleSubmit(),
    });

    const handleSubmit = async () => {
        let res = await actions.useFetch(
            import.meta.env.VITE_API_URL,
            "/user/login",  
            "POST",
            false,
            loginForm.values,
            "formData"
        );
        if (res.status == 200) {
            console.log(res);
            Swal.fire({
                title: `${txt?.success.title}!`,
                text: `${txt?.success.hi} ${res.data.user.username}!`,
                icon: "success",
                timer: 2000,
                customClass: {
                    popup: 'bg-'+store.currentTheme
                },
                showConfirmButton: false
            })
            loginForm.resetForm()
            setTimeout(() => {
                actions.setCurrentUser(res.data, "login");
                props.onHide();
            }, 2000);
        } else {
            console.log(res);
            Swal.fire({
                title: txt?.errors.title+"!",
                text: res?.status == 401 || res?.status == 404 ? txt?.errors.incorrectCredentials : txt?.errors.unexpected,
                icon: "error",
                timer: 3000,
                customClass: {
                    popup: 'bg-'+store.currentTheme
                },
                showConfirmButton: false
            })
        }
    };

    useEffect(() => {
        const loadLanguage = async () => {
            try {
              setTxt(
                await import(
                  `./lang/${store.currentLanguage}/LoginModal.${store.currentLanguage}.json`
                )
              );
            } catch (error) {
              setTxt(await import(`./lang/${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}/LoginModal.${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}.json"`));
            }
        };
        loadLanguage();
    }, [store.currentLanguage])

    useEffect(() => {
        loginForm.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txt])

    return (
        <Modal
            title={txt?.loginTitle}
            show={props.show}
            onHide={props.onHide}
            onSubmit={loginForm.handleSubmit}
            onKeyDown={((e) =>  e.key == "Enter" && loginForm.handleSubmit())}
            close={txt?.closeButton}
            submit={txt?.submitButton}
            cancelindex={3}
			submitindex={4}
        >
            {store.current_user == false && (
                <>
                    <Form.Group
                        className="mb-3"
                        controlId="loginForm.usernameInput"
                    >
                        <Form.Label className="d-flex justify-content-between text-info">
                            {txt?.label.usernameOrEmail}:{" "}
                            {loginForm.errors.username &&
                                loginForm.touched.username && (
                                    <small className="text-danger">
                                        {loginForm.errors.username}
                                    </small>
                                )}
                        </Form.Label>
                        <Form.Control
                            tabIndex={1}
                            name="username"
                            value={loginForm.values.username}
                            className={
                                loginForm.errors.username &&
                                loginForm.touched.username
                                    ? "py-3 mb-3 border border-danger bg-danger bg-opacity-10"
                                    : "py-3 mb-3"
                            }
                            type="username"
                            placeholder={txt?.input.usernameOrEmail}
                            onChange={loginForm.handleChange}
                            onBlur={loginForm.handleBlur}
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="loginForm.passwordInput"
                    >
                        <Form.Label className="d-flex justify-content-between text-info">
                            {txt?.label.password}:{" "}
                            {loginForm.errors.password &&
                                loginForm.touched.password && (
                                    <small className="text-danger">
                                        {loginForm.errors.password}
                                    </small>
                                )}
                        </Form.Label>
                        <Form.Control
                            tabIndex={2}
                            name="password"
                            value={loginForm.values.password}
                            className={
                                loginForm.errors.password &&
                                loginForm.touched.password
                                    ? "py-3 border border-danger bg-danger bg-opacity-10"
                                    : "py-3"
                            }
                            type="password"
                            placeholder={txt?.input.password}
                            onChange={loginForm.handleChange}
                            onBlur={loginForm.handleBlur}
                        />
                    </Form.Group>
                </>
            )}
        </Modal>
    );
};

LoginModal.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
};
