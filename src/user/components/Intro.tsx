import React, { FC } from 'react';
import { negateTheme, ThemeOption, getCls } from '../../common';

interface IntroProps {
    theme: ThemeOption;
}

const Intro: FC<IntroProps> = (props) => {
    const theme = negateTheme(props.theme);
    return (
        <div className={getCls('text-center', 'text-' + theme)}>
            <p className="h2">Arranger </p>
            <p className="font-italic">
                {' '}
                Kanban-style, list-making application for managing workflows
            </p>
            <hr style={{ width: '95vw' }} />
            <p>
                This application was mainly inspired by a{' '}
                <a
                    style={{ textDecoration: 'underline' }}
                    className={'text-' + theme}
                    href="https://billboard.soutendijk.org"
                    target="_blank"
                    rel="noreferrer"
                >
                    project
                </a>{' '}
                made by a former colleague and the popular tool{' '}
                <a
                    style={{ textDecoration: 'underline' }}
                    className={'text-' + theme}
                    href="https://trello.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    Trello
                </a>
            </p>
            <p>I wanted to give my shot at creating something similar but with a personal twist.</p>
        </div>
    );
};

export default Intro;
