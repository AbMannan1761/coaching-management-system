import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserPlus,
  Search,
  Filter,
  Eye,
  CreditCard,
  Trash2,
  Phone,
  BookOpen,
  CheckCircle,
  IdCard,
  X
} from 'lucide-react';

export const StudentManagement = () => {
  const {
    students,
    batches,
    t,
    deleteStudent,
    isAddStudentModalOpen,
    setIsAddStudentModalOpen,
    setIdCardStudent,
    setProfileStudent,
    setIsFeeCounterOpen,
    addStudent
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    nameEn: '',
    roll: '',
    className: 'HSC 2026',
    batchId: batches[0]?.id || '',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    address: '',
    monthlyFee: 1500,
    discount: 0
  });

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll.includes(searchTerm) ||
      student.phone.includes(searchTerm) ||
      (student.nameEn && student.nameEn.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass = selectedClass === 'all' || student.className === selectedClass;
    const matchesBatch = selectedBatch === 'all' || student.batchId === selectedBatch;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;

    return matchesSearch && matchesClass && matchesBatch && matchesStatus;
  });

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.roll || !newStudent.phone) {
      alert('দয়া করে শিক্ষার্থীর নাম, রোল এবং ফোন নম্বর পূরণ করুন');
      return;
    }

    const assignedBatch = batches.find(b => b.id === newStudent.batchId);
    addStudent({
      ...newStudent,
      batchName: assignedBatch ? assignedBatch.name : 'সাধারণ ব্যাচ'
    });

    setIsAddStudentModalOpen(false);
    setNewStudent({
      name: '',
      nameEn: '',
      roll: '',
      className: 'HSC 2026',
      batchId: batches[0]?.id || '',
      phone: '',
      guardianName: '',
      guardianPhone: '',
      address: '',
      monthlyFee: 1500,
      discount: 0
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{t('studentsTitle')}</h1>
          <p>{t('studentsSubtitle')}</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddStudentModalOpen(true)}>
            <UserPlus size={16} />
            <span>{t('btnAddStudent')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div className="filter-toolbar">
          <div className="input-with-icon" style={{ minWidth: '280px', flex: 1 }}>
            <Search size={16} className="input-icon" />
            <input
              type="text"
              className="form-control"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="form-control"
              style={{ width: '160px' }}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">{t('allClasses')}</option>
              <option value="HSC 2026">HSC 2026</option>
              <option value="SSC 2026">SSC 2026</option>
              <option value="Class 9">Class 9</option>
              <option value="Admission">Admission</option>
            </select>

            <select
              className="form-control"
              style={{ width: '200px' }}
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="all">{t('allBatches')}</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              className="form-control"
              style={{ width: '140px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">{t('allStatus')}</option>
              <option value="active">{t('statusActive')}</option>
              <option value="inactive">{t('statusInactive')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('colStudentId')}</th>
                <th>{t('colName')}</th>
                <th>{t('colRoll')}</th>
                <th>{t('colClass')}</th>
                <th>{t('colBatch')}</th>
                <th>{t('colGuardian')}</th>
                <th>{t('colFee')}</th>
                <th>বকেয়া</th>
                <th>{t('colStatus')}</th>
                <th style={{ textAlign: 'center' }}>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    কোন শিক্ষার্থী খুঁজে পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: '0.82rem' }}>
                        {student.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        📞 {student.phone}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>#{student.roll}</span>
                    </td>
                    <td>{student.className}</td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{student.batchName}</span>
                    </td>
                    <td>
                      <div>{student.guardianName || 'অভিভাবক'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {student.guardianPhone}
                      </div>
                    </td>
                    <td>
                      <strong>৳{Number(student.monthlyFee).toLocaleString('bn-BD')}</strong>
                      {student.discount > 0 && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--success-600)' }}>
                          ছাড়: ৳{student.discount}
                        </div>
                      )}
                    </td>
                    <td>
                      {Number(student.dueAmount) > 0 ? (
                        <span className="status-pill due">৳{student.dueAmount}</span>
                      ) : (
                        <span className="status-pill paid">পরিশোধিত</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${student.status === 'active' ? 'active' : 'inactive'}`}>
                        {student.status === 'active' ? t('statusActive') : t('statusInactive')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setProfileStudent(student)}
                          title={t('btnViewProfile')}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setIdCardStudent(student)}
                          title={t('btnIdCard')}
                        >
                          <IdCard size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setIsFeeCounterOpen(true)}
                          title={t('btnCollectFee')}
                        >
                          <CreditCard size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (window.confirm(`${student.name}-কে তালিকা থেকে মুছে ফেলতে চান?`)) {
                              deleteStudent(student.id);
                            }
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Student Form */}
      {isAddStudentModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3>
                <UserPlus size={20} color="var(--primary-500)" />
                {t('modalAddStudentTitle')}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsAddStudentModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('fieldStudentName')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ আবরার ফাইয়াজ"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('fieldRoll')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="উদাঃ 105"
                      value={newStudent.roll}
                      onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('fieldClass')}</label>
                    <select
                      className="form-control"
                      value={newStudent.className}
                      onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                    >
                      <option value="HSC 2026">HSC 2026</option>
                      <option value="SSC 2026">SSC 2026</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Admission">Admission</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('fieldBatch')}</label>
                    <select
                      className="form-control"
                      value={newStudent.batchId}
                      onChange={(e) => setNewStudent({ ...newStudent, batchId: e.target.value })}
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.name} (ফি: ৳{b.monthlyFee})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('fieldPhone')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="017XX-XXXXXX"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('fieldGuardianPhone')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="018XX-XXXXXX"
                      value={newStudent.guardianPhone}
                      onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('fieldGuardianName')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="অভিভাবকের নাম"
                      value={newStudent.guardianName}
                      onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('fieldMonthlyFee')}</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newStudent.monthlyFee}
                      onChange={(e) => setNewStudent({ ...newStudent, monthlyFee: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('fieldAddress')}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="বর্তমান ঠিকানা"
                    value={newStudent.address}
                    onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddStudentModalOpen(false)}
                >
                  {t('btnCancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  {t('btnSaveStudent')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
