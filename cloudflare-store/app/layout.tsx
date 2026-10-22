import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://crochetbyprisha.pages.dev"),
  title: "Handmade Crochet Flowers & Personalised Gifts | crochetbyprisha",
  alternates:{canonical:"/"},
  openGraph:{type:"website",locale:"en_IN",siteName:"crochetbyprisha",title:"A little yarn. A whole lot of heart.",description:"Explore handmade crochet flowers, keepsakes and personal colour stories.",url:"https://crochetbyprisha.pages.dev",images:[{url:"/art/social-preview.jpg",width:1200,height:630,alt:"crochetbyprisha illustrative crochet garden"}]},
  twitter:{card:"summary_large_image",title:"crochetbyprisha | Handmade crochet & gifts",images:["/art/social-preview.jpg"]},
  description: "Explore handmade crochet flowers, bow charms, scrunchies and personalised gifts by Prisha in India. Try individual part colours in our interactive 3D previews.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className="antialiased"><a className="skip-link" href="#main-content">Skip to content</a>{children}</body>
    </html>
  );
}
