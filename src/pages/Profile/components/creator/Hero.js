import React from "react";
import followerConverter from "../../../../utils/followerConverter";

const Hero = () => {
  const self = true;
  const creator = {
    id: "6744a21ba3967607247732cd",
    fullName: "Harsh ",
    email: "michaelburns@example.net",
    phone: "918797780714",
    password: "$2a$10$8YcAcKjXJlFrZRO0aXPW5.WqMhZ1WWL7iTCrLwFqc7wA.T3MW/loi",
    profilePicture:
      "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    location: {
      country: "United States Minor Outlying Islands",
      city: "Ambermouth",
    },
    type: "creator",
    basicComplete: false,
    socialHandles: null,
    followers: 289527,
    engagementRate: 0,
    portfolioUrl: "",
    bio: "Sit despite science want might. Even story professor cover.\nAmount behind coach eight realize Republican. Window sure reduce note thought interest. Cause cultural owner dream level situation issue.",
    skills: ["Photography", "Content Writing", "Public Speaking"],
    niche: ["Fitness", "Lifestyle"],
    languages: ["Spanish"],
    appliedJobs: null,
    savedJobs: null,
    minimumRate: 0,
    preferredRate: 0,
    currency: "INR",
    collabPreferences: null,
    rating: 4.2,
    reviewCount: 0,
    isVerified: false,
    accountStatus: "active",
    createdAt: "0001-01-01T00:00:00Z",
    updatedAt: "0001-01-01T00:00:00Z",
  };

  return (
    <div class="  relative flex flex-col items-center rounded-[10px] border-[1px] border-gray-200 w-[400px] mx-auto p-4 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] ">
      <div class="relative flex h-32 w-full justify-center rounded-xl bg-cover">
        <img
          src="https://img.freepik.com/free-photo/background-gradient-lights_23-2149304984.jpg?t=st=1733915806~exp=1733919406~hmac=93b073e7a63281743e5e97038e697b0a7943c14ab6bd6ed4ed1291c95b03fff0&w=1480"
          class="absolute flex h-32 w-full justify-center rounded-xl bg-cover"
        />
        <div class="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 ">
          <img
            class="h-full w-full rounded-full"
            src={creator.profilePicture}
            alt=""
          />
        </div>
      </div>
      <div class="mt-16 flex flex-col items-center">
        <h4 class="text-xl font-bold text-navy-700 ">{creator.fullName}</h4>
        <p class="text-base text-center font-normal text-gray-600">
          {creator.bio}
        </p>
      </div>
      <div class="mt-6 mb-3 flex gap-14 md:!gap-14">
        <div class="flex flex-col items-center justify-center">
          <p class="text-2xl font-bold text-navy-700 ">{creator.rating}</p>
          <p class="text-sm font-normal text-gray-600">Rating</p>
        </div>
        <div class="flex flex-col items-center justify-center">
          <p class="text-2xl font-bold text-navy-700 ">
            {followerConverter(creator.followers)}
          </p>
          <p class="text-sm font-normal text-gray-600">Followers</p>
        </div>
        <div class="flex flex-col items-center justify-center">
          <p class="text-2xl font-bold text-navy-700 ">{creator.reviewCount}</p>
          <p class="text-sm font-normal text-gray-600">Reviews</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
