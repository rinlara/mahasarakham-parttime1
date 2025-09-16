import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdsContact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl: string | null = null;

      // ถ้ามีไฟล์รูป
      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("ads-images")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
          return;
        }

        const { data: publicUrl } = supabase.storage
          .from("ads-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl.publicUrl;
      }

      // บันทึกลงฐานข้อมูล
      const { error } = await supabase.from("ad_contacts").insert([
        {
          ...form,
          image_url: imageUrl, // บันทึก path ของรูป
        },
      ]);

      if (error) {
        console.error("Insert error:", error.message);
        return;
      }

      setSent(true);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 flex items-center justify-center py-16 px-4">
      <div className="bg-white/90 rounded-3xl shadow-2xl max-w-xl w-full p-10 border-2 border-sky-200">
        <div className="flex flex-col items-center mb-8">
          <img src="/ads_banner_blue.svg" alt="ติดต่อโฆษณา" className="w-32 h-32 mb-4" />
          <h1 className="text-3xl font-bold text-sky-700 mb-2">ติดต่อโฆษณา/โปรโมทงาน</h1>
          <p className="text-sky-800 text-center">
            สนใจลงโฆษณาหรือโปรโมทงานกับเรา? กรอกข้อมูลและอัปโหลดรูป ทีมงานจะติดต่อกลับโดยเร็วที่สุด
          </p>
        </div>

        {sent ? (
          <div className="text-center text-green-600 font-bold text-xl py-8">
            ขอบคุณที่ติดต่อเรา!<br />ทีมงานจะติดต่อกลับโดยเร็วที่สุด
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="name"
              placeholder="ชื่อ-นามสกุล / บริษัท"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="อีเมลสำหรับติดต่อกลับ"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="phone"
              placeholder="เบอร์โทรศัพท์"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <Textarea
              name="message"
              placeholder="รายละเอียดหรือความต้องการ"
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
            />
            <Input type="file" accept="image/*" onChange={handleFileChange} />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              ส่งข้อมูล
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
