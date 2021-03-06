/* eslint-disable react/no-multi-comp */

import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Overlay } from '../Overlay';
import ModalBox from './Box';

interface ModalProps {
    /**
     * show/hide modal. if passed, it renders a controlled Modal
     * not needed if you use `trigger` prop
     */
    visible?: boolean;

    /**
     * Modal content
     */
    children: React.ReactNode;

    className?: string;

    /**
     * callback fired when modal is closed. use it to set state false in your component
     * not needed if you use `trigger` prop
     */
    onClose?: () => void;

    /**
     * Single React child that accepts onClick prop, used as trigger
     * passing trigger tells Modal to manage its state automatically
     */
    trigger?: any;

    containerClass?: string;
}

interface ModalState {
    visible?: boolean;
}

interface LightboxPortalProps {
    visible: boolean;
    mountNode: HTMLDivElement;
    onClose: (e: React.SyntheticEvent) => void;
    canClose?: boolean;
    children: React.ReactNode;
    className?: string;
    containerClass?: string;
}

class LightboxPortal extends Component<LightboxPortalProps> {
    render() {
        const { onClose, mountNode, className, visible, canClose, children, containerClass } = this.props;

        if (!visible) return null;

        return (
            <Overlay>
                {ReactDOM.createPortal(
                    <ModalBox
                        containerClass={containerClass}
                        className={className}
                        canClose={canClose}
                        onClose={onClose}
                    >
                        {children}
                    </ModalBox>,
                    mountNode
                )}
            </Overlay>
        );
    }
}

export class Modal extends Component<ModalProps, ModalState> {
    _mountNode?: HTMLDivElement;

    state: ModalState = {};

    componentWillUnmount() {
        // destroy mount node
        if (this._mountNode) this._mountNode.remove();
    }

    getMountNode() {
        if (this._mountNode) return this._mountNode;

        this._mountNode = document.body.appendChild(document.createElement('div'));

        return this._mountNode;
    }

    onClick = (e: React.SyntheticEvent) => {
        const { visible } = this.props;

        e.preventDefault();

        if (typeof visible !== 'boolean') {
            this.setState({
                visible: true,
            });
        }
    };

    close = (e: React.SyntheticEvent) => {
        const { onClose, visible } = this.props;

        e.preventDefault();

        if (typeof visible !== 'boolean') {
            this.setState({
                visible: false,
            });
        }

        if (onClose) onClose();
    };

    render() {
        const { visible, trigger, className, children, onClose, containerClass } = this.props;

        // use visible prop if it's a boolean
        // otherwise use internal state
        const isVisible = typeof visible === 'boolean' ? visible : this.state.visible;

        return (
            <Fragment>
                {/* render trigger if passed */}
                {trigger &&
                    React.cloneElement(React.Children.only(trigger), {
                        onClick: this.onClick,
                    })}

                {__BROWSER__ && (
                    <LightboxPortal
                        className={className}
                        onClose={this.close}
                        canClose={!!onClose}
                        mountNode={this.getMountNode()}
                        visible={isVisible}
                        containerClass={containerClass}
                    >
                        {children}
                    </LightboxPortal>
                )}
            </Fragment>
        );
    }
}
