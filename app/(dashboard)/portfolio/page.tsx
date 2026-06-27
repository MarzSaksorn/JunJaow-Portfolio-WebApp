import { PortfolioGenerator } from "./portfolio-generator";

export default function PortfolioPage() {
  return (
    <>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">สร้างพอร์ตโฟลิโอ</p>
          <h1>สร้างหน้าอัตโนมัติ</h1>
        </div>
      </header>

      <div className="ws-body">
        <PortfolioGenerator />
      </div>
    </>
  );
}
