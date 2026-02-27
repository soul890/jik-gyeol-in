import { usePageTitle } from '@/hooks/usePageTitle';

export function TermsPage() {
  usePageTitle('이용약관');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-warm-800 mb-8">이용약관</h1>

      <div className="prose prose-warm max-w-none space-y-6 text-warm-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제1조 (목적)</h2>
          <p>
            이 약관은 직결-인(이하 "회사")이 제공하는 인테리어 직거래 플랫폼 서비스(이하 "서비스")의
            이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제2조 (정의)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>"서비스"란 회사가 제공하는 인테리어 업체 검색, 구인구직, 자재업체 연결, 커뮤니티 등 일체의 서비스를 말합니다.</li>
            <li>"회원"이란 이 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.</li>
            <li>"콘텐츠"란 회원이 서비스에 게시한 글, 사진, 댓글 등 일체의 정보를 말합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제3조 (약관의 효력 및 변경)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.</li>
            <li>회사는 관련 법령에 위배되지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정사유를 명시하여 현행 약관과 함께 7일 전 공지합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제4조 (서비스 이용계약의 체결)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>서비스 이용계약은 회원이 되고자 하는 자가 약관에 동의하고 회원가입 신청을 한 후 회사가 이를 승낙함으로써 체결됩니다.</li>
            <li>회사는 가입 신청자의 신청에 대하여 원칙적으로 승낙합니다. 다만, 허위 정보 기재, 기술적 장애 등의 사유가 있는 경우 승낙을 거부할 수 있습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제5조 (회원의 의무)</h2>
          <p>회원은 다음 각 호의 행위를 하여서는 안 됩니다.</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
            <li>서비스를 이용하여 법령 또는 공서양속에 반하는 행위</li>
            <li>다른 회원의 개인정보를 무단으로 수집, 이용하는 행위</li>
            <li>서비스의 운영을 방해하거나 안정적 운영을 저해하는 행위</li>
            <li>광고성 정보를 무단으로 전송하는 행위</li>
            <li>허위 리뷰를 작성하거나 업체 평판을 조작하는 행위</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제6조 (서비스의 제공 및 변경)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>회사는 회원에게 인테리어 업체 정보 제공, 구인구직 매칭, 자재업체 연결, 커뮤니티, 채팅 상담 등의 서비스를 제공합니다.</li>
            <li>회사는 서비스의 내용을 변경할 수 있으며, 변경 시 변경 내용을 사전에 공지합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제7조 (유료 서비스)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>회사는 Pro, Business 등 유료 구독 서비스를 제공합니다.</li>
            <li>유료 서비스의 이용 요금, 결제 방법 등은 해당 서비스 화면에 게시된 내용에 따릅니다.</li>
            <li>환불은 관련 법령 및 회사의 환불 정책에 따릅니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제8조 (게시물의 관리)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>회원이 게시한 콘텐츠의 저작권은 해당 회원에게 귀속됩니다.</li>
            <li>회사는 관련 법령에 위반되거나 다른 회원 또는 제3자의 권리를 침해하는 게시물을 삭제하거나 게시를 거부할 수 있습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제9조 (면책사항)</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>회사는 회원 간 또는 회원과 제3자 간의 거래에 대하여 책임을 지지 않습니다.</li>
            <li>회사는 천재지변 등 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
            <li>회사는 회원이 서비스에 게시한 정보의 신뢰성, 정확성에 대해 책임을 지지 않습니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-warm-800 mb-3">제10조 (분쟁해결)</h2>
          <p>
            서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 회원은 상호 협의하여 해결하며,
            합의가 이루어지지 않을 경우 민사소송법상의 관할법원에 소를 제기할 수 있습니다.
          </p>
        </section>

        <p className="text-warm-400 pt-4 border-t border-warm-200">
          시행일자: 2026년 2월 27일
        </p>
      </div>
    </div>
  );
}
