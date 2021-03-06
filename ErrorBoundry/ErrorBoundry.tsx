import * as Sentry from '@sentry/minimal';
import React, { Component } from 'react';

interface ErrorBoundryProps {
    /**
     * Render custom error
     */
    renderError?: (error: Error) => React.ReactChild;
}

export class ErrorBoundry extends Component<ErrorBoundryProps> {
    state: { error: Error } = {
        error: null,
    };

    componentDidUpdate() {
        this.state.error = null;
    }

    componentDidCatch(error) {
        Sentry.captureException(error);

        if (__DEV__) {
            console.error(error);
        }

        this.setState({
            error,
        });
    }

    render() {
        const { children, renderError } = this.props;

        if (this.state.error) {
            if (renderError) {
                return renderError(this.state.error);
            }

            return null;
        }

        return children;
    }
}
