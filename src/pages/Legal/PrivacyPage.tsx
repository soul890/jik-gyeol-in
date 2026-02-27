import { usePageTitle } from '@/hooks/usePageTitle';

export function PrivacyPage() {
  usePageTitle('개인정보처리방침');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-warm-800 mb-8">개인정보처리방침</h1>

      <div className="prose prose-warm max-w-none space-y-6 text-warm-700 text-sm leading-relaxed">
        <p>
          직결-인(이하 "회사")은 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등
          관련 법령에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수
          있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제1조 (수집하는 개인정보 항목)</h2>
          <p>회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다.</p>
          <div className="bg-warm-50 rounded-lg p-4 mt-2">
            <p className="font-semibold text-warm-800 mb-2">필수 항목</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>이메일 주소, 비밀번호, 닉네임</li>
              <li>Google 로그인 시: 이메일, 이름, 프로필 사진</li>
            </ul>
            <p className="font-semibold text-warm-800 mb-2 mt-3">선택 항목</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>주소(지역), 연락처</li>
            </ul>
            <p className="font-semibold text-warm-800 mb-2 mt-3">자동 수집 항목</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>서비스 이용 기록, 접속 로그, IP 주소, 브라우저 정보</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제2조 (개인정보의 수집 및 이용 목적)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>회원 관리:</strong> 회원 식별, 가입 의사 확인, 본인 확인, 부정 이용 방지</li>
            <li><strong>서비스 제공:</strong> 업체 검색, 구인구직, 커뮤니티, 채팅 상담 서비스 제공</li>
            <li><strong>결제 처리:</strong> 유료 서비스 결제, 환불 처리</li>
            <li><strong>고객 지원:</strong> 문의 응대, 불만 처리, 공지사항 전달</li>
            <li><strong>서비스 개선:</strong> 통계 분석, 서비스 품질 향상</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제3조 (개인정보의 보유 및 이용 기간)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원 탈퇴 시 지체 없이 파기합니다.</li>
            <li>다만, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</li>
          </ul>
          <div className="bg-warm-50 rounded-lg p-4 mt-2">
            <ul className="space-y-1">
              <li>전자상거래법에 따른 계약/결제 기록: <strong>5년</strong></li>
              <li>소비자 불만/분쟁 처리 기록: <strong>3년</strong></li>
              <li>통신비밀보호법에 따른 접속 로그: <strong>3개월</strong></li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제4조 (개인정보의 제3자 제공)</h2>
          <p>
            회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
            다만, 다음의 경우에는 예외로 합니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법률에 특별한 규정이 있거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제5조 (개인정보의 위탁)</h2>
          <div className="bg-warm-50 rounded-lg p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200">
                  <th className="text-left py-2 text-warm-800">위탁 업체</th>
                  <th className="text-left py-2 text-warm-800">위탁 업무</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-warm-100">
                  <td className="py-2">Google Firebase</td>
                  <td className="py-2">회원 인증, 데이터 저장, 파일 호스팅</td>
                </tr>
                <tr>
                  <td className="py-2">토스페이먼츠</td>
                  <td className="py-2">결제 처리</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제6조 (이용자의 권리)</h2>
          <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>개인정보 열람, 정정, 삭제 요구</li>
            <li>개인정보 처리 정지 요구</li>
            <li>회원 탈퇴를 통한 개인정보 삭제</li>
          </ul>
          <p className="mt-2">마이페이지에서 직접 열람·수정이 가능하며, 고객센터를 통해 요청할 수도 있습니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제7조 (개인정보의 안전성 확보 조치)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>비밀번호 암호화 저장 (Firebase Authentication)</li>
            <li>SSL/TLS 암호화 통신</li>
            <li>Firestore 보안 규칙을 통한 접근 제어</li>
            <li>개인정보 접근 권한 최소화</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제8조 (개인정보 보호책임자)</h2>
          <div className="bg-warm-50 rounded-lg p-4">
            <p>개인정보 보호 관련 문의는 아래로 연락해주세요.</p>
            <ul className="mt-2 space-y-1">
              <li>담당: 개인정보 보호책임자</li>
              <li>이메일: privacy@jik-gyeol-in.com</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제9조 (개인정보처리방침 변경)</h2>
          <p>
            이 개인정보처리방침은 시행일로부터 적용되며, 변경 사항이 있을 경우
            웹사이트를 통하여 공지합니다.
          </p>
        </section>

        <p className="text-warm-400 pt-4 border-t border-warm-200">
          시행일자: 2026년 2월 27일
        </p>
      </div>
    </div>
  );
}
