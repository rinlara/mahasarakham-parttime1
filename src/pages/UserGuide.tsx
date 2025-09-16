import React, { useState } from 'react';
import { BookOpen, Users, Store, HelpCircle, Mail, Smartphone, CreditCard, CheckCircle, AlertTriangle, Edit, Clock } from 'lucide-react';

export default function UserGuidePage() {
  const [activeTab, setActiveTab] = useState<'applicant' | 'employer'>('applicant');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Hero Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-300/20 to-purple-400/20 rounded-3xl blur-3xl -z-10"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-medium mb-6 shadow-lg">
              <BookOpen className="w-5 h-5 mr-2" />
              คู่มือการใช้งานระบบ
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
              หางานพาร์ทไทม์
              <br />
              <span className="text-3xl md:text-4xl">จังหวัดมหาสารคาม</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              คู่มือฉบับสมบูรณ์สำหรับ “ผู้สมัครงาน” และ “ผู้ประกอบการ” — ใช้งานง่าย ครบถ้วน ภายในคลิกเดียว
            </p>
          </div>
        </div>

        {/* Tabs Navigation — ดีไซน์ใหม่สวยงาม */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('applicant')}
                className={`px-10 py-5 font-bold rounded-xl transition-all duration-300 flex items-center space-x-3 min-w-[220px] ${
                  activeTab === 'applicant'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-102 shadow-md border border-gray-200'
                }`}
              >
                <Users className="w-6 h-6" />
                <span>ผู้สมัครงาน</span>
              </button>
              <button
                onClick={() => setActiveTab('employer')}
                className={`px-10 py-5 font-bold rounded-xl transition-all duration-300 flex items-center space-x-3 min-w-[220px] ${
                  activeTab === 'employer'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-102 shadow-md border border-gray-200'
                }`}
              >
                <Store className="w-6 h-6" />
                <span>ผู้ประกอบการ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content: แสดงเฉพาะแท็บที่เลือก */}
        {activeTab === 'applicant' && (
          <div className="space-y-12 mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-2xl mb-6 shadow-lg">
                <Users className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">คู่มือสำหรับผู้สมัครงาน</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                ขั้นตอนการใช้งานสำหรับนักเรียน นักศึกษา และผู้ที่ต้องการหางานพาร์ทไทม์ในจังหวัดมหาสารคาม
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "สมัครสมาชิก",
                  steps: [
                    "กด “สมัครสมาชิก” ที่มุมขวาบน",
                    "เลือกบทบาท “ผู้สมัครงาน”",
                    "กรอกอีเมล, รหัสผ่าน, เบอร์โทร",
                    "ยืนยันอีเมล (ถ้ามี)"
                  ],
                  color: "indigo",
                  delay: 0
                },
                {
                  icon: <SearchIcon />,
                  title: "ค้นหางาน",
                  steps: [
                    "ใช้ช่องค้นหาด้านบน",
                    "กรองตามอำเภอที่ต้องการ",
                    "เรียงตามเงินเดือนหรือวันหมดเขต",
                    "ดูเฉพาะงานที่ยังเปิดรับ"
                  ],
                  color: "purple",
                  delay: 100
                },
                {
                  icon: <CheckCircle className="w-8 h-8" />,
                  title: "สมัครงาน",
                  steps: [
                    "กดที่งานที่สนใจ",
                    "อ่านรายละเอียดให้ครบ",
                    "กด “สมัครงาน”",
                    "รอการติดต่อกลับจากนายจ้าง"
                  ],
                  color: "green",
                  delay: 200
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "ติดตามสถานะ",
                  steps: [
                    "เข้าเมนู “ใบสมัครของฉัน”",
                    "ดูสถานะ: รอตอบรับ / ได้งาน",
                    "รับการแจ้งเตือนผ่านอีเมล",
                    "ติดต่อนายจ้างผ่านระบบ"
                  ],
                  color: "orange",
                  delay: 300
                },
                {
                  icon: <Edit className="w-8 h-8" />,
                  title: "จัดการโปรไฟล์",
                  steps: [
                    "อัปโหลดรูปโปรไฟล์",
                    "อัปเดตเบอร์โทร/อีเมล",
                    "เพิ่มประวัติการศึกษา",
                    "บันทึกการเปลี่ยนแปลง"
                  ],
                  color: "blue",
                  delay: 400
                },
                {
                  icon: <HelpCircle className="w-8 h-8" />,
                  title: "ติดต่อช่วยเหลือ",
                  steps: [
                    "ใช้แชทในระบบ",
                    "ส่งอีเมล support@...",
                    "ติดต่อ Line OA: @parttimems",
                    "โทร 043-xxx-xxx (จ-ศ)"
                  ],
                  color: "pink",
                  delay: 500
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-xl border-t-4 border-${item.color}-500 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`}
                  style={{ animationDelay: `${item.delay}ms` }}
                >
                  <div className={`w-14 h-14 bg-${item.color}-100 rounded-2xl flex items-center justify-center mb-6 text-${item.color}-600`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.steps.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <span className={`w-2 h-2 bg-${item.color}-500 rounded-full mt-2 mr-3 flex-shrink-0`}></span>
                        <span className="text-gray-600 text-sm leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'employer' && (
          <div className="space-y-12 mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-200 rounded-2xl mb-6 shadow-lg">
                <Store className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">คู่มือสำหรับผู้ประกอบการ</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                ขั้นตอนการใช้งานสำหรับร้านค้า ธุรกิจ และผู้ที่ต้องการหาพนักงานพาร์ทไทม์ในจังหวัดมหาสารคาม
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Store className="w-8 h-8" />,
                  title: "สร้างร้านค้า",
                  steps: [
                    "สมัครสมาชิก → เลือก “ผู้ประกอบการ”",
                    "กรอกข้อมูลร้าน: ชื่อ, ที่อยู่, เบอร์โทร",
                    "เลือกอำเภอที่ตั้งร้าน",
                    "อัปโหลดโลโก้ร้านค้า"
                  ],
                  color: "purple",
                  delay: 0
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "รอการอนุมัติ",
                  steps: [
                    "ระบบส่งข้อมูลให้แอดมินตรวจสอบ",
                    "รอภายใน 24 ชั่วโมง",
                    "รับอีเมลแจ้งผลอนุมัติ",
                    "สามารถลงประกาศงานได้ทันที"
                  ],
                  color: "orange",
                  delay: 100
                },
                {
                  icon: <Edit className="w-8 h-8" />,
                  title: "ลงประกาศงาน",
                  steps: [
                    "กด “ลงประกาศงาน” ในแดชบอร์ด",
                    "เลือกร้าน → กรอกตำแหน่งงาน",
                    "ระบุเงินเดือน, เวลาทำงาน",
                    "ตั้งวันหมดเขตและจำนวนรับ"
                  ],
                  color: "blue",
                  delay: 200
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "จัดการผู้สมัคร",
                  steps: [
                    "ดูรายชื่อผู้สมัครในแต่ละงาน",
                    "เปลี่ยนสถานะ: นัดสัมภาษณ์ / ได้งาน",
                    "ส่งข้อความแจ้งผลผ่านระบบ",
                    "ดาวน์โหลดเรซูเม่ (ถ้ามี)"
                  ],
                  color: "indigo",
                  delay: 300
                },
                {
                  icon: <AlertTriangle className="w-8 h-8" />,
                  title: "แก้ไข/ปิดงาน",
                  steps: [
                    "แก้ไขรายละเอียดงานได้ตลอด",
                    "ปิดรับสมัครก่อนกำหนด",
                    "ขยายวันหมดเขต (ถ้าจำเป็น)",
                    "ซ่อนงานที่ไม่ต้องการแล้ว"
                  ],
                  color: "red",
                  delay: 400
                },
                {
                  icon: <HelpCircle className="w-8 h-8" />,
                  title: "ขอความช่วยเหลือ",
                  steps: [
                    "ติดต่อแอดมินผ่านระบบ",
                    "ส่งอีเมล support@...",
                    "Line OA: @parttimems",
                    "โทร 043-xxx-xxx (จ-ศ 9:00-17:00)"
                  ],
                  color: "pink",
                  delay: 500
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-xl border-t-4 border-${item.color}-500 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`}
                  style={{ animationDelay: `${item.delay}ms` }}
                >
                  <div className={`w-14 h-14 bg-${item.color}-100 rounded-2xl flex items-center justify-center mb-6 text-${item.color}-600`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.steps.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <span className={`w-2 h-2 bg-${item.color}-500 rounded-full mt-2 mr-3 flex-shrink-0`}></span>
                        <span className="text-gray-600 text-sm leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section — ดีไซน์ใหม่ */}
        <div className="mt-24 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12 shadow-2xl border border-gray-200">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-6 shadow-lg">
              <HelpCircle className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">❓ คำถามที่พบบ่อย</h2>
            <p className="text-lg text-gray-600">คำตอบสำหรับคำถามยอดนิยมจากผู้ใช้งานทั้งสองฝั่ง</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* ผู้สมัคร */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3" />
                สำหรับผู้สมัครงาน
              </h3>
              {[
                {
                  q: "สมัครงานแล้วจะรู้ผลเมื่อไหร่?",
                  a: "โดยทั่วไป 1-3 วันทำการ ระบบจะแจ้งเตือนเมื่อมีอัปเดตผ่านอีเมลหรือในแอป"
                },
                {
                  q: "สมัครงานผ่านมือถือได้ไหม?",
                  a: "ได้! ระบบรองรับทุกอุปกรณ์ ทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์"
                },
                {
                  q: "ต้องเสียเงินไหม?",
                  a: "ไม่! ฟรีทั้งผู้สมัครและผู้ประกอบการ ไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น"
                },
                {
                  q: "ถ้าไม่ได้รับการติดต่อกลับ?",
                  a: "สามารถติดต่อผู้ประกอบการผ่านระบบข้อความ หรือแจ้งแอดมินให้ช่วยติดตาม"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <p className="font-bold text-gray-800 mb-2">Q: {item.q}</p>
                  <p className="text-gray-600">A: {item.a}</p>
                </div>
              ))}
            </div>

            {/* ผู้ประกอบการ */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-700 mb-6 flex items-center">
                <Store className="w-6 h-6 mr-3" />
                สำหรับผู้ประกอบการ
              </h3>
              {[
                {
                  q: "ร้านค้าต้องได้รับการอนุมัติก่อนถึงจะลงงานได้?",
                  a: "ใช่ เพื่อความน่าเชื่อถือและความปลอดภัยของผู้สมัครงาน"
                },
                {
                  q: "งานที่ลงจะแสดงทันทีไหม?",
                  a: "ไม่ ต้องรอแอดมินอนุมัติภายใน 24 ชั่วโมง เพื่อตรวจสอบความถูกต้อง"
                },
                {
                  q: "สามารถแก้ไขงานหลังจากเผยแพร่แล้วได้ไหม?",
                  a: "ได้ แต่ต้องผ่านการอนุมัติอีกครั้งหากมีการเปลี่ยนแปลงสำคัญ"
                },
                {
                  q: "จะรู้ได้อย่างไรว่าใครสมัครงานเรา?",
                  a: "ระบบจะแจ้งเตือนทันทีในแดชบอร์ด และสามารถดูประวัติผู้สมัครได้ตลอดเวลา"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <p className="font-bold text-gray-800 mb-2">Q: {item.q}</p>
                  <p className="text-gray-600">A: {item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section — ดีไซน์ใหม่ */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-2xl mb-8 shadow-lg">
            <Mail className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-4xl font-bold text-gray-800 mb-8">📞 ติดต่อฝ่ายสนับสนุน</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center flex-wrap gap-8 text-gray-600 mb-12">
            <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <Mail className="w-6 h-6 text-indigo-600" />
              <span className="font-medium">📧 support@parttime-mahasarakham.com</span>
            </div>
            <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <Smartphone className="w-6 h-6 text-green-600" />
              <span className="font-medium">📱 Line OA: @parttimems</span>
            </div>
            <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <CreditCard className="w-6 h-6 text-purple-600" />
              <span className="font-medium">☎️ โทร: 043-xxx-xxx (จ-ศ 9:00-17:00)</span>
            </div>
          </div>
          <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            คลิกที่นี่เพื่อเริ่มต้นใช้งานระบบ
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-gray-400 border-t border-gray-200 pt-8">
          ✅ คู่มือนี้อัปเดตล่าสุดเมื่อ: พฤษภาคม 2568 | ใช้ได้กับเวอร์ชันระบบ: v1.2+ | © 2025 หางานพาร์ทไทม์มหาสารคาม
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .grid > div {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

// Custom Search Icon Component
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}