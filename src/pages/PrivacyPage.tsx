export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <p className="text-gray-600 mb-6">
              모아짐(이하 "회사")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」을 준수하고 있습니다.
            </p>
            <p className="text-gray-600 mb-6">
              본 개인정보처리방침은 2026년 2월 19일부터 적용됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 수집하는 개인정보 항목</h2>
            <p className="text-gray-700 mb-4">회사는 회원가입 없이 서비스를 제공하며, 다음의 정보만을 처리합니다:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">가. 자동 수집 정보</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>쿠키, 접속 IP, 방문 일시, 서비스 이용 기록</li>
              <li>기기 정보 (브라우저 종류, OS 정보)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">나. 서비스 이용 정보</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>포트폴리오 분석 시 입력한 자산 정보 (서버에 저장되지 않음)</li>
              <li>세금 계산 시 입력한 정보 (서버에 저장되지 않음)</li>
            </ul>
            <p className="text-sm text-gray-600 italic">
              * 자산 정보 및 세금 계산 정보는 브라우저에서만 처리되며, 서버에 전송 또는 저장되지 않습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 개인정보의 수집 및 이용 목적</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>서비스 제공 및 운영</li>
              <li>서비스 개선 및 통계 분석</li>
              <li>맞춤형 광고 제공 (Google AdSense)</li>
              <li>부정 이용 방지 및 보안</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-gray-700 mb-4">
              회사는 이용자의 개인정보를 서버에 저장하지 않습니다. 다만, 아래의 정보는 명시한 기간 동안 보유합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>웹사이트 접속 로그: 3개월</li>
              <li>쿠키: 브라우저 설정에 따라 보관 (삭제 가능)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-700 mb-4">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>법령에 의해 요구되는 경우</li>
              <li>이용자의 사전 동의가 있는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 개인정보 처리의 위탁</h2>
            <p className="text-gray-700 mb-4">
              회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Google AdSense</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                <li>위탁 목적: 맞춤형 광고 제공</li>
                <li>보유 및 이용 기간: 쿠키 정책에 따름</li>
                <li>개인정보 처리방침: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#F15F5F] hover:underline">Google 개인정보처리방침</a></li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Cloudflare</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                <li>위탁 목적: 웹사이트 호스팅 및 CDN 서비스</li>
                <li>보유 및 이용 기간: 서비스 제공 기간</li>
                <li>개인정보 처리방침: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-[#F15F5F] hover:underline">Cloudflare 개인정보처리방침</a></li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 이용자의 권리와 행사 방법</h2>
            <p className="text-gray-700 mb-4">이용자는 다음과 같은 권리를 가집니다:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정 요구</li>
              <li>개인정보 삭제 요구</li>
              <li>개인정보 처리 정지 요구</li>
            </ul>
            <p className="text-gray-700 mt-4">
              * 회사는 회원가입을 받지 않으며, 이용자의 개인정보를 서버에 저장하지 않습니다. 쿠키 삭제는 브라우저 설정에서 가능합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 쿠키(Cookie)의 운영 및 거부</h2>
            <p className="text-gray-700 mb-4">
              회사는 이용자에게 최적화된 서비스를 제공하기 위해 쿠키를 사용합니다.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">가. 쿠키의 사용 목적</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>서비스 이용 편의성 향상</li>
              <li>맞춤형 광고 제공</li>
              <li>방문 및 이용 형태 파악</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">나. 쿠키 설정 거부 방법</h3>
            <p className="text-gray-700 mb-2">브라우저 설정을 통해 쿠키를 거부할 수 있습니다:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Chrome: 설정 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터</li>
              <li>Safari: 환경설정 &gt; 개인정보 &gt; 쿠키 및 웹사이트 데이터</li>
              <li>Edge: 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리</li>
            </ul>
            <p className="text-sm text-gray-600 italic mt-4">
              * 쿠키 저장을 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 개인정보 보호책임자</h2>
            <p className="text-gray-700 mb-4">
              개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700"><strong>이메일:</strong> whtjdgh46@gmail.com</p>
              <p className="text-gray-700 mt-2"><strong>웹사이트:</strong> https://moajim.com</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 개인정보처리방침의 변경</h2>
            <p className="text-gray-700">
              본 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터 웹사이트를 통하여 공지할 것입니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. 개인정보의 안전성 확보조치</h2>
            <p className="text-gray-700 mb-4">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>개인정보의 암호화: HTTPS를 통한 안전한 통신</li>
              <li>해킹 등에 대비한 기술적 대책: 방화벽 및 보안 시스템 운영</li>
              <li>접속 기록의 보관 및 위변조 방지</li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-gray-700">
                <strong>공고일자:</strong> 2026년 2월 19일<br />
                <strong>시행일자:</strong> 2026년 2월 19일
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
