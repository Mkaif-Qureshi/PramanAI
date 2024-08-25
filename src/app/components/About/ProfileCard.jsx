import Image from 'next/image';
import './styles.css'; 

export default function ProfileCard({ imgSrc, name, role }) {
    return (
        <div className="profile-card">
            <div className="profile-card-image">
                <Image
                    src={imgSrc}
                    alt={`Profile picture of ${name}`}
                    layout="fill"
                    objectFit="cover"
                    priority // Add this to ensure images load quickly
                />
            </div>
            <div className="profile-card-overlay">
                <div className="profile-card-text">
                    <h3 className="text-2xl font-semibold mb-2 text-white">{name}</h3>
                    <p className="text-white">{role}</p>
                </div>
            </div>
        </div>
    );
}
