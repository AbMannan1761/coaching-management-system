import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Plus,
  Phone,
  BookOpen,
  Calendar,
  CreditCard,
  CheckCircle,
  X
} from 'lucide-react';

export const StaffManagement = () => {
  const { teachers, t } = useApp();
  const [teacherList, setTeacherList] = useState(teachers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    title: '',
    subject: '',
    phone: '',
    salary: 25000,
    batchesCount: 1
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.subject) {
      alert('দয়া করে নাম ও বিষয় পূরণ করুন');
      return;
    }

    const newId = `TCH-${String(teacherList.length + 1).padStart(2, '0')}`;
    setTeacherList([...teacherList, { ...newTeacher, id: newId, joinDate: new Date().toISOString().split('T')[0] }]);
    setIsAddModalOpen(false);
    setNewTeacher({
      name: '',
      title: '',
      subject: '',
      phone: '',
      salary: 25000,
      batchesCount: 1
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{t('navStaff')} ও ফ্যাকাল্টি সদস্যবৃন্দ</h1>
          <p>কোচিং সেন্টারের শিক্ষক, কর্মকর্তা এবং ক্লাস সহায়কদের তথ্য তালিকা</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            <span>নতুন শিক্ষক যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {teacherList.map(tch => (
          <div key={tch.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}
              >
                {tch.name.slice(0, 2)}
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{tch.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                  {tch.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  আইডি: {tch.id}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} color="var(--text-muted)" />
                <span>বিষয়: <strong>{tch.subject}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--text-muted)" />
                <span>ফোন: <strong>{tch.phone}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={16} color="var(--text-muted)" />
                <span>নির্ধারিত ব্যাচ: <strong>{tch.batchesCount}টি ব্যাচ</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={16} color="var(--text-muted)" />
                <span>মাসিক সম্মানী: <strong>৳{tch.salary.toLocaleString('bn-BD')}</strong></span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>যোগদানের তারিখ: {tch.joinDate}</span>
              <span className="status-pill active">সক্রিয় ফ্যাকাল্টি</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>
                <GraduationCap size={20} color="var(--primary-500)" />
                নতুন শিক্ষক যুক্ত করুন
              </h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">শিক্ষকের নাম *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="উদাঃ ড. আসিফ ইকবাল"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ডিগ্রি / পদবী</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ লেকচারার (বুয়েট)"
                      value={newTeacher.title}
                      onChange={(e) => setNewTeacher({ ...newTeacher, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">পাঠদানের বিষয় *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ রসায়ন"
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">মোবাইল নম্বর *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="017XXXXXXXX"
                      value={newTeacher.phone}
                      onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">মাসিক সম্মানী (৳)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newTeacher.salary}
                      onChange={(e) => setNewTeacher({ ...newTeacher, salary: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  বাতিল
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
