"use client";
import { Eye } from "lucide-react";
import { EyeClosed } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
   const [passwords, setPasswords] = useState({
      oldpassword: "",
      newpassword: "",
      confirmnewpassword: "",
   });
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState({ oldpassword: "", newpassword: "", confirmnewpassword: "", general: "" });
   const [showOldPass, setShowOldPass] = useState(false);
   const [showNewPass, setShowNewPass] = useState(false);
   const [showConfirmPass, setShowConfirmPass] = useState(false);

   const handleChange = e => {
      const { name, value } = e.target;
      setPasswords({
         ...passwords,
         [name]: value,
      });
      if (errors[name]) {
         setErrors({ ...errors, [name]: "" });
      }
      if (errors.general) {
         setErrors({ ...errors, general: "" });
      }
   };

   const handleCancel = e => {
      e.preventDefault();
      setPasswords({
         oldpassword: "",
         newpassword: "",
         confirmnewpassword: "",
      });
      setErrors({});
   };

   const handleSave = async e => {
      e.preventDefault();
      setIsLoading(true);
      setErrors({});
      if (passwords.newpassword !== passwords.confirmnewpassword) {
         setErrors(prev => ({
            ...prev,
            confirmnewpassword: "Password baru dan konfirmasi tidak cocok",
         }));
         setIsLoading(false);
         return;
      }

      try {
         const token = localStorage.getItem("token");
         const res = await fetch("http://localhost:3000/profile/password", {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               oldPassword: passwords.oldpassword,
               newPassword: passwords.newpassword,
            }),
         });
         const data = await res.json();

         if (!res.ok) {
            const newErrors = { oldpassword: "", newpassword: "", confirmnewpassword: "", general: "" };

            // LOGIC HANDLING ERROR DARI BACKEND
            if (data.statusCode === 400 && Array.isArray(data.message)) {
               // Kasus Validasi (Array of strings)
               // Contoh: ["oldPassword should not be empty", "Password minimal harus 8 karakter"]
               data.message.forEach(msg => {
                  const lowerMsg = msg.toLowerCase();
                  if (lowerMsg.includes("oldpassword")) {
                     newErrors.oldpassword = msg;
                  } else if (lowerMsg.includes("newpassword") || lowerMsg.includes("password")) {
                     // Asumsi error validasi password umum masuk ke field newpassword
                     newErrors.newpassword = msg;
                  } else {
                     newErrors.general = msg;
                  }
               });
            } else if (data.statusCode === 401) {
               // Kasus Password Lama Salah
               newErrors.oldpassword = data.message;
            } else {
               // Kasus Error Lainnya (404, 500)
               newErrors.general = data.message || "Terjadi kesalahan pada server.";
            }

            setErrors(newErrors);
            return; // Stop eksekusi jika error
         }

         setPasswords({
            oldpassword: "",
            newpassword: "",
            confirmnewpassword: "",
         });
         alert("Password berhasil diperbarui!");
      } catch (error) {
         console.error("Update error:", error);
         setErrors(prev => ({
            ...prev,
            general: "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
         }));
      } finally {
         setIsLoading(false);
      }
   };

   const hasChanges = passwords.oldpassword || passwords.newpassword || passwords.confirmnewpassword;

   return (
      <div className="bg-muted flex min-h-[450px] w-full flex-col gap-10 rounded-2xl border border-slate-200 px-12 py-8 shadow-sm">
         <div>
            <h1 className="text-primary text-2xl font-semibold">Ubah Kata Sandi</h1>
         </div>

         {errors.general && (
            <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
               <span className="block sm:inline">{errors.general}</span>
            </div>
         )}

         <form action="" className="flex w-full flex-col gap-5">
            <div className="w-full space-y-2">
               <div>
                  <div className="relative">
                     <label htmlFor="oldpassword" className="text-primary mb-1 block text-xl font-semibold">
                        Password Lama
                     </label>
                     <div className="relative">
                        <input
                           onChange={handleChange}
                           value={passwords.oldpassword}
                           type={showOldPass ? "text" : "password"}
                           name="oldpassword"
                           id="oldpassword"
                           placeholder="Masukkan Password Lama..."
                           // Kondisional class: Tambahkan border merah jika ada error
                           className={`bg-background text-primary w-full rounded-md px-2.5 py-2.5 pr-10 outline-none focus:ring ${errors.oldpassword ? "border-2 border-red-500 focus:ring-red-200" : ""}`}
                        />
                        <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 transition-colors">
                           {showOldPass ? <Eye /> : <EyeClosed />}
                        </button>
                     </div>
                  </div>
                  {/* Teks Error di bawah input */}
                  {errors.oldpassword && <p className="mt-1 ml-1 text-sm text-red-500">{errors.oldpassword}</p>}
               </div>

               <div>
                  <div className="relative">
                     <label htmlFor="newpassword" className="text-primary mb-1 block text-xl font-semibold">
                        Password Baru
                     </label>
                     <div className="relative">
                        <input
                           onChange={handleChange}
                           value={passwords.newpassword}
                           type={showNewPass ? "text" : "password"}
                           name="newpassword"
                           id="newpassword"
                           placeholder="Masukkan Password Baru..."
                           className={`bg-background text-primary w-full rounded-md px-2.5 py-2.5 pr-10 outline-none focus:ring ${errors.newpassword ? "border-2 border-red-500 focus:ring-red-200" : ""}`}
                        />
                        <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 transition-colors">
                           {showNewPass ? <Eye /> : <EyeClosed />}
                        </button>
                     </div>
                  </div>
                  {errors.newpassword && <p className="mt-1 ml-1 text-sm text-red-500">{errors.newpassword}</p>}
               </div>

               <div>
                  <div className="relative">
                     <label htmlFor="confirmnewpassword" className="text-primary mb-1 block text-xl font-semibold">
                        Konfirmasi Password Baru
                     </label>
                     <div className="relative">
                        <input
                           onChange={handleChange}
                           value={passwords.confirmnewpassword}
                           type={showConfirmPass ? "text" : "password"}
                           name="confirmnewpassword"
                           id="confirmnewpassword"
                           placeholder="Konfirmasi Password Baru..."
                           className={`bg-background text-primary w-full rounded-md px-2.5 py-2.5 pr-10 outline-none focus:ring ${errors.confirmnewpassword ? "border-2 border-red-500 focus:ring-red-200" : ""}`}
                        />
                        <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 transition-colors">
                           {showConfirmPass ? <Eye /> : <EyeClosed />}
                        </button>
                     </div>
                  </div>
                  {errors.confirmnewpassword && <p className="mt-1 ml-1 text-sm text-red-500">{errors.confirmnewpassword}</p>}
               </div>
            </div>

            <div className="flex justify-end gap-3">
               <button disabled={!hasChanges} onClick={handleCancel} className="bg-primary flex w-fit cursor-pointer justify-end rounded-xl px-4 py-2">
                  Batal
               </button>
               <button onClick={handleSave} className="bg-primary flex w-fit cursor-pointer justify-end rounded-xl px-4 py-2">
                  Simpan Kata Sandi
               </button>
            </div>
         </form>
      </div>
   );
}
