import PropTypes from "prop-types";
import { Button } from "react-bootstrap"
import { Modal as BSModal } from "react-bootstrap"

export const Modal = (props) => {
  return (
    <BSModal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <BSModal.Header closeButton>
        <BSModal.Title id="contained-modal-title-vcenter" className="d-flex w-100 justify-content-center text-success">
          <h1>{props.title}</h1>
        </BSModal.Title>
      </BSModal.Header>
      <BSModal.Body>
        {props.children}
      </BSModal.Body>
      <BSModal.Footer>
        <Button tabIndex={props.cancelindex} variant="outline-danger" onClick={props.onHide}>{props.close}</Button>
        <Button tabIndex={props.submitindex} type="submit" variant="outline-success" onClick={props.onSubmit}>{props.submit}</Button>
      </BSModal.Footer>
    </BSModal>
  )
}

Modal.propTypes = {
	title: PropTypes.string,
  children: PropTypes.node,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  close: PropTypes.string,
  submit: PropTypes.string,
  cancelindex: PropTypes.number,
  submitindex: PropTypes.number
};