import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Layout, MousePointer, Image as ImageIcon, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 font-sans selection:bg-orange-200 text-gray-900">

            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-orange-200">
                            {/* Use the same logo as App.jsx */}
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Lazy <span className="text-orange-600">Tiger</span></span>
                    </div>
                    <button
                        onClick={() => navigate('/app')}
                        className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-full transition-all"
                    >
                        앱 실행하기
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100/50 text-orange-700 text-sm font-medium mb-8 border border-orange-100">
                        <Zap size={16} className="mr-2" />
                        AI 이미지 생성이 이보다 쉬울 수는 없습니다
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-8 leading-tight break-keep">
                        상상을 현실로 만드는 <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">가장 게으른 방법</span>
                    </h1>

                    {/* Hero Image (Increased size by ~30%) */}
                    <div className="flex justify-center mb-10">
                        <div className="relative w-80 md:w-[26rem] lg:w-[32rem] aspect-[8.6/5.4]">
                            <img
                                src="/landing-hero.png"
                                alt="Lazy Tiger Hero"
                                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed break-keep">
                        복잡한 프롬프트 공부는 그만.<br className="hidden md:block" />
                        직관적인 카드 덱 시스템과 드래그 앤 드롭으로
                        누구나 전문가급 이미지를 생성하세요.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/app')}
                            className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white text-lg font-bold rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center group"
                        >
                            지금 바로 시작하기
                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 text-lg font-bold rounded-2xl border border-gray-200 transition-all">
                            사용법 알아보기
                        </button>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-100">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                <Layout className="text-orange-500" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">직관적인 Asset Deck</h3>
                            <p className="text-gray-500 leading-relaxed">
                                복잡한 설정창 대신 카드 덱을 사용하세요.
                                원하는 스타일, 구도, 샷을 눈으로 보고 고를 수 있습니다.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                <MousePointer className="text-blue-500" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Drag & Drop 워크플로우</h3>
                            <p className="text-gray-500 leading-relaxed">
                                마음에 드는 카드를 캔버스로 드래그하세요.
                                나머지는 Lazy Tiger가 알아서 처리합니다.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-100">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                <Wand2 className="text-purple-500" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">전문가급 프롬프트 자동 완성</h3>
                            <p className="text-gray-500 leading-relaxed">
                                단순한 선택도 미드저니, 스테이블 디퓨전이 이해하는
                                최적의 고퀄리티 프롬프트로 자동 변환됩니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Showcase / CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 z-0"></div>
                <div className="max-w-5xl mx-auto relative z-10 text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">
                        준비 되셨나요?
                    </h2>
                    <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
                        디자인 지식이 없어도 괜찮습니다.<br />
                        여러분의 상상력만 있으면 충분합니다.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <CheckCircle2 size={16} className="text-green-400" /> 무료 사용
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <CheckCircle2 size={16} className="text-green-400" /> 설치 불필요
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <CheckCircle2 size={16} className="text-green-400" /> 무제한 생성 테스트
                        </div>
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={() => navigate('/app')}
                            className="px-10 py-5 bg-white text-gray-900 text-xl font-bold rounded-2xl hover:bg-orange-50 transition-colors shadow-2xl"
                        >
                            무료로 시작하기
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
                    <p>&copy; 2026 Lazy Tiger Generator. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
