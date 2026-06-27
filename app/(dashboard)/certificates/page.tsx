import Link from "next/link";
import { CertificateList } from "./certificate-list";

export default function CertificatesPage() {
  return (
    <>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">คลังประกาศนียบัตร</p>
          <h1>ทุกความสำเร็จ เก็บไว้ในไฟล์</h1>
        </div>
        <div className="ws-header-actions">
          <Link className="btn btn-primary" href="/certificates/new">อัปโหลดไฟล์</Link>
        </div>
      </header>

      <div className="ws-body">
        <CertificateList />
      </div>
    </>
  );
}
