import styles from './PolicyPage.module.css';

interface PolicyProps {
  title: string;
  lastUpdated: string;
}

const PolicyPage = ({ title, lastUpdated }: PolicyProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.date}>Cập nhật lần cuối: {lastUpdated}</p>
        
        {/* Khối content chứa Typography tự dựng */}
        <div className={styles.content}>
          <p>
            Đây là nội dung mẫu cho trang <strong>{title}</strong>. Trong ứng dụng thực tế, trang này sẽ chứa toàn bộ văn bản pháp lý và các chi tiết liên quan đến {title.toLowerCase()} của chúng tôi.
          </p>
          
          <h3>1. Giới thiệu</h3>
          <p>
            Chào mừng bạn đến với MobiTechPro. Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây. Vui lòng đọc kỹ các quy định trước khi thực hiện giao dịch.
          </p>

          <h3>2. Thu thập thông tin</h3>
          <p>
            Chúng tôi có thể thu thập thông tin cá nhân của bạn bao gồm: Họ tên, số điện thoại, email và địa chỉ giao hàng nhằm mục đích xử lý đơn hàng và cung cấp dịch vụ hỗ trợ khách hàng tốt nhất. Mọi thông tin đều được bảo mật tuyệt đối.
          </p>

          <h3>3. Sử dụng thông tin</h3>
          <p>
            Thông tin của bạn chỉ được sử dụng nội bộ trong quá trình xử lý đơn hàng, thông báo các chương trình khuyến mãi (nếu bạn đồng ý) và giải quyết các khiếu nại phát sinh. Chúng tôi cam kết không bán hay trao đổi dữ liệu với bên thứ ba.
          </p>
          
          <h3>4. Liên hệ với chúng tôi</h3>
          <p>
            Nếu bạn có bất kỳ câu hỏi nào về {title} này, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@mobitechpro.com">support@mobitechpro.com</a> hoặc gọi đến hotline: <strong>1900 1234</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;