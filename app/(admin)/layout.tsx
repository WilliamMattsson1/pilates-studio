import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <h1>AdminPage - Här går admin navbar och ev sidevbar</h1>
            {children}
        </>
    )
}

export default Layout
