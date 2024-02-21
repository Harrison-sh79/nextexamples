import React from "react";

export default function DashboardLayout({
  children,
  users,
  notification,
  revenue,
  login,
}: {
  children: React.ReactNode;
  users: React.ReactNode;
  notification: React.ReactNode;
  revenue: React.ReactNode;
  login: React.ReactNode;
}) {
  const isLoggedIn = false;
  return isLoggedIn? (
    <>
      <div> {children}</div>
      <div> {users}</div>
      <div> {notification}</div>
      <div> {revenue}</div>
    </>
  ): (login);
}

