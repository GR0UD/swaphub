"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { isUserLoggedIn, removeUserToken } from "@/utils/auth";

export default function SiteHeader() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    setIsLoggedIn(isUserLoggedIn());
  }, [pathname]);

  const handleLogout = () => {
    removeUserToken();
    setIsLoggedIn(false);
    window.location.href = "/";
  };
  return (
    <header className="site-header">
      <div className="site-header__container">
        <Link href="/" className="site-header__logo">
          <Image
            src="/Images/Logo.svg"
            alt="SwapHub Logo"
            width={125}
            height={40}
            priority={true}
            className="site-header__logo-image"
          />
        </Link>
        <nav className="site-header__nav">
          <ul className="site-header__nav-list">
            <li className="site-header__nav-item">
              <Link
                href="/"
                className={`site-header__nav-link${
                  isActive("/") ? " active" : ""
                }`}
              >
                Listings
              </Link>
            </li>

            <li className="site-header__nav-item">
              <Link
                href="/contact"
                className={`site-header__nav-link${
                  isActive("/contact") ? " active" : ""
                }`}
              >
                Contact
              </Link>
            </li>
            <>
              {isLoggedIn && (
                <li className="site-header__nav-item">
                  <Link
                    href="/my-listings"
                    className={`site-header__nav-link${
                      isActive("/my-listings") ? " active" : ""
                    }`}
                  >
                    My Listings
                  </Link>
                </li>
              )}
              <li className="site-header__nav-item">
                <Link
                  href="/sign-in"
                  className="site-header__nav-link site-header__nav-link--signin"
                  onClick={isLoggedIn ? handleLogout : undefined}
                >
                  {isLoggedIn ? "Sign out" : "Sign in"}
                </Link>
              </li>
              <li className="site-header__nav-item">
                <Link
                  href={isLoggedIn ? "/profile" : "/sign-up"}
                  className="site-header__nav-link site-header__nav-link--register"
                >
                  {isLoggedIn ? "Profile" : "Register"}
                </Link>
              </li>
            </>
          </ul>
        </nav>
      </div>
    </header>
  );
}
