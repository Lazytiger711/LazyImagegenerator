import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function GuidePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-gray-900 selection:bg-orange-200">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-500 hover:text-orange-600 font-bold transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        돌아가기
                    </button>
                    <span className="font-bold text-lg tracking-tight">Lazy <span className="text-orange-600">Guide</span></span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* Intro Section */}
                <section className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900 break-keep">
                        상상을 현실로 만드는<br />
                        <span className="text-orange-600">가장 게으른 방법</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-8 break-keep">
                        복잡한 프롬프트 공부는 그만. <br />
                        직관적인 카드 덱 시스템으로 누구나 전문가급 AI 이미지를 생성할 수 있습니다.
                    </p>
                </section>

                {/* Step by Step Guide */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center">
                        <BookOpen className="mr-3 text-orange-500" />
                        사용 방법 (How to use)
                    </h2>

                    <div className="space-y-12">
                        {/* Step 1: Type */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                                <img src="/icons/type-icon.png" alt="Type" className="w-full h-full object-contain" />
                            </div>
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold mb-4">STEP 01 • TYPE</span>
                                <h3 className="text-xl font-bold mb-3">피사체와 배경 입력</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    먼저 <strong>무엇을 그릴지</strong> 입력하세요.
                                    <br />
                                    "썬글라스를 쓴 힙한 호랑이" 같은 메인 캐릭터와
                                    <br />
                                    "네온 사인이 빛나는 서울의 밤거리" 같은 배경을 자유롭게 적어보세요.
                                </p>
                            </div>
                        </div>

                        {/* Step 2: Pick */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                                <img src="/icons/pick-icon.png" alt="Pick" className="w-full h-full object-contain" />
                            </div>
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4">STEP 02 • PICK</span>
                                <h3 className="text-xl font-bold mb-3">스타일과 구도 선택</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    왼쪽 <strong>소품 상자</strong>에서 원하는 카드를 선택하세요.
                                    <br />
                                    앵글, 샷 타입, 조명, 스타일 등을 <strong>클릭만</strong> 하면 자동으로 추가됩니다.
                                    <br />
                                    복잡한 용어는 몰라도 괜찮아요. 아이콘만 보고 골라보세요!
                                </p>
                            </div>
                        </div>

                        {/* Step 3: Draw */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                                <img src="/icons/draw-icon.png" alt="Draw" className="w-full h-full object-contain" />
                            </div>
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-4">STEP 03 • DRAW</span>
                                <h3 className="text-xl font-bold mb-3">AI의 시선 (선택)</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    캔버스에 <strong>브러시</strong>로 대략적인 위치를 그리거나,
                                    <br />
                                    <strong>스탬프</strong>로 오브젝트를 배치해보세요.
                                    <br />
                                    AI가 이 구도를 분석해서 더 정교한 프롬프트를 만들어줍니다. (생략 가능)
                                </p>
                            </div>
                        </div>

                        {/* Step 4: Generate */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                                <img src="/icons/generate-icon.png" alt="Generate" className="w-full h-full object-contain" />
                            </div>
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-4">STEP 04 • GENERATE</span>
                                <h3 className="text-xl font-bold mb-3">프롬프트 생성 및 복사</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    하단의 <strong>'프롬프트 생성'</strong> 버튼을 누르세요.
                                    <br />
                                    완성된 프롬프트를 복사해서 <strong>Midjourney</strong>나 <strong>ChatGPT/Gemini</strong>에
                                    <br />
                                    붙여넣기만 하면 끝입니다!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Recap */}
                <section className="bg-gray-900 text-white p-8 md:p-12 rounded-3xl mb-12">
                    <h2 className="text-2xl font-bold mb-8 flex items-center">
                        <Zap className="mr-3 text-yellow-400" />
                        주요 기능 한눈에 보기
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                            <CheckCircle2 className="text-green-400 mr-3 mt-1 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold mb-1">직관적인 소품 상자</h4>
                                <p className="text-gray-400 text-sm">복잡한 용어 대신 아이콘 카드로 쉽게 선택하세요.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle2 className="text-green-400 mr-3 mt-1 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold mb-1">비주얼 가이드 생성</h4>
                                <p className="text-gray-400 text-sm">그림 위치까지 설명하는 정교한 프롬프트를 만듭니다.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle2 className="text-green-400 mr-3 mt-1 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold mb-1">모바일 최적화</h4>
                                <p className="text-gray-400 text-sm">언제 어디서든 터치 한번으로 아이디어를 구체화하세요.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle2 className="text-green-400 mr-3 mt-1 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold mb-1">나만의 갤러리</h4>
                                <p className="text-gray-400 text-sm">만든 프롬프트를 저장하고 언제든 다시 불러오세요.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200"
                    >
                        지금 바로 시작하기
                        <Wand2 className="ml-2" size={20} />
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12 text-center text-gray-400 text-sm">
                <p>&copy; {new Date().getFullYear()} Lazy Tiger Generator. All rights reserved.</p>
            </footer>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
