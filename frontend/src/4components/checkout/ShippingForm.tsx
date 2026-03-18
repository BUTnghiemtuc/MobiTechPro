import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './ShippingForm.module.css';

interface ShippingFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  zipCode: string;
  notes: string;
}

interface ShippingFormProps {
  onNext: (data: ShippingFormData) => void;
  isGuest: boolean;
  onToggleGuest: () => void;
}

const ShippingForm = ({ onNext, isGuest, onToggleGuest }: ShippingFormProps) => {
  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: '', phone: '', email: '', address: '',
    city: '', district: '', ward: '', zipCode: '', notes: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Tự động xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name as keyof ShippingFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ShippingFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (cần 10 chữ số)';
    }
    
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.city) newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
    if (!formData.district) newErrors.district = 'Vui lòng chọn quận/huyện';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    } else {
      toast.error('Vui lòng kiểm tra và điền đầy đủ các ô báo đỏ!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Thông Tin Giao Hàng</h2>

      {/* Tùy chọn mua hàng: Đăng nhập hoặc Khách */}
      <div className={styles.guestToggleGroup}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            checked={!isGuest}
            onChange={() => !isGuest || onToggleGuest()}
            className={styles.radioInput}
          />
          <span className={styles.radioText}>Đăng nhập</span>
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            checked={isGuest}
            onChange={() => isGuest || onToggleGuest()}
            className={styles.radioInput}
          />
          <span className={styles.radioText}>Mua với tư cách khách</span>
        </label>
      </div>

      {/* Họ tên & Điện thoại */}
      <div className={styles.grid2Col}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Họ và tên <span className={styles.requiredMark}>*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`${styles.inputField} ${errors.fullName ? styles.inputError : ''}`}
            placeholder="VD: Nguyễn Văn A"
          />
          {errors.fullName && <p className={styles.errorText}>{errors.fullName}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Số điện thoại <span className={styles.requiredMark}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`${styles.inputField} ${errors.phone ? styles.inputError : ''}`}
            placeholder="09xx xxx xxx"
          />
          {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
        </div>
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Email <span className={styles.requiredMark}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
          placeholder="email@example.com"
        />
        {errors.email && <p className={styles.errorText}>{errors.email}</p>}
      </div>

      {/* Địa chỉ */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Địa chỉ số nhà, tên đường <span className={styles.requiredMark}>*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`${styles.inputField} ${errors.address ? styles.inputError : ''}`}
          placeholder="123 Nguyễn Huệ"
        />
        {errors.address && <p className={styles.errorText}>{errors.address}</p>}
      </div>

      {/* Khu vực Tỉnh/Quận/Phường */}
      <div className={styles.grid3Col}>
        <div>
          <label className={styles.label}>
            Tỉnh/Thành phố <span className={styles.requiredMark}>*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`${styles.inputField} ${errors.city ? styles.inputError : ''}`}
          >
            <option value="">Chọn tỉnh/thành</option>
            <option value="hcm">TP. Hồ Chí Minh</option>
            <option value="hn">Hà Nội</option>
            <option value="dn">Đà Nẵng</option>
            {/* TODO: Lấy data từ API Tỉnh/Thành thực tế */}
          </select>
          {errors.city && <p className={styles.errorText}>{errors.city}</p>}
        </div>

        <div>
          <label className={styles.label}>
            Quận/Huyện <span className={styles.requiredMark}>*</span>
          </label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            disabled={!formData.city}
            className={`${styles.inputField} ${!formData.city ? styles.inputFieldDisabled : ''} ${errors.district ? styles.inputError : ''}`}
          >
            <option value="">Chọn quận/huyện</option>
            <option value="q1">Quận 1</option>
            <option value="q2">Quận 2</option>
            {/* TODO: Load tùy theo Tỉnh/Thành */}
          </select>
          {errors.district && <p className={styles.errorText}>{errors.district}</p>}
        </div>

        <div>
          <label className={styles.label}>Phường/Xã</label>
          <select
            name="ward"
            value={formData.ward}
            onChange={handleChange}
            disabled={!formData.district}
            className={`${styles.inputField} ${!formData.district ? styles.inputFieldDisabled : ''}`}
          >
            <option value="">Chọn phường/xã</option>
            {/* TODO: Load tùy theo Quận/Huyện */}
          </select>
        </div>
      </div>

      {/* Ghi chú */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Ghi chú (tùy chọn)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className={styles.inputField}
          placeholder="Ghi chú về đơn hàng (ví dụ: giao giờ hành chính, gọi trước khi giao...)"
        />
      </div>

      {/* Nút Submit */}
      <div className={styles.submitGroup}>
        <button type="submit" className={styles.submitBtn}>
          Tiếp tục thanh toán →
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;