import * as React from "react";
import {Modal} from "react-bootstrap";
import {SimpleButton} from "../../Common/SimpleButton";
import "./DeleteAccountModal.css";

export class DeleteAccountModal extends React.Component<IDeleteAccountModalProps> {
    public render(): React.ReactNode {
        return <Modal onHide={this.props.onDiscard} show={this.props.show} container={this.props.container}
                      style={{marginTop: "100px"}}>
            <Modal.Header closeButton={true}>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span>Do you really want to delete your account? This action cannot be undone!</span>
            </Modal.Body>
            <Modal.Footer>
                <SimpleButton text="Delete Account" onClick={this.props.onDelete} id="delete-button" className="secondary-color-bg"/>
                <SimpleButton text="Cancel" onClick={this.props.onDiscard} id="cancel-button"/>
            </Modal.Footer>
        </Modal>
    }
}

interface IDeleteAccountModalProps {
    onDelete: () => void;
    onDiscard: () => void;
    show: boolean;
    container: any;
}