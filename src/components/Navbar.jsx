import { useNavigate, Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BSNavbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Spinner from "react-bootstrap/Spinner";

import { useContext } from "react";
import { Context } from "@/context/appContext";
import { useState } from "react";
import { LoginModal } from "./categories/users/LoginModal";
import { RegisterModal } from "./categories/users/RegisterModal";
import { SearchBar } from "./SearchBar";
import { useEffect } from "react";

import './styles/Navbar.scss'

export const Navbar = () => {
  const [txt, setTxt] = useState(null);
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [registerModalShow, setRegisterModalShow] = useState(false);
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setTxt(
          await import(
            `./lang/${store.currentLanguage}/Navbar.${store.currentLanguage}.json`
          )
        );
      } catch (error) {
        setTxt(await import(`./lang/${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}/Navbar.${import.meta.env.VITE_APP_DEFAULT_LANGUAGE}.json"`));
      }
    };
    loadLanguage();
  }, [store.currentLanguage]);
  return (
    txt && (
      <>
        <BSNavbar expand="md" className="bg-body-tertiary mb-3">
          <Container fluid>
            <BSNavbar.Brand onClick={() => navigate("/")} role="button">
              {import.meta.env.VITE_APP_NAME}
            </BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls={`offcanvasNavbar`} />
            <BSNavbar.Offcanvas
              id={`offcanvasNavbar`}
              aria-labelledby={`offcanvasNavbarLabel`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel`}>
                  {import.meta.env.VITE_APP_NAME}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <SearchBar />
                <Nav className="justify-content-end flex-grow-1 align-items-md-center">
                  {store.current_user ? (
                    <>
                      <Nav.Link as={Link} to="/">Home</Nav.Link>
                      <Dropdown>
                        <Dropdown.Toggle as="div"
                          id="profile-dropdown"
                          className={`rounded rounded-circle border border-2 ${!store.current_user?.avatar && "d-flex justify-content-center align-items-center"}`}
                          role="button"
                          >
                            {store.current_user?.avatar ?
                              <img className="rounded rounded-circle" src={store.current_user.avatar} width="100%" alt="User avatar"/>
                            :
                            
                              <i className="bi bi-person-fill fs-3"></i>
                            }
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end" className="fade">
                          <Dropdown.Item>{txt.user.profile}</Dropdown.Item>
                          <Dropdown.Item>{txt.user.configuration}</Dropdown.Item>
                          <Dropdown.Item 
                            onClick={() => actions.logout()}
                          >
                            {txt.user.logout}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  ) : store.current_user === false ? (
                    <>
                      <Button
                        variant="outline-primary mx-2"
                        onClick={() => setLoginModalShow(true)}
                      >
                        {txt.guest.signin}
                      </Button>
                      <Button
                        variant="outline-success"
                        onClick={() => setRegisterModalShow(true)}
                      >
                        {txt.guest.signup}
                      </Button>
                    </>
                  ) : (
                    <Spinner animation="border" role="status" />
                  )}
                </Nav>
              </Offcanvas.Body>
            </BSNavbar.Offcanvas>
          </Container>
        </BSNavbar>
        <LoginModal
          show={loginModalShow}
          onHide={() => setLoginModalShow(false)}
        />
        <RegisterModal
          show={registerModalShow}
          onHide={() => setRegisterModalShow(false)}
        />
      </>
    )
  );
};
