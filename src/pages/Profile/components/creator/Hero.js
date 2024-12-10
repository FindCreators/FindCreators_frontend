import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';

const CreatorHero = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
    // API call to fetch profile data for editing
    console.log('Edit profile');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // API call to save profile data
    console.log('Save profile');
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg shadow-lg text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.fullName}</h2>
            <p className="text-gray-300">{profile.email}</p>
            <p className="text-gray-300">{profile.phone}</p>
            <p className="text-gray-300">{profile.location?.city}, {profile.location?.country}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white"
            onClick={handleEditProfile}
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
      {isEditing && (
        <div className="mt-4">
          <label className="block text-gray-300">Full Name</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => {
              // Update profile state
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <label className="block text-gray-300 mt-2">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => {
              // Update profile state
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <label className="block text-gray-300 mt-2">Phone</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => {
              // Update profile state
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <label className="block text-gray-300 mt-2">Location</label>
          <input
            type="text"
            value={profile.location?.city}
            onChange={(e) => {
              // Update profile state
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
            onClick={handleSaveProfile}
          >
            Save
          </button>
        </div>
      )}
      <div className="mt-4">
        <p className="text-gray-300">{profile.followers} followers • {profile.engagementRate}% engagement rate</p>
        <p className="text-gray-300">{profile.skills?.join(', ')}</p>
        <p className="text-gray-300">{profile.niche?.join(', ')}</p>
        <p className="text-gray-300">{profile.languages?.join(', ')}</p>
      </div>
      <div className="mt-4 flex justify-between">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Open to
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add profile section
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Enhance profile
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Resources
        </button>
      </div>
      <p className="mt-4 text-gray-300">
        Tell non-profits you're interested in getting involved with your time and skills
      </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2">
        Get started
      </button>
    </div>
  );
};

export default CreatorHero;
