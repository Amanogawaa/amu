import Footer from '@/components/navigation/Footer';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <NavigationBar /> */}
      {children}
      {/* <Footer /> */}
    </>
  );
}
