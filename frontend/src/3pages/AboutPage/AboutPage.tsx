import styles from './AboutPage.module.css';

const AboutPage = () => {
    return (
    <div className={`${styles.aboutContainer} container`}>
        <div className={styles.innerWrapper}>
          <h1 className={styles.title}>About MobiTechPro</h1>
          <div className={styles.content}>
            <p className={styles.leadText}>
              Welcome to generic e-commerce store, your number one source for all things tech. We're dedicated to giving you the very best of consumer electronics, with a focus on quality, customer service, and uniqueness.
            </p>
            <p className={styles.paragraph}>
              Founded in 2024, MobiTechPro has come a long way from its beginnings. When we first started out, our passion for eco-friendly and affordable gadgets drove us to do intense research so that MobiTechPro can offer you the world's most advanced electronics. We now serve customers all over the world and are thrilled that we're able to turn our passion into our own website.
            </p>
            <p className={styles.paragraph}>
              We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
            </p>
            <p className={styles.signature}>
              Sincerely,<br />
              The MobiTechPro Team
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutPage;
