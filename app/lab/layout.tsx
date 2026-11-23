import "../globals.css";

export default function LabLayout({ children }: LayoutProps<"/lab">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
