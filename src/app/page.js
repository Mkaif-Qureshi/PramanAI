import Header from './components/Header';
import Footer from './components/Footer';

import Image from 'next/image';

export default function Home() {
    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-between bg-gray-100">

                {/* Features Section */}
                <section className="features py-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Advanced Features</h2>
                    <div className="grid md:grid-cols-3 gap-8 px-6 max-w-5xl mx-auto">
                        <div className="feature bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <Image
                                src="/images/data-extraction.jpg"
                                alt="Automated Data Extraction"
                                width={270}
                                height={270}
                                className='mx-auto mb-4'
                            />
                            <h3 className="text-xl font-semibold text-gray-900">AI-Driven Data Extraction</h3>
                            <p className="text-gray-700">Efficiently extract relevant data from legal documents using advanced AI algorithms, including NLP and ML techniques.</p>
                        </div>
                        <div className="feature bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <Image
                                src="/images/metadata-analysis.jpg"
                                alt="Metadata Analysis"
                                width={270}
                                height={270}
                                className='mx-auto mb-4'
                            />
                            <h3 className="text-xl font-semibold text-gray-900">Comprehensive Metadata Analysis</h3>
                            <p className="text-gray-700">Analyze metadata to gain deeper insights, improve document management, and enhance search capabilities.</p>
                        </div>
                        <div className="feature bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <Image
                                src="/images/doc-classification.jpg"
                                alt="Document Classification"
                                width={270}
                                height={270}
                                className='mx-auto mb-4'
                            />
                            <h3 className="text-xl font-semibold text-gray-900">Accurate Document Classification</h3>
                            <p className="text-gray-700">Classify documents accurately and quickly using AI-powered classification algorithms, enabling streamlined processing and reduced errors.</p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="how-it-works py-20 relative bg-light-gray px-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 opacity-20 z-0"></div>
                    <h2 className="text-3xl font-bold text-gray-900 relative z-10">How PramanAI Works</h2>
                    <div className="mt-8 relative z-10">
                        <p className="text-lg text-gray-700">1. Upload Legal Documents</p>
                        <p className="text-lg text-gray-700">2. AI Analyzes Data and Metadata</p>
                        <p className="text-lg text-gray-700">3. Extracted Data and Insights Available for Review</p>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="benefits py-20 ">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Benefits of Our Solution</h2>
                    <div className="grid md:grid-cols-3 gap-8 px-6 max-w-5xl mx-auto">
                        <div className="benefit bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <img src="/icons/benefit1.svg" alt="Benefit 1" className="mx-auto mb-4 w-16 h-16" />
                            <h3 className="text-xl font-semibold text-gray-900">Increased Efficiency</h3>
                            <p className="text-gray-700">Automate data extraction and analysis to save time and reduce errors.</p>
                        </div>
                        <div className="benefit bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <img src="/icons/benefit2.svg" alt="Benefit 2" className="mx-auto mb-4 w-16 h-16" />
                            <h3 className="text-xl font-semibold text-gray-900">Improved Accuracy</h3>
                            <p className="text-gray-700">AI-driven analysis ensures high accuracy in data extraction and insights.</p>
                        </div>
                        <div className="benefit bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <img src="/icons/benefit3.svg" alt="Benefit 3" className="mx-auto mb-4 w-16 h-16" />
                            <h3 className="text-xl font-semibold text-gray-900">Enhanced Decision Making</h3>
                            <p className="text-gray-700">Gain deeper insights and make informed decisions with our solution.</p>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="cta py-20 text-black">
                    <h2 className="text-3xl font-bold mb-8">Get Started with Our Solution</h2>
                    <a href="/get-started" className="btn btn-primary hover:scale-105 transition-transform duration-300">Learn More</a>
                </section>

            </main>
            <Footer />
        </>
    );
}