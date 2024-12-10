import React from 'react'
import { useNavigate } from 'react-router';
import CreatorHero from './components/creator/Hero';

const Profile = () => {
    const navigate = useNavigate();
    const profile = JSON.parse(localStorage.getItem('profile'));
    if(profile===null){
        navigate('/login');
    }
    
  return (
    <div>
      {profile.type=="creator" && <CreatorHero profile={profile} />}
    </div>
  )
}

export default Profile
