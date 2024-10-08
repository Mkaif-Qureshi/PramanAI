import Image from 'next/image';
import HowItWorks from './components/Home/HowItWorks';
import HeroSection from './components/Home/HeroSection';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-zinc-100">
            <HeroSection />

            {/* Features Section */}
            <section className="features py-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-12">Features</h2>
                <div className="grid md:grid-cols-3 gap-8 px-6 max-w-5xl mx-auto">
                    {[
                        { src: '/images/data-extraction.jpg', alt: 'Automated Data Extraction', title: 'AI-Driven Data Extraction', description: 'Efficiently extract relevant data from legal documents using advanced AI algorithms, including NLP and ML techniques.' },
                        { src: '/images/metadata-analysis.jpg', alt: 'Metadata Analysis', title: 'Comprehensive Metadata Analysis', description: 'Analyze metadata to gain deeper insights, improve document management, and enhance search capabilities.' },
                        { src: '/images/doc-classification.jpg', alt: 'Document Classification', title: 'Accurate Document Classification', description: 'Classify documents accurately and quickly using AI-powered classification algorithms, enabling streamlined processing and reduced errors.' }
                    ].map((feature, index) => (
                        <div key={index} className="feature bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                            <Image
                                src={feature.src}
                                alt={feature.alt}
                                width={270}
                                height={270}
                                className='mx-auto mb-4'
                            />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-700">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <HowItWorks />

            {/* Benefits Section */}
            <section className="benefits py-20 bg-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Benefits of Using ParamAI</h2>
                <div className="grid md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
                    {[
                        { src: '/images/streamline.jpg', alt: 'Streamlined Workflows', title: 'Streamlined Workflows', description: 'Automate repetitive tasks and optimize workflows to enhance productivity and reduce manual efforts.' },
                        { src: '/images/translator.jpg', alt: 'Superior Translation Accuracy', title: 'Superior Translation Accuracy', description: 'Achieve higher translation accuracy with AI models specially designed for Indian languages.' },
                        { src: '/images/data.jpg', alt: 'Data-Driven Insights', title: 'Data-Driven Insights', description: 'Extract actionable insights from complex data to support informed decision-making and strategic planning.' }
                    ].map((benefit, index) => (
                        <div key={index} className="benefit bg-white p-6 shadow-md hover:shadow-xl transition-shadow duration-300 text-center ">
                            <img src={benefit.src} alt={benefit.alt} className="mx-auto mb-4 w-150 " />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>



            {/* Call to Action Section */}
            <section className="cta py-20 text-black max-w-screen-xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8">Get Started with Our Solution</h2>
                <div className="relative inline-block mt-4">
                    <a
                        href="#learn-more"
                        className="relative inline-block text-gray-800 px-4 py-2 border border-black overflow-hidden group"
                    >
                        <span className="relative z-10 text-black">Let’s Go!</span>
                        {/* Border Animation */}
                        <span className="absolute inset-0 border-t-2 border-black transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
                        <span className="absolute inset-0 border-r-2 border-black transform -translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                        <span className="absolute inset-0 border-b-2 border-black transform translate-x-full transition-transform duration-300 group-hover:-translate-x-0"></span>
                        <span className="absolute inset-0 border-l-2 border-black transform translate-y-full transition-transform duration-300 group-hover:-translate-y-0"></span>
                    </a>
                </div>
            </section>
        </main>
    );
}
