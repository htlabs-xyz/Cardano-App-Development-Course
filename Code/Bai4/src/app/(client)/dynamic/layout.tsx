export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        dynamic layout
         {children}
    </>
  );
}
