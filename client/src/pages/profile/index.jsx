import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { UPDATE_PROFILE_ROUTE } from '@/utils/constants';
import { colors, getColor } from '@/lib/utils';

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const Validateprofile = () => {
    if (!firstName || !lastName) {
      toast.error("Credentials Required");
      return false;
    }
    return true;
  };

 

  const saveChanges = async () => {
    if (Validateprofile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color: selectedColor, // ✅ Send index only
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully");
          navigate('/chat');
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.");
      }
    }
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

        <div className="grid grid-cols-2 gap-6">
          <div
            className="h-32 w-32 md:h-48 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-full w-full rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase w-full h-full text-5xl flex items-center justify-center rounded-full ${getColor(selectedColor)}`}
                >
                  {(firstName || userInfo?.email || "")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </Avatar>

            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-2xl rounded-full">
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
          </div>

          {/* Color Selector */}
          <div className="w-full flex gap-5 flex-wrap">
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => setSelectedColor(index)}
                className={`h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${color} ${
                  selectedColor === index ? 'ring-2 ring-white' : ''
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-5 min-w-32 md:min-w-64 text-white items-center justify-center">
            <Input
              value={userInfo?.email || ''}
              placeholder="Email"
              type="email"
              disabled
              autoComplete="username"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
            />
            <Input
              value={firstName}
              placeholder="First Name"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
            />
            <Input
              value={lastName}
              placeholder="Second Name"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
            />
            <Button
              className="bg-[#3e98f0] text-white w-full hover:bg-blue-600 transition-all duration-200"
              onClick={saveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
