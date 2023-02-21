import React,{useEffect} from 'react'
import LayoutContainer from './LayoutContainer_replace'//'material-ui-shell/lib/containers/LayoutContainer/LayoutContainer';

export default function ({ children }) {
    return (
            <LayoutContainer>
                {children}
            </LayoutContainer>
    )
}