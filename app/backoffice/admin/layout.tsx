import AdminNavbar from "@/app/component/AdminNavbar";
import AdminSidebar from "@/app/component/AdminSidebar";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full items-center justify-between fixed top-0 h-16 p-4 bg-base-100 shadow">
        <AdminNavbar />
      </div>
      <div className="flex flex-row mt-16 w-full">
        <div>
          <AdminSidebar />
        </div>
        <div className="w-full md:ml-60 p-2 md:p-4">{children}</div>
      </div>
    </div>
  );
}
