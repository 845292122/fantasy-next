'use client'

import { Navbar, NavbarBrand } from '@heroui/react'
import React from 'react'
import AppNavbarMenu from '@/components/AppNavbar/menu'
import AppProfile from '@/components/AppNavbar/profile'

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default function AppNavbar() {
  return (
    <Navbar maxWidth="full">
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <AppNavbarMenu />
      <AppProfile />
    </Navbar>
  )
}
