import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Award,
  IdCard,
  Clock
} from 'lucide-react';

export const StudentProfileModal = () => {
  const {
    profileStudent,
    setProfileStudent,
    feeRecords,
    exams,
    setIdCardStudent,
    setIsFeeCounterOpen,
    setReceiptToPrint
  } = useApp();

  if (!profileStudent) return null;

  const studentPayments = feeRecords.filter(r => r.studentId === profileStudent.id);

  // Student exam results
  const studentExamResults = [];
  exams.forEach(ex => {
    const res = ex.results?.find(r => r.studentId === profileStudent.id);
    if (res) {
      studentExamResults.push({
        examTitle: ex.title,
        totalMarks: ex.totalMarks,
        marks: res.marks,
        grade: res.grade,
        position: res.position,
        date: ex.date
      });
    }
  });

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3>
            <User size={20} color="var(--primary-500)" />
            শিক্ষার্থীর পূর্ণাঙ্গ প্রোফাইল
          </h3>
          <button className="modal-close-btn" onClick={() => setProfileStudent(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Top Bio Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              padding: '16px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              marginBottom: '20px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                flexShrink: 0
              }}
            >
              {profileStudent.name.slice(0, 2)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{profileStudent.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                শ্রেণি: <strong>{profileStudent.className}</strong> • রোল: <strong>#{profileStudent.roll}</strong> • আইডি: <strong>{profileStudent.id}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600, marginTop: '4px' }}>
                {profileStudent.batchName}
              </div>
            </div>

            <div>
              <span className={`status-pill ${profileStudent.status === 'active' ? 'active' : 'inactive'}`}>
                {profileStudent.status === 'active' ? 'সক্রিয় শিক্ষার্থী' : 'নিষ্ক্রিয়'}
              </span>
            </div>
          </div>

          {/* Contact and Bio Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>শিক্ষার্থীর মোবাইল:</div>
              <div style={{ fontWeight: 600 }}>📞 {profileStudent.phone}</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>অভিভাবক ও যোগাযোগ:</div>
              <div style={{ fontWeight: 600 }}>{profileStudent.guardianName || 'অভিভাবক'} ({profileStudent.guardianPhone})</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>মাসিক নির্ধারিত বেতন:</div>
              <div style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                ৳{profileStudent.monthlyFee} {profileStudent.discount > 0 && `(ছাড়: ৳${profileStudent.discount})`}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>বর্তমান বকেয়া:</div>
              <div style={{ fontWeight: 700, color: profileStudent.dueAmount > 0 ? 'var(--danger-500)' : 'var(--success-500)' }}>
                {profileStudent.dueAmount > 0 ? `৳${profileStudent.dueAmount}` : 'কোন বকেয়া নেই (পরিশোধিত)'}
              </div>
            </div>
          </div>

          {/* Payment History Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={16} color="var(--primary-500)" />
              ফি পরিশোধের ইতিহাস ({studentPayments.length}টি লেনদেন)
            </div>

            {studentPayments.length === 0 ? (
              <div style={{ padding: '14px', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                এখনও কোনো ফি জমা হয়নি
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {studentPayments.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--bg-subtle)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700 }}>{p.month}</span> • {p.receiptNo}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>পদ্ধতি: {p.method} • তারিখ: {p.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--success-600)' }}>৳{p.paidAmount}</span>
                      <button
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '4px 8px' }}
                        onClick={() => {
                          setProfileStudent(null);
                          setReceiptToPrint(p);
                        }}
                      >
                        রসিদ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam Results Section */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="var(--warning-500)" />
              পরীক্ষার ফলাফল
            </div>

            {studentExamResults.length === 0 ? (
              <div style={{ padding: '14px', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                কোন পরীক্ষার ফলাফল লিপিবদ্ধ নেই
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {studentExamResults.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--bg-subtle)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.examTitle}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>তারিখ: {r.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary-600)' }}>
                        {r.marks} / {r.totalMarks}
                      </span>
                      <span className="status-pill active" style={{ marginLeft: '8px' }}>
                        গ্রেড: {r.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => {
              const current = profileStudent;
              setProfileStudent(null);
              setIdCardStudent(current);
            }}
          >
            <IdCard size={15} />
            আইডি কার্ড দেখুন
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setProfileStudent(null);
              setIsFeeCounterOpen(true);
            }}
          >
            <CreditCard size={15} />
            ফি গ্রহণ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
