import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  Users,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  MessageSquare,
  CheckCircle,
  X,
  BookOpen
} from 'lucide-react';

export const BatchManagement = () => {
  const {
    batches,
    addBatch,
    students,
    t,
    setActiveTab
  } = useApp();

  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [selectedBatchForRoster, setSelectedBatchForRoster] = useState(null);

  // New Batch Form
  const [newBatch, setNewBatch] = useState({
    name: '',
    className: 'HSC 2026',
    subject: '',
    teacher: '',
    schedule: '',
    room: 'রুম নং ১০১',
    seatLimit: 30,
    monthlyFee: 1500
  });

  const handleCreateBatch = (e) => {
    e.preventDefault();
    if (!newBatch.name || !newBatch.subject || !newBatch.teacher) {
      alert('দয়া করে ব্যাচের নাম, বিষয় এবং শিক্ষকের নাম লিখুন');
      return;
    }
    addBatch(newBatch);
    setIsNewBatchModalOpen(false);
    setNewBatch({
      name: '',
      className: 'HSC 2026',
      subject: '',
      teacher: '',
      schedule: '',
      room: 'রুম নং ১০১',
      seatLimit: 30,
      monthlyFee: 1500
    });
  };

  const rosterStudents = selectedBatchForRoster
    ? students.filter(s => s.batchId === selectedBatchForRoster.id)
    : [];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{t('batchesTitle')}</h1>
          <p>{t('batchesSubtitle')}</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsNewBatchModalOpen(true)}>
            <Plus size={16} />
            <span>{t('btnCreateBatch')}</span>
          </button>
        </div>
      </div>

      {/* Batches Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {batches.map(batch => {
          const isFull = batch.enrolledCount >= batch.seatLimit;
          const percentage = Math.min(100, Math.round((batch.enrolledCount / batch.seatLimit) * 100));

          return (
            <div key={batch.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase' }}>
                    {batch.className}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px' }}>{batch.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    📖 বিষয়: <strong>{batch.subject}</strong>
                  </div>
                </div>

                <span className={`status-pill ${isFull ? 'inactive' : 'active'}`}>
                  {isFull ? t('batchStatusFull') : t('batchStatusOpen')}
                </span>
              </div>

              {/* Batch Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="var(--text-muted)" />
                  <span>শিক্ষক: <strong>{batch.teacher}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="var(--text-muted)" />
                  <span>শিডিউল: <strong>{batch.schedule}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="var(--text-muted)" />
                  <span>ক্লাসরুম: <strong>{batch.room}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} color="var(--text-muted)" />
                  <span>মাসিক ফি: <strong>৳{batch.monthlyFee} / শিক্ষার্থী</strong></span>
                </div>
              </div>

              {/* Seat Capacity Bar */}
              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>আসন পূরণ:</span>
                  <span style={{ fontWeight: 700 }}>
                    {batch.enrolledCount} / {batch.seatLimit} শিক্ষার্থী ({percentage}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: percentage > 90 ? 'var(--danger-500)' : 'var(--primary-gradient)',
                      borderRadius: '999px'
                    }}
                  />
                </div>

                {/* Batch Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setSelectedBatchForRoster(batch)}
                  >
                    শিক্ষার্থী তালিকা ({batch.enrolledCount})
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setActiveTab('attendance')}
                    title="হাজিরা দিন"
                  >
                    হাজিরা
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create New Batch */}
      {isNewBatchModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3>
                <Layers size={20} color="var(--primary-500)" />
                {t('btnCreateBatch')}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsNewBatchModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBatch}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('colBatchName')} *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="উদাঃ এইচএসসি পদার্থবিজ্ঞান মিশন A+"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('colClass')}</label>
                    <select
                      className="form-control"
                      value={newBatch.className}
                      onChange={(e) => setNewBatch({ ...newBatch, className: e.target.value })}
                    >
                      <option value="HSC 2026">HSC 2026</option>
                      <option value="SSC 2026">SSC 2026</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Admission">Admission</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('colSubject')} *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ পদার্থবিজ্ঞান ১ম ও ২য় পত্র"
                      value={newBatch.subject}
                      onChange={(e) => setNewBatch({ ...newBatch, subject: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('colTeacher')} *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ তানভীর আহমেদ স্যার"
                      value={newBatch.teacher}
                      onChange={(e) => setNewBatch({ ...newBatch, teacher: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ক্লাসরুম</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ রুম ২০২"
                      value={newBatch.room}
                      onChange={(e) => setNewBatch({ ...newBatch, room: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('colTimeSlot')} *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="উদাঃ শনি-সোম-বুধ (বিকাল ৫:০০ - ৬:৩০)"
                    value={newBatch.schedule}
                    onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('colSeatLimit')}</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newBatch.seatLimit}
                      onChange={(e) => setNewBatch({ ...newBatch, seatLimit: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">মাসিক ফি (৳)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newBatch.monthlyFee}
                      onChange={(e) => setNewBatch({ ...newBatch, monthlyFee: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsNewBatchModalOpen(false)}
                >
                  {t('btnCancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  ব্যাচ যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Batch Roster View */}
      {selectedBatchForRoster && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>{selectedBatchForRoster.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  শিক্ষক: {selectedBatchForRoster.teacher} • শিডিউল: {selectedBatchForRoster.schedule}
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedBatchForRoster(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: 0 }}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>রোল</th>
                      <th>নাম</th>
                      <th>ফোন</th>
                      <th>অভিভাবকের ফোন</th>
                      <th>মাসিক ফি</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rosterStudents.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          এই ব্যাচে এখনও কোনো শিক্ষার্থী ভর্তি হয়নি
                        </td>
                      </tr>
                    ) : (
                      rosterStudents.map(std => (
                        <tr key={std.id}>
                          <td><strong>#{std.roll}</strong></td>
                          <td><strong>{std.name}</strong></td>
                          <td>{std.phone}</td>
                          <td>{std.guardianPhone}</td>
                          <td>৳{std.monthlyFee}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedBatchForRoster(null)}>
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
