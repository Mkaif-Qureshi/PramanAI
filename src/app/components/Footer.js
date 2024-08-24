"use client"
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const footerData = [
    {
        id: 'about',
        categoryHeading: 'About Us',
        categoryData: ['Company Info', 'Careers', 'Contact'],
    },
    {
        id: 'services',
        categoryHeading: 'Services',
        categoryData: [
            'Legal Data Extraction',
            'Metadata Analysis',
            'Document Management',
        ],
    },
    {
        id: 'legal',
        categoryHeading: 'Legal',
        categoryData: ['Privacy Policy', 'Terms of Service'],
    },
];

const Footer = () => {
    const pathname = usePathname();
    const excludedRoutes = [
        '/liveroom',
        '/virtualexperience',
        '/freedesign',
        '/freesample',
    ];

    return (
        <footer
            className={`${excludedRoutes.includes(pathname) ? 'hidden' : ''
                } bg-light-gray lg:px-[67px] sm:px-[50px] px-[20px] py-10 mt-20 border-t`}
        >
            <div className="grid md:grid-cols-4 grid-cols-1 gap-10">
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Join the PramanAI Family</h2>
                    <p>Sign up for our newsletter to stay updated.</p>
                </div>
                {footerData.map((column) => (
                    <div key={column.id}>
                        <h3 className="text-lg font-semibold mb-2">{column.categoryHeading}</h3>
                        <ul>
                            {column.categoryData.map((item, index) => (
                                <li key={index} className="mb-1">
                                    <Link href="#" className="text-black hover:underline">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-300 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
                <div className="flex gap-4 mb-4 md:mb-0">
                    <a href="#" className="text-gray-800 hover:underline">
                        <Image
                            width={35}
                            height={35}
                            src="/icons/social-icon/facebook.svg"
                            alt="Facebook"
                        />
                    </a>
                    <a href="#" className="text-gray-800 hover:underline">
                        <Image
                            width={35}
                            height={35}
                            src="/icons/social-icon/instagram.svg"
                            alt="Instagram"
                        />
                    </a>
                    <a href="#" className="text-gray-800 hover:underline">
                        <Image
                            width={35}
                            height={35}
                            src="/icons/social-icon/twitter.svg"
                            alt="Twitter"
                        />
                    </a>
                    <a href="#" className="text-gray-800 hover:underline">
                        <Image
                            width={35}
                            height={35}
                            src="/icons/social-icon/youtube.svg"
                            alt="YouTube"
                        />
                    </a>
                </div>
                <div className="text-gray-800 mb-4 md:mb-0">
                    &copy; 2024 PramanAI. All rights reserved.
                </div>
                <div className="flex gap-4">
                    <Link href="/cookie-policy" className="text-gray-800 hover:underline">
                        Cookie Policy
                    </Link>
                    <Link href="/cookie-settings" className="text-gray-800 hover:underline">
                        Cookie Settings
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
