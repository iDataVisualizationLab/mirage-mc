import React,{useEffect} from 'react'
import LayoutContainer from './LayoutContainer_replace'//'material-ui-shell/lib/containers/LayoutContainer/LayoutContainer';
import Database from '../DatabaseContainer/DatabaseContainer'

export default function ({ children }) {
    return (
            <LayoutContainer>
                <Database>
                    {children}
                </Database>
            </LayoutContainer>
    )
}