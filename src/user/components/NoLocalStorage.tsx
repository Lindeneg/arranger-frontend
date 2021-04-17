import React, { FC } from 'react';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';

const NoLocalStorage: FC = () => {
    try {
        window.localStorage.getItem('');
        document.location.pathname = '/';
    } catch (err) {
        // local storage still blocked
    }

    return (
        <Container>
            <h2>
                <Badge variant="danger">An Error Occurred</Badge>
            </h2>
            <hr />
            <Alert variant="danger">
                Your browser prevents cookies from being used. This means the website will not work
                as expected.
            </Alert>
            <p>
                <strong>
                    Please allow cookies to be utilized on this website and then reload the page.
                </strong>
            </p>
        </Container>
    );
};

export default NoLocalStorage;
