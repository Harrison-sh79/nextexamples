export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        
        <h1>With Layout</h1>
        
        {children}

    </div>
  );
}
