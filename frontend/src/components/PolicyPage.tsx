interface PolicyProps {
  title: string;
  lastUpdated: string;
}

const PolicyPage = ({ title, lastUpdated }: PolicyProps) => {
  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-500 mb-8 text-sm">Last Updated: {lastUpdated}</p>
        
        <div className="prose prose-slate prose-blue max-w-none">
          <p>
            This is a placeholder content for the <strong>{title}</strong>. In a real application, this page would contain the full legal text and details regarding our {title.toLowerCase()}.
          </p>
          
          <h3>1. Introduction</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <h3>2. Information Collection</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <h3>3. Use of Information</h3>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          
          <h3>4. Contact Us</h3>
          <p>
            If you have any questions about this {title}, please contact us at support@mobitechpro.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
