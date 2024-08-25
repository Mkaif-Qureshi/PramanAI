import ContactUs from '../components/About/ContactUs.jsx';
import ProfileCard from '../components/About/ProfileCard.jsx';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">

            {/* Contact Us Section */}
            <ContactUs />


            <section className="mb-16 py-6 px-6 ">
                <h1 className="text-4xl font-bold mb-6 text-gray-900 text-left">About PramanAI</h1>
                <p className="text-lg mb-4 text-gray-700 text-left leading-relaxed">
                    PramanAI is a cutting-edge AI-powered system designed for automated legal data extraction. Our solution efficiently processes and analyzes legal documents, providing valuable insights while ensuring compliance with the Supreme Court Rules, 2013.
                </p>
                <p className="text-lg mb-6 text-gray-700 text-left leading-relaxed">
                    Leveraging advanced machine learning algorithms and natural language processing, PramanAI transforms complex legal texts into structured, actionable data. Our mission is to enhance the efficiency and accuracy of legal data handling, making legal research and document management more accessible and effective.
                </p>
            </section>


            {/* Our Team Section */}
            {/* <section className="mb-16 mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 text-left">Meet the Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { name: 'John Doe', role: 'Lead AI Engineer', imgSrc: '/images/profiles/professional.jpeg' },
                        { name: 'Jane Smith', role: 'Project Manager', imgSrc: '/images/profiles/professional1.jpeg' },
                        { name: 'Alice Johnson', role: 'Data Scientist', imgSrc: '/images/profiles/professional2.jpeg' }
                    ].map((member, index) => (
                        <ProfileCard
                            key={index}
                            imgSrc={member.imgSrc}
                            name={member.name}
                            role={member.role}
                        />
                    ))}
                </div>
            </section> */}


        </div>
    );
}
