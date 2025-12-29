import React, { useCallback, useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import AuthService from "../../services/AuthService.ts"
import { ManagerLayout } from "../../components/layout/index.tsx"

const authService = new AuthService()

export default function Manager() {
    return (
        <ManagerLayout>
            <Outlet />
        </ManagerLayout>
    )

}