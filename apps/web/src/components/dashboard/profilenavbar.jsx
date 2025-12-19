"use client";

import { cn } from "@/lib/utils";
import { UserRoundSearch, LogOut, RectangleEllipsis } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function ProfileNavbar() {
   const pathName = usePathname();
   const router = useRouter();

   const [userInfo, setUserInfo] = useState({
      fullName: "",
      userName: "",
   });

   const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const updateUserData = () => {
         const userInfo = JSON.parse(localStorage.getItem("userInfo"))

         setUserInfo({
            fullName: userInfo.name,
            userName: userInfo.username,
         });
      };

      updateUserData();

      // Opsional: Listen jika ada perubahan storage dari tab lain
      window.addEventListener("storage", updateUserData);
      return () => window.removeEventListener("storage", updateUserData);
   }, []);

   const menuItems = [
      { Label: "Informasi Profil", Icon: UserRoundSearch, Path: "/dashboard/profile" },
      { Label: "Ubah Password", Icon: RectangleEllipsis, Path: "/dashboard/profile/change-password" },
   ];

   const handleLogout = async () => {
      setIsLoading(true);
      try {
         const token = localStorage.getItem("token");

         // Fetch ke API sesuai Swagger
         const res = await fetch("http://localhost:3000/auth/logout", {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         // Tetap hapus storage meskipun API gagal/expired (401) demi keamanan
         if (res.ok || res.status === 401) {
            document.cookie = "token=; path=/; max-age=0";
            localStorage.clear();
            router.push("/login");
            router.refresh();
         }
      } catch (error) {
         console.error("Logout error:", error);
         alert("Terjadi kesalahan koneksi.");
      } finally {
         setIsLoading(false);
         setLogoutDialogOpen(false);
      }
   };

   return (
      <div className="flex h-[450px] w-64 flex-col items-center justify-between rounded-2xl bg-muted px-3 py-8 shadow-sm">
         {/* Tampilan Nama yang Dinamis */}
         <div className="flex w-full flex-col gap-1 overflow-hidden">
            <h2 className="truncate px-2 text-center text-xl font-bold text-primary">Hai, {userInfo.fullName}</h2>
            <h4 className="truncate text-center text-base font-medium text-primary/70">@{userInfo.userName}</h4>
         </div>

         <nav className="flex w-full flex-col gap-2">
            {menuItems.map(item => {
               const Icon = item.Icon;
               const isActive = pathName === item.Path;

               return (
                  <Link key={item.Path} href={item.Path} className={cn("flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all", isActive ? "bg-background font-semibold text-primary" : "text-accent hover:bg-primary")}>
                     <Icon size={20} />
                     <span className="text-sm">{item.Label}</span>
                  </Link>
               );
            })}

            <button onClick={() => setLogoutDialogOpen(true)} className="mt-10 cursor-pointer flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium outline-red-900 outline-2 text-red-900 transition-all hover:bg-red-900 hover:text-accent">
               <LogOut size={20} />
               <span className="text-sm">Keluar</span>
            </button>
         </nav>

         {/* Logout Confirmation Dialog */}
         <Dialog open={isLogoutDialogOpen} onOpenChange={setLogoutDialogOpen} >
            <DialogContent className="sm:max-w-[400px] bg-background">
               <DialogHeader>
                  <DialogTitle className={"text-primary"}>Konfirmasi Keluar</DialogTitle>
                  <DialogDescription>Apakah Anda yakin ingin keluar? Sesi Anda akan berakhir.</DialogDescription>
               </DialogHeader>
               <DialogFooter className="flex gap-2 pt-4 sm:gap-0">
                  <button disabled={isLoading} onClick={() => setLogoutDialogOpen(false)} className="w-full rounded-lg px-4 py-2 text-sm font-medium text-primary cursor-pointer sm:w-auto">
                     Batal
                  </button>
                  <button disabled={isLoading} onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-accent cursor-pointer sm:w-auto">
                     {isLoading && <Loader2 size={16} className="animate-spin" />}
                     Keluar Sekarang
                  </button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
