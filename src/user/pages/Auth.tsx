import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { RootState } from '../../store';
import { getCls, negateTheme } from '../../common/func';

const Auth: FC = () => {
    const [isInLoginMode, setLoginMode] = useState<boolean>(true);
    const { theme } = useSelector((state: RootState) => state.user);

    const onSwitchModeHandler = () => {
        setLoginMode((prev) => !prev);
    };

    const onSubmitHandler = () => {};

    return (
        <Container className={getCls('text-' + negateTheme(theme), 'bg-' + theme)}>
            <h3 className="pt-3">{isInLoginMode ? 'Please Login' : 'Please Signup'}</h3>
            <Form className="pb-3" validated={false} onSubmit={onSubmitHandler}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" required />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required />
                </Form.Group>
                {!isInLoginMode && (
                    <Form.Group controlId="formBasicPassword2">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required />
                    </Form.Group>
                )}
                <div className="d-flex justify-content-between">
                    <Button variant={negateTheme(theme)} type="submit">
                        {isInLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                    <Button onClick={onSwitchModeHandler} variant={negateTheme(theme)} type="button">
                        SWITCH TO {isInLoginMode ? 'SIGNUP' : 'LOGIN'}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default Auth;
