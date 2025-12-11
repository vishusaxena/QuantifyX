import { Mail, Phone, User } from "lucide-react";
import { useTranslation } from "react-i18next";
function ProfileCard({
  previewUrl,
  currentUser,
  handleImageUpload,
  navigate,
  errors,
}) {
  const { t } = useTranslation();
  return (
    <div className="dark:bg-[#141b34] h-[400px] blue:bg-[#282828] light:bg-linear-to-br from-[#1E40AF] to-[#3B82F6] shadow-lg p-6 lg:w-[300px] md:w-[200px] w-full rounded-2xl flex flex-col items-center text-white">
      <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-xl border-4 dark:border-[#3e4f8b] light:border-white group">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="preview"
            className="w-full h-full object-cover"
          />
        ) : currentUser?.profilePic ? (
          <img
            src={currentUser.profilePic}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center dark:bg-[#2f395f] light:bg-linear-to-br from-blue-300 to-blue-500">
            <User size={55} className="text-white opacity-80" />
          </div>
        )}
        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-300">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            name="profilePic"
          />
        </label>
      </div>
      {errors.profilePic && (
        <span className="text-red-400">{errors.profilePic}</span>
      )}
      <p className="mt-4 text-white lg:text-2xl md:text-[15px] text-sm font-medium tracking-wide">
        {currentUser ? currentUser.name : "User"}
      </p>
      <div className="flex flex-col gap-2">
        <span className="flex gap-2 sm:text-sm">
          <Mail /> {currentUser && currentUser.email}
        </span>
        <span className="flex gap-2">
          <Phone />
          {currentUser && currentUser.phoneNo}
        </span>
      </div>
      <button
        className="px-7 py-2  bg-white my-auto text-black"
        style={{
          borderRadius: 8,
        }}
        onClick={() => {
          navigate("/preview");
        }}
      >
        {t("ProfileCard.preview")}
      </button>
    </div>
  );
}
export default ProfileCard;
