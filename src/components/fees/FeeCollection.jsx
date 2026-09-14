import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Plus,
  Search,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  X,
  CheckCircle,
  FileText
} from 'lucide-react';

export const FeeCollection = () => {
  const {
    feeRecords,
    students,
    batches,
    addFeeRecord,
    setReceiptToPrint,
    isFeeCounterOpen,
    setIsFeeCounterOpen,
    t
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // New Fee Collection Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [feeMonth, setFeeMonth] = useState('মার্চ ২০২৬');
  const [feeType, setFeeType] = useState('মাসিক বেতন');
  const [amount, setAmount] = useState(1500);
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(1500);
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [transactionRef, setTransactionRef] = useState('');

  // Handle student selection change
  const handleStudentSelect = (stdId) => {
    setSelectedStudentId(stdId);
    const std = students.find(s => s.id === stdId);
    if (std) {
      const baseFee = Number(std.monthlyFee || 1500);
      const disc = Number(std.discount || 0);
      setAmount(baseFee);
      setDiscount(disc);
      setPaidAmount(Math.max(0, baseFee - disc));
    }
  };

  const handleSaveFee = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const newRecord = addFeeRecord({
      studentId: student.id,
      studentName: student.name,
      roll: student.roll,
      phone: student.phone,
      batchName: student.batchName,
      month: feeMonth,
      feeType,
      amount: Number(amount),
      discount: Number(discount),
      paidAmount: Number(paidAmount),
      dueAmount: Math.max(0, Number(amount) - Number(discount) - Number(paidAmount)),
      method: transactionRef ? `${paymentMethod} (${transactionRef})` : paymentMethod
    });

    setIsFeeCounterOpen(false);
    // Directly open print receipt modal
    setReceiptToPrint(newRecord);
  };

  // Filter records
  const filteredRecords = feeRecords.filter(rec => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.roll.includes(searchTerm);

    const matchesMonth = selectedMonth === 'all' || rec.month === selectedMonth;

    return matchesSearch && matchesMonth;
  });

  const totalCollectedInList = filteredRecords.reduce((sum, r) => sum + Number(r.paidAmount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{t('feesTitle')}</h1>
          <p>{t('feesSubtitle')}</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsFeeCounterOpen(true)}>
            <Plus size={16} />
            <span>{t('btnOpenCounter')}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">মোট সংগৃহীত ফি</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--success-bg)', color: 'var(--success-600)' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success-600)' }}>
            ৳{totalCollectedInList.toLocaleString('bn-BD')}
          </div>
          <div className="stat-trend positive">রসিদ সংখ্যা: {filteredRecords.length}টি</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">সর্বাধিক পেমেন্ট মাধ্যম</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="stat-value">bKash</div>
          <div className="stat-trend positive">৭৫% ডিজিটাল কালেকশন</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">চলতি মাসের লক্ষ্যমাত্রা</span>
            <div className="stat-icon-wrap" style={{ background: 'var(--info-bg)', color: 'var(--info-600)' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="stat-value">৳ ১,৫০,০০০</div>
          <div className="stat-trend positive">অর্জন: ৬৮%</div>
        </div>
      </div>

      {/* Search & Month Filter Toolbar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div className="filter-toolbar">
          <div className="input-with-icon" style={{ minWidth: '300px', flex: 1 }}>
            <Search size={16} className="input-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="রসিদ নং, শিক্ষার্থী বা রোল দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="form-control"
              style={{ width: '180px' }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all">সকল মাস</option>
              <option value="মার্চ ২০২৬">মার্চ ২০২৬</option>
              <option value="ফেব্রুয়ারি ২০২৬">ফেব্রুয়ারি ২০২৬</option>
              <option value="জানুয়ারি ২০২৬">জানুয়ারি ২০২৬</option>
            </select>
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('colReceiptNo')}</th>
                <th>শিক্ষার্থীর নাম ও রোল</th>
                <th>ব্যাচ</th>
                <th>{t('colMonth')}</th>
                <th>বিবরণ</th>
                <th>পরিশোধের মাধ্যম</th>
                <th>{t('colPaidAmount')}</th>
                <th>{t('colDate')}</th>
                <th style={{ textAlign: 'center' }}>{t('btnPrintReceipt')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    কোন ফি লেনদেন পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--primary-600)' }}>
                        {rec.receiptNo}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{rec.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        রোল #{rec.roll} • {rec.studentId}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem' }}>{rec.batchName}</span>
                    </td>
                    <td>
                      <span className="status-pill info">{rec.month}</span>
                    </td>
                    <td>{rec.feeType}</td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{rec.method}</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--success-600)', fontSize: '0.95rem' }}>
                        ৳{Number(rec.paidAmount).toLocaleString('bn-BD')}
                      </strong>
                    </td>
                    <td>{rec.date}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setReceiptToPrint(rec)}
                        title="রসিদ প্রিন্ট করুন"
                      >
                        <Printer size={15} />
                        রসিদ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Fee Collection Counter */}
      {isFeeCounterOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>
                <CreditCard size={20} color="var(--primary-500)" />
                {t('btnOpenCounter')}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsFeeCounterOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFee}>
              <div className="modal-body">
                {/* Student Selection */}
                <div className="form-group">
                  <label className="form-label">শিক্ষার্থী নির্বাচন করুন *</label>
                  <select
                    className="form-control"
                    value={selectedStudentId}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    required
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} (রোল #{s.roll}) - {s.batchName} [বকেয়া: ৳{s.dueAmount}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ফি বাবদ মাস *</label>
                    <select
                      className="form-control"
                      value={feeMonth}
                      onChange={(e) => setFeeMonth(e.target.value)}
                    >
                      <option value="মার্চ ২০২৬">মার্চ ২০২৬</option>
                      <option value="এপ্রিল ২০২৬">এপ্রিল ২০২৬</option>
                      <option value="মে ২০২৬">মে ২০২৬</option>
                      <option value="জুন ২০২৬">জুন ২০২৬</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ফি এর বিবরণ</label>
                    <select
                      className="form-control"
                      value={feeType}
                      onChange={(e) => setFeeType(e.target.value)}
                    >
                      <option value="মাসিক বেতন">মাসিক বেতন</option>
                      <option value="মাসিক বেতন ও শিট ফি">মাসিক বেতন ও শিট ফি</option>
                      <option value="ভর্তি ফি">ভর্তি ফি</option>
                      <option value="মডেল টেস্ট ফি">মডেল টেস্ট ফি</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">নির্ধারিত ফি (৳)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={amount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAmount(val);
                        setPaidAmount(Math.max(0, val - discount));
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ছাড় / স্কলারশিপ (৳)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={discount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDiscount(val);
                        setPaidAmount(Math.max(0, amount - val));
                      }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">জমা কৃত টাকা (৳) *</label>
                    <input
                      type="number"
                      className="form-control"
                      style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-600)' }}
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">পেমেন্ট মেথড</label>
                    <select
                      className="form-control"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="bKash">বিকাশ (bKash)</option>
                      <option value="নগদ ক্যাশ">নগদ ক্যাশ</option>
                      <option value="Nagad">নগদ (Nagad)</option>
                      <option value="Rocket">রকেট (Rocket)</option>
                      <option value="Bank Transfer">ব্যাংক ট্রান্সফার</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ট্রানজেকশন আইডি / মোবাইল নম্বর (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="উদাঃ 01712-XXXXXX অথবা TrxID: 9X7AB2"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsFeeCounterOpen(false)}
                >
                  {t('btnCancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  টাকা জমা নিন ও রসিদ তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
