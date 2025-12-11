import React, { useRef, useState, useEffect } from "react";
import InputComponent from "../common-components/InputComponent";
import Button from "../common-components/Buttons";
import ProfileCard from "../components/ProfileCard";
import TabComponent from "../components/TabComponent";
import {
  User,
  Mail,
  Calendar,
  Phone,
  Link as LinkIcon,
  PersonStanding,
  GraduationCap,
  University,
  Calendar1,
  Percent,
  MapPinHouse,
  Building2,
  Flag,
  ScrollText,
  UserPen,
  User2Icon,
} from "lucide-react";
import { usedata } from "../context/dataContext";
import { toast } from "react-toastify";
import UserDetailsCard from "../components/UserDetailsCard";
import DeleteConfirmModal from "../common-components/DeleteConfirmModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SelectComponent from "../common-components/SelectComponent";

const Profilepage = () => {
  const { currentUser, updateCurrentUser } = usedata();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    dob: "",
    gender: "",
    phone: currentUser?.phoneNo || "",
    social: "",
    profilePic: currentUser?.profilePic || "",
    about: "",
  });
  const [profileData, setProfileData] = useState(() => {
    const stored = localStorage.getItem("profileData");
    return stored ? JSON.parse(stored) : [];
  });
  const [educationalData, setEducationalData] = useState({
    qualification: "",
    college: "",
    startDate: "",
    endDate: "",
    marks: "",
    isPursuing: false,
  });
  const [addressData, setAddressData] = useState({
    currentAddress: "",
    currentCity: "",
    currentState: "",
    currentCountry: "",
    currentZipCode: "",

    permanentAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",

    sameAsCurrent: false,
  });

  const [employmentData, setEmploymentData] = useState({
    jobTitle: "",
    company: "",
    joiningDate: "",
    leaveDate: "",
    about: "",
    isEmployee: true,
  });
  const [cardData, setCardData] = useState({
    email: currentUser?.email,
    educations: [],
    address: {},
    employments: [],
  });

  const [usersCardData, setUsersCardData] = useState(
    JSON.parse(localStorage.getItem("usersCardData")) || []
  );

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [tab, setTab] = useState("profile");
  const [editMode, setEditMode] = useState({ type: "", index: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: "", index: null });

  const { t } = useTranslation();

  const tabs = [
    { label: t("Personal Details"), value: "profile" },
    { label: t("Educational Details"), value: "education" },
    { label: t("Communication Details"), value: "address" },
    { label: t("Employment Details"), value: "employment" },
  ];

  const inputRefs = useRef({});

  const notify = () => toast("User Saved Sucessfully!");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setEditMode({ type: "", index: null });
    setErrors({});
    if (tab === "profile") inputRefs.current.name?.focus();

    if (tab === "education") {
      inputRefs.current.qualification?.focus();
      resetEducation();
    }

    if (tab === "address") {
      inputRefs.current.currentAddress?.focus();
    }

    if (tab === "employment") {
      inputRefs.current.jobTitle?.focus();
      resetEmployment();
    }
  }, [tab]);

  useEffect(
    () => localStorage.setItem("profileData", JSON.stringify(profileData)),
    [profileData]
  );

  useEffect(() => {
    if (!currentUser) return;

    const profile = profileData.find((u) => u.email === currentUser.email);
    if (profile) {
      setFormData((prev) => ({ ...prev, ...profile }));
    }
    const userCard = usersCardData.find((u) => u.email === currentUser.email);
    if (userCard) {
      setCardData(userCard);
      setAddressData({ ...userCard.address });
    }
  }, [currentUser, profileData, usersCardData, tab]);

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim())
      newErrors.name = t("profilePage.profile.nameError");

    if (!formData.email.trim()) {
      newErrors.email = t("profilePage.profile.emailError");
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = t("profilePage.profile.emailInvalid");
    }

    if (!formData.dob) newErrors.dob = t("profilePage.profile.dobError");

    if (!formData.gender)
      newErrors.gender = t("profilePage.profile.genderError");

    if (!formData.phone.trim()) {
      newErrors.phone = t("profilePage.profile.phoneError");
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = t("profilePage.profile.phoneInvalid");
    }

    if (!formData.social.trim()) {
      newErrors.social = t("profilePage.profile.socialError");
    } else if (!/^https?:\/\/[\w.-]+\.[a-z]{2,}/i.test(formData.social)) {
      newErrors.social = t("profilePage.profile.socialInvalid");
    }
    if (!formData.profilePic) {
      newErrors.profilePic = t("profilePage.profile.profilePicError");
    }
    if (!formData.about) {
      newErrors.about = t("profilePage.profile.aboutError");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEducation = () => {
    let errors = {};

    if (!educationalData.qualification.trim())
      errors.qualification = t("profilePage.education.qualificationError");

    if (!educationalData.college.trim())
      errors.college = t("profilePage.education.collegeError");

    if (!educationalData.startDate)
      errors.startDate = t("profilePage.education.startDateError");

    if (!educationalData.isPursuing && !educationalData.endDate)
      errors.endDate = t("profilePage.education.endDateError");

    const marks = educationalData.marks;

    if (!marks) {
      errors.marks = t("profilePage.education.marksError");
    } else {
      const num = Number(marks);

      if (isNaN(num)) {
        errors.marks = t("profilePage.education.marksInvalid");
      } else if (num < 1 || num > 100) {
        errors.marks = t("profilePage.education.marksRangeError");
      } else if (!/^\d+(\.\d{1,2})?$/.test(marks)) {
        errors.marks = t("profilePage.education.marksDecimalError");
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddress = () => {
    let errors = {};

    if (!addressData.currentAddress.trim())
      errors.currentAddress = t("profilePage.address.currentAddressError");

    if (!addressData.currentCity.trim())
      errors.currentCity = t("profilePage.address.currentCityError");

    if (!addressData.currentState.trim())
      errors.currentState = t("profilePage.address.currentStateError");

    if (!addressData.currentCountry.trim())
      errors.currentCountry = t("profilePage.address.currentCountryError");

    if (!addressData.currentZipCode.trim())
      errors.currentZipCode = t("profilePage.address.currentZipCodeError");

    if (!addressData.sameAsCurrent) {
      if (!addressData.permanentAddress.trim())
        errors.permanentAddress = t(
          "profilePage.address.permanentAddressError"
        );
      if (!addressData.city.trim())
        errors.city = t("profilePage.address.cityError");

      if (!addressData.state.trim())
        errors.state = t("profilePage.address.stateError");

      if (!addressData.country.trim())
        errors.country = t("profilePage.address.countryError");

      if (!/^\d{6}$/.test(addressData.zipCode))
        errors.zipCode = t("profilePage.address.zipCodeError");
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEmployment = () => {
    let errors = {};

    if (!employmentData.jobTitle.trim())
      errors.jobTitle = t("profilePage.employment.jobTitleError");

    if (!employmentData.company.trim())
      errors.company = t("profilePage.employment.companyError");

    if (!employmentData.joiningDate)
      errors.joiningDate = t("profilePage.employment.joiningDateError");

    if (!employmentData.isEmployee && !employmentData.leaveDate)
      errors.leaveDate = t("profilePage.employment.leaveDateError");

    if (!employmentData.about.trim())
      errors.about = t("profilePage.employment.aboutError");

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const updatedUser = { ...currentUser, ...formData };
    updateCurrentUser(updatedUser);

    let updatedProfiles = [];
    const exists = profileData.some((u) => u.email === updatedUser.email);

    if (exists) {
      updatedProfiles = profileData.map((u) =>
        u.email === updatedUser.email ? updatedUser : u
      );
    } else {
      updatedProfiles = [...profileData, updatedUser];
    }

    setProfileData(updatedProfiles);
    localStorage.setItem("profileData", JSON.stringify(updatedProfiles));
    toast.success("Profile Updated Successfully!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobChange = (e) => {
    const { type, name, value, checked } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    let updatedData = {
      ...employmentData,
      [name]: type === "checkbox" ? checked : value,
    };
    if (name === "isEmployee" && checked) {
      updatedData.leaveDate = "";
    }
    setEmploymentData(updatedData);
  };
  const handleAddressChange = (e) => {
    const { type, name, value, checked } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    let updated = {
      ...addressData,
      [name]: type === "checkbox" ? checked : value,
    };

    if (name === "sameAsCurrent") {
      if (checked) {
        updated.permanentAddress = updated.currentAddress;
        updated.city = updated.currentCity;
        updated.state = updated.currentState;
        updated.country = updated.currentCountry;
        updated.zipCode = updated.currentZipCode;
      } else {
        updated.permanentAddress = "";
        updated.city = "";
        updated.state = "";
        updated.country = "";
        updated.zipCode = "";
      }
    }

    if (
      addressData.sameAsCurrent &&
      [
        "currentAddress",
        "currentCity",
        "currentState",
        "currentCountry",
        "currentZipCode",
      ].includes(name)
    ) {
      updated.permanentAddress =
        name === "currentAddress" ? value : updated.permanentAddress;
      updated.city = name === "currentCity" ? value : updated.city;
      updated.state = name === "currentState" ? value : updated.state;
      updated.country = name === "currentCountry" ? value : updated.country;
      updated.zipCode = name === "currentZipCode" ? value : updated.zipCode;
    }

    setAddressData(updated);
  };

  const handleEducationChange = (e) => {
    const { type, name, value, checked } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    let updatedValue = type === "checkbox" ? checked : value;

    if (name === "marks") {
      if (value === "") {
        setEducationalData((prev) => ({ ...prev, marks: "" }));
        return;
      }
      if (/^0\d+/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          marks: "Leading zeros are not allowed",
        }));
        return;
      }
      if (!/^\d{1,3}$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          marks: "Percentage must be a valid number",
        }));
        return;
      }
      const num = Number(value);
      if (num <= 0 || num > 100) {
        setErrors((prev) => ({
          ...prev,
          marks: "Percentage must be between 1 and 100",
        }));
        return;
      }
    }

    let updatedData = {
      ...educationalData,
      [name]: updatedValue,
    };

    if (name === "isPursuing" && checked) {
      updatedData.endDate = "";
    }

    setEducationalData(updatedData);
  };

  const resetAddress = () => {
    setAddressData({
      currentAddress: "",
      currentCity: "",
      currentState: "",
      currentCountry: "",
      currentZipCode: "",

      permanentAddress: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",

      sameAsCurrent: false,
    });
  };

  const resetEducation = () => {
    setEducationalData({
      qualification: "",
      college: "",
      startDate: "",
      endDate: "",
      marks: "",
      isPursuing: false,
    });
  };

  const resetEmployment = () => {
    setEmploymentData({
      jobTitle: "",
      company: "",
      joiningDate: "",
      leaveDate: "",
      about: "",
      isEmployee: true,
    });
  };

  const resetProfile = () => {
    setFormData({
      name: "",
      email: currentUser?.email || "",
      dob: "",
      gender: "",
      phone: "",
      social: "",
      profilePic: currentUser?.profilePic || "",
      about: "",
    });
  };

  const handleAddData = () => {
    let updatedUserCard = { ...cardData };

    if (tab === "education" && !validateEducation()) return;
    if (tab === "address" && !validateAddress()) return;
    if (tab === "employment" && !validateEmployment()) return;

    if (tab === "education") {
      const isDuplicate = updatedUserCard.educations.some(
        (edu) =>
          edu.qualification?.trim().toLowerCase() ===
            educationalData.qualification?.trim().toLowerCase() &&
          edu.startDate === educationalData.startDate
      );

      if (!editMode.type && isDuplicate) {
        toast.error("This education is already added");
        return;
      }

      if (editMode.type === "education") {
        updatedUserCard.educations[editMode.index] = educationalData;
      } else {
        updatedUserCard.educations = [
          ...updatedUserCard.educations,
          educationalData,
        ];
      }

      resetEducation();
    }

    if (tab === "address") {
      updatedUserCard.address = { ...addressData };
      resetAddress();
    }

    if (tab === "employment") {
      if (editMode.type === "employment") {
        updatedUserCard.employments[editMode.index] = employmentData;
      } else {
        updatedUserCard.employments = [
          ...updatedUserCard.employments,
          employmentData,
        ];
      }
      resetEmployment();
    }

    updateCardAndLocal(updatedUserCard);
    setEditMode({ type: "", index: null });
    toast.success("Data Added Successfully!");
  };

  const handleEdit = (type, index) => {
    setEditMode({ type, index });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (type === "education") {
      setEducationalData(cardData.educations[index]);
    }
    if (type === "employment") {
      setEmploymentData(cardData.employments[index]);
    }
    if (type === "address") {
      setAddressData(cardData.address);
    }
  };

  const handleDeleteClick = (type, index) => {
    setDeleteTarget({ type, index });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const { type, index } = deleteTarget;

    let updatedUserCard = { ...cardData };

    if (type === "education") {
      updatedUserCard.educations = updatedUserCard.educations.filter(
        (_, i) => i !== index
      );
    }

    if (type === "employment") {
      updatedUserCard.employments = updatedUserCard.employments.filter(
        (_, i) => i !== index
      );
    }

    if (type === "address") {
      updatedUserCard.address = {
        permanentAddress: "",
        currentAddress: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      };
    }

    updateCardAndLocal(updatedUserCard);

    setShowDeleteModal(false);
    setDeleteTarget({ type: "", index: null });
  };

  const updateCardAndLocal = (updatedCard) => {
    setCardData(updatedCard);

    let updatedList = [];
    const exists = usersCardData.some((u) => u.email === updatedCard.email);

    if (exists) {
      updatedList = usersCardData.map((u) =>
        u.email === updatedCard.email ? updatedCard : u
      );
    } else {
      updatedList = [...usersCardData, updatedCard];
    }
    setUsersCardData(updatedList);
    localStorage.setItem("usersCardData", JSON.stringify(updatedList));
  };

  const handleKeyDown = (e, nextFieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldName === "email") {
        inputRefs.current.dob?.focus();
      } else if (nextFieldName === "endDate") {
        inputRefs.current.marks?.focus();
      } else if (nextFieldName === "leaveDate") {
        inputRefs.current.about?.focus();
      } else if (nextFieldName === "currentAddress") {
        inputRefs.current.city?.focus();
      } else if (
        nextFieldName === "permanentAddress" &&
        addressData.sameAsCurrent
      ) {
        inputRefs.current.save?.focus();
      }

      if (nextFieldName && inputRefs.current[nextFieldName]) {
        inputRefs.current[nextFieldName].focus();
      }
    }
  };

  const MAX_IMAGE_SIZE = 200 * 1024;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setErrors((prev) => ({ ...prev, profilePic: "" }));

    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image too large!");
      return;
    }

    const imageURL = URL.createObjectURL(file);
    setPreviewUrl(imageURL);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      setFormData((prev) => ({
        ...prev,
        profilePic: base64Image,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center w-full   dark:bg-[#0a0f24] blue:bg-[#121212]">
      <div className="w-full flex  flex-col md:flex-row lg:flex-row gap-6 px-6 py-3 ">
        <ProfileCard
          previewUrl={previewUrl}
          currentUser={currentUser}
          handleImageUpload={handleImageUpload}
          navigate={navigate}
          errors={errors}
        />

        <div className="light:bg-white dark:bg-[#141b34] blue:bg-[#282828]  shadow-md w-full rounded-2xl p-6">
          <TabComponent tabs={tabs} setTab={setTab} tab={tab} />
          {tab === "profile" && (
            <div className="mt-2">
              <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-5 mt-3">
                <InputComponent
                  label={t("profilePage.profile.name")}
                  icon={User}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("profilePage.profile.placeholder.name")}
                  error={errors.name}
                  ref={(el) => (inputRefs.current.name = el)}
                  onKeyDown={(e) => handleKeyDown(e, "email")}
                />

                <InputComponent
                  label={t("profilePage.profile.email")}
                  type="email"
                  icon={Mail}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={currentUser}
                  placeholder={t("profilePage.profile.placeholder.email")}
                  error={errors.email}
                  ref={(el) => (inputRefs.current.email = el)}
                  onKeyDown={(e) => handleKeyDown(e, "dob")}
                />

                <InputComponent
                  label={t("profilePage.profile.dob")}
                  type="date"
                  icon={Calendar}
                  max={today}
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder={t("profilePage.profile.placeholder.dob")}
                  error={errors.dob}
                  ref={(el) => (inputRefs.current.dob = el)}
                  onKeyDown={(e) => handleKeyDown(e, "gender")}
                />

                <div className="flex flex-col">
                  <label className="text-sm font-medium light:text-gray-700 dark:text-white blue:text-[#ffffff] dark:border-gray-500 flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      <PersonStanding
                        size={18}
                        className="dark:text-white blue:text-[#fdf379]"
                      />
                      {t("profilePage.profile.gender")}{" "}
                      <span className="text-red-500">*</span>
                    </div>
                  </label>

                  <select
                    className={`border p-2 mt-1 rounded-lg dark:bg-[#1c2442] dark:text-[#cbd5e1] blue:bg-[#282828] blue:text-[#ffffff] light:focus:outline-blue-500 ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    ref={(el) => (inputRefs.current.gender = el)}
                    onKeyDown={(e) => handleKeyDown(e, "phone")}
                  >
                    <option value="">
                      {t("profilePage.profile.selectGender")}
                    </option>
                    <option value="male">
                      {t("profilePage.profile.male")}
                    </option>
                    <option value="female">
                      {t("profilePage.profile.female")}
                    </option>
                    <option value="other">
                      {t("profilePage.profile.other")}
                    </option>
                  </select>

                  {errors.gender && (
                    <p className="dark:text-red-400 light:text-red-500 text-xs mt-1 blue:text-red-400">
                      {errors.gender}
                    </p>
                  )}
                </div>

                <InputComponent
                  label={t("profilePage.profile.phone")}
                  icon={Phone}
                  name="phone"
                  type="text"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("profilePage.profile.placeholder.phone")}
                  error={errors.phone}
                  ref={(el) => (inputRefs.current.phone = el)}
                  onKeyDown={(e) => handleKeyDown(e, "social")}
                />

                <InputComponent
                  label={t("profilePage.profile.social")}
                  icon={LinkIcon}
                  name="social"
                  type="text"
                  value={formData.social}
                  onChange={handleChange}
                  placeholder={t("profilePage.profile.placeholder.social")}
                  error={errors.social}
                  ref={(el) => (inputRefs.current.social = el)}
                  onKeyDown={(e) => handleKeyDown(e, "about")}
                />
              </div>

              <InputComponent
                label={t("profilePage.profile.about")}
                name="about"
                icon={User2Icon}
                type="text"
                value={formData.about}
                as="textarea"
                onChange={handleChange}
                maxLength={250}
                placeholder={t("profilePage.profile.placeholder.about")}
                error={errors.about}
                ref={(el) => (inputRefs.current.about = el)}
                onKeyDown={(e) => handleKeyDown(e, "save")}
              />

              <Button
                handleSubmit={handleSubmit}
                handleKeyDown={handleKeyDown}
                setTab={setTab}
                isAdd={true}
                isReset={true}
                isNext={true}
                tab="education"
                currentTab={tab}
                handleReset={resetProfile}
                saveRef={(el) => (inputRefs.current.save = el)}
                resetRef={(el) => (inputRefs.current.reset = el)}
                nextRef={(el) => (inputRefs.current.next = el)}
              />
            </div>
          )}

          {tab === "education" && (
            <div className="mt-2">
              <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-5 mt-3">
                <SelectComponent
                  label={t("profilePage.education.qualification")}
                  required={true}
                  options={[
                    { value: "10th", label: t("profilePage.education.10th") },
                    { value: "12th", label: t("profilePage.education.12th") },
                    {
                      value: "Graducation",
                      label: t("profilePage.education.Graduation"),
                    },
                  ]}
                  value={educationalData.qualification}
                  onChange={handleEducationChange}
                  name="qualification"
                  selectRef={(el) => (inputRefs.current.qualification = el)}
                  onKeyDown={(e) => handleKeyDown(e, "college")}
                  error={errors.qualification}
                  icon={GraduationCap}
                />

                <InputComponent
                  label={t("profilePage.education.college")}
                  icon={University}
                  name="college"
                  value={educationalData.college}
                  onChange={handleEducationChange}
                  placeholder={t("profilePage.education.placeholder.college")}
                  error={errors.college}
                  ref={(el) => (inputRefs.current.college = el)}
                  onKeyDown={(e) => handleKeyDown(e, "startDate")}
                />

                <InputComponent
                  label={t("profilePage.education.startDate")}
                  type="date"
                  icon={Calendar1}
                  name="startDate"
                  min="1980-01-01"
                  max={today}
                  value={educationalData.startDate}
                  onChange={handleEducationChange}
                  placeholder={t("profilePage.education.placeholder.startDate")}
                  error={errors.startDate}
                  ref={(el) => (inputRefs.current.startDate = el)}
                  onKeyDown={(e) => handleKeyDown(e, "endDate")}
                />

                <div>
                  <InputComponent
                    label={t("profilePage.education.endDate")}
                    type="date"
                    icon={Calendar1}
                    name="endDate"
                    min={educationalData.startDate || "1980-01-01"}
                    value={educationalData.endDate}
                    disabled={educationalData.isPursuing}
                    onChange={handleEducationChange}
                    placeholder={t("profilePage.education.placeholder.endDate")}
                    error={errors.endDate}
                    ref={(el) => (inputRefs.current.endDate = el)}
                    onKeyDown={(e) => handleKeyDown(e, "isPursuing")}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      name="isPursuing"
                      checked={educationalData.isPursuing}
                      onChange={handleEducationChange}
                      ref={(el) => (inputRefs.current.isPursuing = el)}
                      onKeyDown={(e) => handleKeyDown(e, "marks")}
                    />
                    <span className="dark:text-gray-200 blue:text-white">
                      {t("profilePage.education.pursuing")}
                    </span>
                  </div>
                </div>

                <InputComponent
                  label={t("profilePage.education.percentage")}
                  icon={Percent}
                  name="marks"
                  maxLength={3}
                  value={educationalData.marks}
                  onChange={handleEducationChange}
                  placeholder={t(
                    "profilePage.education.placeholder.percentage"
                  )}
                  error={errors.marks}
                  ref={(el) => (inputRefs.current.marks = el)}
                  onKeyDown={(e) => handleKeyDown(e, "save")}
                />
              </div>

              <Button
                handleSubmit={handleAddData}
                setTab={setTab}
                isAdd={true}
                isReset={true}
                isNext={true}
                currentTab={tab}
                tab="address"
                handleReset={resetEducation}
                editMode={editMode}
                handleKeyDown={handleKeyDown}
                saveRef={(el) => (inputRefs.current.save = el)}
                resetRef={(el) => (inputRefs.current.reset = el)}
                nextRef={(el) => (inputRefs.current.next = el)}
              />
            </div>
          )}

          {tab === "address" && (
            <div className="mt-2">
              <h2 className="text-lg font-semibold mt-3">
                {t("profilePage.address.currentAddress")}
              </h2>

              <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-5 mt-3">
                <InputComponent
                  label={t("profilePage.address.currentAddress")}
                  icon={MapPinHouse}
                  name="currentAddress"
                  value={addressData.currentAddress}
                  onChange={handleAddressChange}
                  placeholder={t(
                    "profilePage.address.placeholder.currentAddress"
                  )}
                  error={errors.currentAddress}
                  ref={(el) => (inputRefs.current.currentAddress = el)}
                  onKeyDown={(e) => handleKeyDown(e, "currentCity")}
                />

                <InputComponent
                  label={t("profilePage.address.city")}
                  icon={Building2}
                  name="currentCity"
                  value={addressData.currentCity}
                  onChange={handleAddressChange}
                  placeholder={t("profilePage.address.placeholder.city")}
                  error={errors.currentCity}
                  ref={(el) => (inputRefs.current.currentCity = el)}
                  onKeyDown={(e) => handleKeyDown(e, "currentState")}
                />

                <InputComponent
                  label={t("profilePage.address.state")}
                  icon={Building2}
                  name="currentState"
                  value={addressData.currentState}
                  onChange={handleAddressChange}
                  placeholder={t("profilePage.address.placeholder.state")}
                  error={errors.currentState}
                  ref={(el) => (inputRefs.current.currentState = el)}
                  onKeyDown={(e) => handleKeyDown(e, "currentCountry")}
                />

                <InputComponent
                  label={t("profilePage.address.country")}
                  icon={Flag}
                  name="currentCountry"
                  value={addressData.currentCountry}
                  onChange={handleAddressChange}
                  placeholder={t("profilePage.address.placeholder.country")}
                  error={errors.currentCountry}
                  ref={(el) => (inputRefs.current.currentCountry = el)}
                  onKeyDown={(e) => handleKeyDown(e, "currentZipCode")}
                />

                <InputComponent
                  label={t("profilePage.address.zipCode")}
                  icon={ScrollText}
                  name="currentZipCode"
                  value={addressData.currentZipCode}
                  onChange={handleAddressChange}
                  maxLength={6}
                  placeholder={t("profilePage.address.placeholder.zipCode")}
                  error={errors.currentZipCode}
                  ref={(el) => (inputRefs.current.currentZipCode = el)}
                  onKeyDown={(e) => handleKeyDown(e, "sameAsCurrent")}
                />
              </div>

              <div className="mt-4 flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  name="sameAsCurrent"
                  checked={addressData.sameAsCurrent}
                  ref={(el) => (inputRefs.current.sameAsCurrent = el)}
                  onKeyDown={(e) => handleKeyDown(e, "permanentAddress")}
                  onChange={(e) => {
                    handleAddressChange(e);
                    if (e.target.checked) {
                      if (typeof e.persist === "function") e.persist();
                    }
                  }}
                />

                <label className="text-sm font-medium cursor-pointer dark:text-gray-200 blue:text-white">
                  {t("profilePage.address.sameAsCurrent")}
                </label>
              </div>

              <h2 className="text-lg font-semibold mt-6">
                {t("profilePage.address.permanentAddress")}
              </h2>

              <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-5 mt-3">
                <InputComponent
                  label={t("profilePage.address.permanentAddress")}
                  icon={MapPinHouse}
                  name="permanentAddress"
                  value={addressData.permanentAddress}
                  onChange={handleAddressChange}
                  placeholder={t(
                    "profilePage.address.placeholder.permanentAddress"
                  )}
                  disabled={addressData.sameAsCurrent}
                  error={errors.permanentAddress}
                  ref={(el) => (inputRefs.current.permanentAddress = el)}
                  onKeyDown={(e) => handleKeyDown(e, "city")}
                />

                <InputComponent
                  label={t("profilePage.address.city")}
                  icon={Building2}
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  placeholder={t("profilePage.address.placeholder.city")}
                  disabled={addressData.sameAsCurrent}
                  error={errors.city}
                  ref={(el) => (inputRefs.current.city = el)}
                  onKeyDown={(e) => handleKeyDown(e, "state")}
                />

                <InputComponent
                  label={t("profilePage.address.state")}
                  icon={Building2}
                  name="state"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  placeholder={t("profilePage.address.placeholder.state")}
                  disabled={addressData.sameAsCurrent}
                  error={errors.state}
                  ref={(el) => (inputRefs.current.state = el)}
                  onKeyDown={(e) => handleKeyDown(e, "country")}
                />

                <InputComponent
                  label={t("profilePage.address.country")}
                  icon={Flag}
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  placeholder={t("profilePage.address.placeholder.country")}
                  disabled={addressData.sameAsCurrent}
                  error={errors.country}
                  ref={(el) => (inputRefs.current.country = el)}
                  onKeyDown={(e) => handleKeyDown(e, "zipCode")}
                />

                <InputComponent
                  label={t("profilePage.address.zipCode")}
                  icon={ScrollText}
                  name="zipCode"
                  maxLength={6}
                  inputMode="numeric"
                  value={addressData.zipCode}
                  onChange={handleAddressChange}
                  placeholder={t("profilePage.address.placeholder.zipCode")}
                  disabled={addressData.sameAsCurrent}
                  error={errors.zipCode}
                  ref={(el) => (inputRefs.current.zipCode = el)}
                  onKeyDown={(e) => handleKeyDown(e, "save")}
                />
              </div>

              <Button
                handleSubmit={handleAddData}
                setTab={setTab}
                isAdd={true}
                isReset={true}
                isNext={true}
                tab="employment"
                currentTab={tab}
                handleReset={resetAddress}
                handleKeyDown={handleKeyDown}
                saveRef={(el) => (inputRefs.current.save = el)}
                resetRef={(el) => (inputRefs.current.reset = el)}
                nextRef={(el) => (inputRefs.current.next = el)}
              />
            </div>
          )}

          {tab === "employment" && (
            <div className="mt-2">
              <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-5 mt-3">
                <InputComponent
                  label={t("profilePage.employment.jobTitle")}
                  icon={GraduationCap}
                  name="jobTitle"
                  value={employmentData.jobTitle}
                  onChange={handleJobChange}
                  placeholder={t("profilePage.employment.placeholder.jobTitle")}
                  error={errors.jobTitle}
                  ref={(el) => (inputRefs.current.jobTitle = el)}
                  onKeyDown={(e) => handleKeyDown(e, "company")}
                />
                <InputComponent
                  label={t("profilePage.employment.company")}
                  icon={University}
                  name="company"
                  value={employmentData.company}
                  onChange={handleJobChange}
                  placeholder={t("profilePage.employment.placeholder.company")}
                  error={errors.company}
                  ref={(el) => (inputRefs.current.company = el)}
                  onKeyDown={(e) => handleKeyDown(e, "joiningDate")}
                />
                <InputComponent
                  label={t("profilePage.employment.joiningDate")}
                  type="date"
                  icon={Calendar1}
                  name="joiningDate"
                  max={today}
                  value={employmentData.joiningDate}
                  onChange={handleJobChange}
                  placeholder={t(
                    "profilePage.employment.placeholder.joiningDate"
                  )}
                  error={errors.joiningDate}
                  ref={(el) => (inputRefs.current.joiningDate = el)}
                  onKeyDown={(e) => handleKeyDown(e, "leaveDate")}
                />
                <div>
                  <InputComponent
                    label={t("profilePage.employment.leaveDate")}
                    type="date"
                    icon={Calendar1}
                    name="leaveDate"
                    min={employmentData.joiningDate}
                    value={employmentData.leaveDate}
                    onChange={handleJobChange}
                    disabled={employmentData.isEmployee}
                    placeholder={t(
                      "profilePage.employment.placeholder.leaveDate"
                    )}
                    error={errors.leaveDate}
                    ref={(el) => (inputRefs.current.leaveDate = el)}
                    onKeyDown={(e) => handleKeyDown(e, "isEmployee")}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      name="isEmployee"
                      checked={employmentData.isEmployee}
                      onChange={handleJobChange}
                      ref={(el) => (inputRefs.current.isEmployee = el)}
                      onKeyDown={(e) => handleKeyDown(e, "about")}
                    />
                    <span className="dark:text-gray-200 blue:text-white">
                      {t("profilePage.employment.isEmployee")}
                    </span>
                  </div>
                </div>
              </div>

              <InputComponent
                label={t("profilePage.employment.description")}
                icon={UserPen}
                name="about"
                as="textarea"
                maxLength={250}
                value={employmentData.about}
                onChange={handleJobChange}
                placeholder={t(
                  "profilePage.employment.placeholder.description"
                )}
                error={errors.about}
                ref={(el) => (inputRefs.current.about = el)}
                onKeyDown={(e) => handleKeyDown(e, "save")}
              />

              <Button
                handleSubmit={handleAddData}
                currentTab={tab}
                isAdd={true}
                isReset={true}
                isNext={false}
                handleReset={resetEmployment}
                handleKeyDown={handleKeyDown}
                editMode={editMode}
                saveRef={(el) => (inputRefs.current.save = el)}
                resetRef={(el) => (inputRefs.current.reset = el)}
                nextRef={(el) => (inputRefs.current.next = el)}
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex px-6 py-3">
        <UserDetailsCard
          data={[cardData]}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          tab={tab}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          deleteTarget={deleteTarget}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default Profilepage;
