import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { getCls, negateTheme } from '../../';
import { RootState } from '../../../store';

const Footer: FC = () => {
    const { theme } = useSelector((state: RootState) => state.user);
    return (
        <footer
            className={getCls('bg-' + theme, 'text-' + negateTheme(theme), 'font-italic')}
            style={{
                textAlign: 'center',
                position: 'fixed',
                width: '100%',
                fontSize: '0.8rem',
                right: '0',
                bottom: '0'
            }}
        >
            <span
                style={{
                    margin: '0 10px 0 10px'
                }}
            >
                <span
                    style={{
                        margin: '0 10px 0 10px'
                    }}
                >
                    <a
                        style={{ color: 'inherit' }}
                        href="https://www.lindeneg.org"
                        target="_blank"
                        rel="noreferrer"
                    >
                        christian lindeneg
                    </a>
                </span>
                @ 2021
            </span>
            -
            <span
                style={{
                    margin: '0 10px 0 10px'
                }}
            >
                <a
                    style={{ color: 'inherit' }}
                    href="https://github.com/lindeneg/arranger"
                    target="_blank"
                    rel="noreferrer"
                >
                    source-code
                </a>
            </span>
        </footer>
    );
};

export default Footer;
