import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const saveChanges = async () => {
    // your update logic here
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>
        {/* Profile form or UI goes here */}
      </div>
    </div>
  );
}

export default Profile;
